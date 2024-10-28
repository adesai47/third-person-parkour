// src/components/GameScene.tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Player from './Player';
import Platform from './Platform';
import Obstacle from './Obstacle';
import FollowCamera from './FollowCamera'; // Import FollowCamera

// Define multiple platforms for a platformer path
const platforms = [
  { position: [0, -1, 0], size: [10, 1, 10] },     // Starting platform
  { position: [8, 0, -10], size: [3, 1, 3] },      // First platform ahead
  { position: [15, 1, -18], size: [5, 1, 5] },     // Second platform
  { position: [22, 2, -26], size: [3, 1, 3] },     // Third platform
  { position: [30, 3, -34], size: [4, 1, 4] },     // Fourth platform
  { position: [40, 5, -42], size: [6, 1, 6] },     // Fifth platform
  { position: [52, 5, -50], size: [3, 1, 3] },     // Sixth platform
  { position: [60, 6, -58], size: [4, 1, 4] },     // Final platform
];

const GameScene = () => {
  return (
    <Canvas style={{ backgroundColor: '#20232a', height: '100vh' }}>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Camera controls */}
      <OrbitControls enablePan={false} enableZoom={true} maxPolarAngle={Math.PI / 2} />

      {/* Follow Camera */}
      <FollowCamera />

      {/* Player with collision-enabled platforms */}
      <Player platforms={platforms} />

      {/* Render platforms */}
      {platforms.map((platform, index) => (
        <Platform key={index} position={platform.position} size={platform.size} />
      ))}

      {/* Obstacles or additional scene elements */}
      <Obstacle position={[3, 1, -3]} size={[1, 2, 1]} />
    </Canvas>
  );
};

export default GameScene;
