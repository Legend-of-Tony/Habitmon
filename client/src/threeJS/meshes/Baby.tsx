import { useEffect, useMemo } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import type { Creature } from '../../features/creatures/types'
import { HABITMON_ASSETS } from '../habitmonConfig'
import { assembleCreature } from '../appearance'

export function Baby({ creature }: { creature: Creature }) {
  const { scene } = useGLTF(HABITMON_ASSETS.creatureUrl)
  const [eyes, mouth] = useTexture([HABITMON_ASSETS.eyesUrl, HABITMON_ASSETS.mouthsUrl])
  const assembled = useMemo(() => assembleCreature(scene, creature, eyes, mouth), [scene, creature, eyes, mouth])
  useEffect(() => () => assembled.dispose(), [assembled])
  return <primitive object={assembled.scene} dispose={null} />
}
