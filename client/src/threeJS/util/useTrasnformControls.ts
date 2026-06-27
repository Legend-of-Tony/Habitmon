import { useControls } from "leva";

export function useTransformControls() {
    const {rotationX, rotationY, rotationZ } = useControls({
        rotationX: {value: 0, min: -Math.PI, max: Math.PI, step:0.01 },
        rotationY: {value: 0, min: -Math.PI, max: Math.PI, step:0.01 },
        rotationZ: {value: 0, min: -Math.PI, max: Math.PI, step:0.01 },

    })
    const {positionX, positionY, positionZ } = useControls({
        positionX: {value: 0, min: -5, max: 5, step:0.01 },
        positionY: {value: 0, min: -5, max: 5, step:0.01 },
        positionZ: {value: 0, min: -5, max: 5, step:0.01 },

    })
    const {camX, camY, camZ, fov} = useControls({
        camX: {value: 0, min: -20, max: 20, step: 0.1},
        camY: {value: 0, min: -20, max: 20, step: 0.1},
        camZ: {value: 0, min: -20, max: 20, step: 0.1},
        fov:  {value: 50, min: 10, max: 120, step: 1 },
    })
    const { targetX, targetY, targetZ } = useControls('Target', {
        targetX: { value: 0, min: -10, max: 10, step: 0.1 },
        targetY: { value: 0, min: -10, max: 10, step: 0.1 },
        targetZ: { value: 0, min: -10, max: 10, step: 0.1 },
    })


    return {
        rotation: [rotationX, rotationY, rotationZ] as [number, number,number],
        position: [positionX, positionY, positionZ] as [number, number, number],
        cameraPosition: [camX, camY, camZ] as [number, number, number],
        fov: fov as number,
        target: [targetX, targetY, targetZ] as [number, number, number]
    }
}