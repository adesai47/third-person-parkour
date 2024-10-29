// src/components/GameScene.tsx
import { Canvas } from '@react-three/fiber';
import Player from './Player';
import Platform from './Platform';
import CameraController from './CameraController';
import { useRef, useState } from 'react';
import * as THREE from 'three';

const platforms = [
  { position: [0, -1, 0], size: [10, 1, 10] },
  { position: [0, 0, -10], size: [3, 1, 3] },
  { position: [0, 1, -20], size: [5, 1, 5] },
  { position: [0, 2, -30], size: [3, 1, 3] },
  { position: [0, 3, -40], size: [4, 1, 4] },
  { position: [0, 5, -50], size: [6, 1, 6] },
  { position: [0, 5, -60], size: [3, 1, 3] },
  { position: [0, 6, -70], size: [4, 1, 4] },
];

const GameScene = () => {
  const [isGameOver, setIsGameOver] = useState(false);
  const playerRef = useRef<THREE.Mesh>(null);

  const restartGame = () => {
    setIsGameOver(false);
    if (playerRef.current) {
      playerRef.current.position.set(0, 1, 0); // Reset player to starting position
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <Canvas style={{ backgroundColor: '#20232a', height: '100vh', display: isGameOver ? 'none' : 'block' }}>
        {/* Camera controller that follows the player */}
        <CameraController playerRef={playerRef} />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* Player with collision-enabled platforms */}
        <Player ref={playerRef} platforms={platforms} onFall={() => setIsGameOver(true)} />

        {/* Render platforms */}
        {platforms.map((platform, index) => (
          <Platform key={index} position={platform.position} size={platform.size} />
        ))}
      </Canvas>

      {/* "You Lose" View */}
      {isGameOver && (
        <div style={styles.loseOverlay}>
          <h1 style={styles.loseText}>You Lose</h1>
          <button style={styles.restartButton} onClick={restartGame}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

// Styling for the overlay and button
const styles = {
  loseOverlay: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  loseText: {
    fontSize: '3rem',
    marginBottom: '20px',
  },
  restartButton: {
    padding: '10px 20px',
    fontSize: '1.5rem',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    color: '#fff',
  },
};

export default GameScene;
