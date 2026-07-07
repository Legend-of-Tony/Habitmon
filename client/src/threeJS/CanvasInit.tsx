import { Canvas} from '@react-three/fiber'
import { Forest } from './meshes/Forest'

{/*
    import {useTransformControls} from './util/useTrasnformControls'
*/}
import { CameraController } from './util/CameraController'


const CanvasInit = () => {

{/*const {rotation, position, cameraPosition, fov, target} = useTransformControls()*/}


  return (
    <div id= 'canvas-container' className='w-full h-screen'>
      <Canvas > 
        <CameraController position={[-0.8,2.3,3.5]} fov={50} target={[0,1.6,0]}/>
        <Forest rotation={[0,2.51,0]} position={[-2.5,0.09,0]}/>
        
        
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} />
      </Canvas>
    </div>
  )
}


export default CanvasInit