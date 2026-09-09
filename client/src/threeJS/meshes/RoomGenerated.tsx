import { useMemo } from 'react'
import { createPortal } from '@react-three/fiber'
import { useGLTF, PerspectiveCamera } from '@react-three/drei'
import type { Creature } from '../../features/creatures/types'
import { HABITMON_ASSETS, SPAWN_NODE } from '../habitmonConfig'
import { Baby } from './Baby'

export function Room({ creature }: { creature: Creature }) {
  const { scene } = useGLTF(HABITMON_ASSETS.roomUrl)
  const room = useMemo(() => scene.clone(true), [scene])
  const spawn = room.getObjectByName(SPAWN_NODE)
  if (!spawn) throw new Error('Room asset is missing HabitmonSpawn')
  return <>
    <primitive object={room} dispose={null} />
    <PerspectiveCamera makeDefault={true} far={1000} near={0.1} fov={40.853} position={[0, -0.444, 3.454]} rotation={[-0.205, 0, 0]} />
    {/* Parenting the complete root at the Empty inherits the exact world matrix,
        including nested rotations, nonuniform scales and future room transforms. */}
    {createPortal(<group><Baby creature={creature} /></group>, spawn)}
  </>
}
