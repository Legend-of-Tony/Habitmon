import { Component, Suspense } from 'react'
import type { ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Link } from 'react-router'
import { Room } from './meshes/RoomGenerated'
import { useAuth } from '../context/useAuth'
import { useCreature } from '../features/creatures/useCreature'

class SceneError extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) return <div role="alert">{this.state.error.message} <button onClick={() => window.location.reload()}>Reload scene</button></div>
    return this.props.children
  }
}

const CanvasInit = () => {
  const { user, loading, error: authError, refreshAuth } = useAuth()
  const { creature, error, retry } = useCreature(loading ? undefined : user?.id)
  if (loading) return <p role="status">Loading account…</p>
  if (authError) return <div role="alert">{authError} <button onClick={() => void refreshAuth()}>Retry</button></div>
  if (!user) return <p><Link to="/login">Sign in</Link> to meet your Habitmon.</p>
  if (error) return <div role="alert">{error} <button onClick={retry}>Retry</button> <Link to="/login">Sign in</Link></div>
  if (!creature) return <p role="status">Loading your Habitmon…</p>
  return <div id="canvas-container" className="h-full min-h-0 w-full overflow-hidden">
    <SceneError key={creature.id}>
      <Canvas>
        <Suspense fallback={<Html center><p role="status">Loading Habitmon scene…</p></Html>}>
          <Room creature={creature} />
        </Suspense>
        <ambientLight intensity={0.8} />
        <directionalLight position={[0, 0, 5]} />
      </Canvas>
    </SceneError>
  </div>
}
export default CanvasInit
