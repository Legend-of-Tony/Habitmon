import { useThree } from "@react-three/fiber";
import * as THREE from 'three'

type Props = {
    position: [number, number, number]
    fov: number
    target: [number, number, number]
}

export function CameraController({ position, fov, target }: Props) {
  const { camera } = useThree()
  camera.position.set(...position)
  camera.lookAt(...target)
  ;(camera as THREE.PerspectiveCamera).fov = fov
  ;(camera as THREE.PerspectiveCamera).updateProjectionMatrix()
  return null
}