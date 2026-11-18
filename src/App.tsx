import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function App() {
  return (
    <>
      <div className="flex items-center justify-center">
        <button className="btn btn-primary">Tailwind и DaisyUI работают</button>
      </div>
      <div className="w-screen h-screen bg-base-300">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} />
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="orange" />
          </mesh>
          <OrbitControls />
        </Canvas>
      </div>
    </>

  );
}

export default App;
