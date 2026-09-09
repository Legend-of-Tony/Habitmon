import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { Group, Mesh, MeshBasicMaterial, Texture, Bone, SkinnedMesh, Skeleton, BufferGeometry, Float32BufferAttribute, SRGBColorSpace } from 'three'
import { atlasTexture, assembleCreature, normalizedFaceGeometry } from '../src/threeJS/appearance'
import { EAR_VARIANTS, HABITMON_PALETTES, HORN_VARIANTS, TAIL_VARIANTS, SPAWN_NODE } from '../src/threeJS/habitmonConfig'

const appearance = { id: 1, user_id: 1, xp: 0, ear_variant: 'ear_2', tail_variant: 'tail_1', horn_variant: null, palette_variant: 'ocean', eye_index: 0, mouth_index: 15, created_at: '', updated_at: '' } as const
function sourceScene() {
  const scene = new Group()
  const bone = new Bone(); scene.add(bone)
  for (const name of [...Object.keys(EAR_VARIANTS), ...Object.keys(TAIL_VARIANTS), ...Object.keys(HORN_VARIANTS)]) {
    const mesh = new SkinnedMesh(new BufferGeometry(), new MeshBasicMaterial())
    mesh.name = name; scene.add(mesh); mesh.bind(new Skeleton([bone]))
  }
  for (const name of ['eye', 'mouth']) {
    const material = new MeshBasicMaterial(); material.name = name
    const geometry = new BufferGeometry(); geometry.setAttribute('uv', new Float32BufferAttribute([.03, .04, .24, .22], 2))
    scene.add(new Mesh(geometry, material))
  }
  for (const name of ['body', 'Accent']) {
    const material = new MeshBasicMaterial(); material.name = name
    const mesh = new Mesh(new BufferGeometry(), material); mesh.name = name + '_fixture'; scene.add(mesh)
  }
  return scene
}
describe('appearance', () => {
  test('normalizes authored face UVs without mutating cached geometry', () => {
    const original = new BufferGeometry()
    original.setAttribute('uv', new Float32BufferAttribute([.03, .04, .24, .22], 2))
    const normalized = normalizedFaceGeometry(original)
    expect(Array.from(normalized.getAttribute('uv').array)).toEqual([0, 0, 1, 1])
    expect(original.getAttribute('uv').getX(0)).toBeCloseTo(.03)
  })
  test('all 16 cells use the specified top-left ordering and isolated textures', () => {
    const source = new Texture()
    for (let i = 0; i < 16; i++) {
      const t = atlasTexture(source, i)
      expect(t.repeat.toArray()).toEqual([.25, .25])
      expect(t.offset.toArray()).toEqual([(i % 4) / 4, 1 - (Math.floor(i / 4) + 1) / 4])
      expect(t.flipY).toBe(false); expect(t.colorSpace).toBe(SRGBColorSpace)
      t.dispose()
    }
    expect(source.repeat.toArray()).toEqual([1, 1])
    for (const i of [-1, 16, .5, NaN]) expect(() => atlasTexture(source, i)).toThrow()
  })
  test('skinned parts and textures are independent across creatures', () => {
    const source = sourceScene(); const texture = new Texture()
    const a = assembleCreature(source, appearance, texture, texture)
    const b = assembleCreature(source, { ...appearance, ear_variant: 'ear_1', tail_variant: null, horn_variant: 'horn_1', eye_index: 15 }, texture, texture)
    expect(a.scene.getObjectByName('ear_1')!.visible).toBe(false)
    expect(a.scene.getObjectByName('ear_2')!.visible).toBe(true)
    expect(a.scene.getObjectByName('tail_1')!.visible).toBe(true)
    expect(a.scene.getObjectByName('horn_1')!.visible).toBe(false)
    expect(b.scene.getObjectByName('tail_1')!.visible).toBe(false)
    expect(b.scene.getObjectByName('tail_2')!.visible).toBe(false)
    expect(b.scene.getObjectByName('horn_1')!.visible).toBe(true)
    expect(b.scene.getObjectByName('ear_1')!.visible).toBe(true)
    expect(source.getObjectByName('ear_1')!.visible).toBe(true)
    expect((a.scene.getObjectByName('ear_1') as SkinnedMesh).skeleton.bones[0]).not.toBe((source.getObjectByName('ear_1') as SkinnedMesh).skeleton.bones[0])
    a.dispose(); b.dispose()
  })
  test('omitted optional parts are treated as absent for restart compatibility', () => {
    const source = sourceScene(); const texture = new Texture()
    const legacyAppearance = { ...appearance, horn_variant: undefined, tail_variant: undefined }
    const assembled = assembleCreature(source, legacyAppearance, texture, texture)
    expect(assembled.scene.getObjectByName('horn_1')!.visible).toBe(false)
    expect(assembled.scene.getObjectByName('tail_1')!.visible).toBe(false)
    expect(assembled.scene.getObjectByName('tail_2')!.visible).toBe(false)
    assembled.dispose()
  })
  test('applies every approved palette without changing the cached materials', () => {
    const source = sourceScene(); const texture = new Texture()
    for (const [palette_variant, palette] of Object.entries(HABITMON_PALETTES)) {
      const assembled = assembleCreature(source, { ...appearance, palette_variant: palette_variant as keyof typeof HABITMON_PALETTES }, texture, texture)
      expect((assembled.scene.getObjectByName('body_fixture') as Mesh).material).toHaveProperty('color')
      expect(((assembled.scene.getObjectByName('body_fixture') as Mesh).material as MeshBasicMaterial).color.getHexString()).toBe(palette.primary.slice(1))
      expect(((assembled.scene.getObjectByName('Accent_fixture') as Mesh).material as MeshBasicMaterial).color.getHexString()).toBe(palette.accent.slice(1))
      assembled.dispose()
    }
    expect(((source.getObjectByName('body_fixture') as Mesh).material as MeshBasicMaterial).color.getHexString()).toBe('ffffff')
  })
  test('full spawn hierarchy transforms the root without changing the source', () => {
    const room = new Group(); room.rotation.set(.2, .3, .4); room.scale.set(2, 3, 4)
    const spawn = new Group(); spawn.position.set(1, 2, 3); spawn.rotation.set(.4, .1, .3); room.add(spawn)
    const root = new Group(); spawn.add(root); room.updateMatrixWorld(true)
    expect(root.matrixWorld.elements).toEqual(spawn.matrixWorld.elements)
    expect(root.position.toArray()).toEqual([0, 0, 0])
  })
  test('approved names and materials exist in the supplied GLBs', () => {
    const glb = (name: string) => { const b = readFileSync(new URL('../src/assets/models/' + name + '.glb', import.meta.url)); return JSON.parse(b.subarray(20, 20 + b.readUInt32LE(12)).toString()) }
    const baby = glb('baby-habitmon')
    for (const name of [...Object.keys(EAR_VARIANTS), ...Object.keys(TAIL_VARIANTS), ...Object.keys(HORN_VARIANTS)]) expect(baby.nodes.some((n: { name: string; mesh?: number }) => n.name === name && n.mesh !== undefined)).toBe(true)
    expect(baby.materials.some((m: {name: string}) => m.name === 'eye')).toBe(true)
    expect(baby.materials.some((m: {name: string}) => m.name === 'mouth')).toBe(true)
    expect(glb('habitmon_room').nodes.some((n: {name: string}) => n.name === SPAWN_NODE)).toBe(true)
  })
})
