import { Canvas} from '@react-three/fiber'
import {Baby} from './meshes/Baby'
import {Room} from './meshes/RoomGenerated'

{/*
    import {useTransformControls} from './util/useTrasnformControls'
*/}
const CanvasInit = () => {

{/*const {rotation, position, cameraPosition, fov, target} = useTransformControls()*/}


  return (
    <div id='canvas-container' className='h-full min-h-0 w-full overflow-hidden'>
      <Canvas > 
        
        <Room/>
        <Baby/>
        
        
        <ambientLight intensity={0.8} />
        <directionalLight position={[0, 0, 5]} />
      </Canvas>
    </div>
  )
}


export default CanvasInit
