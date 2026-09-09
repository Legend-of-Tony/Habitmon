import { BufferGeometry, Mesh, MeshBasicMaterial, SRGBColorSpace, Texture, Object3D } from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { ATLAS_COLUMNS, ATLAS_ROWS, EAR_VARIANTS, TAIL_VARIANTS, HORN_VARIANTS, HABITMON_PALETTES, PALETTE_MATERIALS, FACE_MATERIALS, NORMALIZE_FACE_UVS } from './habitmonConfig'
import type { Creature } from '../features/creatures/types'

type RenderCreature = Omit<Creature, 'tail_variant' | 'horn_variant' | 'palette_variant'> & {
  tail_variant?: Creature['tail_variant']
  horn_variant?: Creature['horn_variant']
  palette_variant?: Creature['palette_variant']
}

export function normalizedFaceGeometry(source: BufferGeometry) {
  const geometry = source.clone()
  const uv = geometry.getAttribute('uv')
  if (!uv) { geometry.dispose(); throw new Error('Habitmon face has no UVs') }
  let minU = Infinity, minV = Infinity, maxU = -Infinity, maxV = -Infinity
  for (let i = 0; i < uv.count; i++) {
    minU = Math.min(minU, uv.getX(i)); maxU = Math.max(maxU, uv.getX(i))
    minV = Math.min(minV, uv.getY(i)); maxV = Math.max(maxV, uv.getY(i))
  }
  if (!(maxU > minU && maxV > minV)) { geometry.dispose(); throw new Error('Habitmon face has invalid UVs') }
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) - minU) / (maxU - minU), (uv.getY(i) - minV) / (maxV - minV))
  uv.needsUpdate = true
  return geometry
}

export function atlasTexture(source: Texture, index: number) {
  if (!Number.isInteger(index) || index < 0 || index >= ATLAS_COLUMNS * ATLAS_ROWS) {
    throw new Error('Invalid Habitmon atlas index')
  }
  const texture = source.clone()
  texture.flipY = false
  texture.colorSpace = SRGBColorSpace
  texture.repeat.set(1 / ATLAS_COLUMNS, 1 / ATLAS_ROWS)
  texture.offset.set((index % ATLAS_COLUMNS) / ATLAS_COLUMNS, 1 - (Math.floor(index / ATLAS_COLUMNS) + 1) / ATLAS_ROWS)
  texture.needsUpdate = true
  return texture
}

export function assembleCreature(source: Object3D, creature: RenderCreature, eyes: Texture, mouth: Texture) {
  const scene = clone(source)
  const paletteKey = creature.palette_variant ?? 'ocean'
  if (!Object.hasOwn(HABITMON_PALETTES, paletteKey)) {
    throw new Error('Unknown Habitmon palette. Please reload.')
  }
  const palette = HABITMON_PALETTES[paletteKey]
  const setVariantVisibility = (options: Record<string, readonly string[]>, selected: string | null | undefined, required = false) => {
    if ((required && selected == null) || (selected != null && !Object.hasOwn(options, selected))) {
      throw new Error('Unknown Habitmon part. Please reload.')
    }
    for (const [key, names] of Object.entries(options)) {
      for (const name of names) {
        const part = scene.getObjectByName(name)
        if (!part) throw new Error('Habitmon asset is missing part: ' + name)
        part.visible = selected != null && key === selected
      }
    }
  }
  setVariantVisibility(EAR_VARIANTS, creature.ear_variant, true)
  setVariantVisibility(TAIL_VARIANTS, creature.tail_variant)
  setVariantVisibility(HORN_VARIANTS, creature.horn_variant)
  const textures = [atlasTexture(eyes, creature.eye_index), atlasTexture(mouth, creature.mouth_index)]
  const materials: MeshBasicMaterial[] = []
  const geometries: BufferGeometry[] = []
  const found = new Set<string>()
  scene.traverse((object) => {
    // SkinnedMesh extends Mesh; preserve the skeleton, bind matrices and hierarchy.
    if (!(object instanceof Mesh)) return
    const originals = Array.isArray(object.material) ? object.material : [object.material]
    if (NORMALIZE_FACE_UVS && originals.some(m => m.name === FACE_MATERIALS.eyes || m.name === FACE_MATERIALS.mouth)) {
      object.geometry = normalizedFaceGeometry(object.geometry)
      geometries.push(object.geometry)
    }
    const convert = (original: MeshBasicMaterial) => {
      const face = original.name === FACE_MATERIALS.eyes ? 0 : original.name === FACE_MATERIALS.mouth ? 1 : -1
      const color = PALETTE_MATERIALS.primary.includes(original.name as never)
        ? palette.primary
        : PALETTE_MATERIALS.accent.includes(original.name as never)
          ? palette.accent
          : original.color
      const material = new MeshBasicMaterial({
        color: face >= 0 ? 'white' : color,
        map: face >= 0 ? textures[face] : original.map,
        side: original.side,
        transparent: face >= 0 || original.transparent,
        alphaTest: face >= 0 ? 0.05 : original.alphaTest,
        depthWrite: face < 0,
        toneMapped: false,
      })
      if (face >= 0) found.add(original.name)
      materials.push(material)
      return material
    }
    object.material = Array.isArray(object.material) ? object.material.map(convert) : convert(object.material)
  })
  const dispose = () => { materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose()); geometries.forEach(g => g.dispose()) }
  if (found.size !== 2) { dispose(); throw new Error('Habitmon asset is missing eye or mouth materials') }
  return { scene, dispose }
}
