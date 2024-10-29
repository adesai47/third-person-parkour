// src/components/GameScene.tsx
import { Canvas } from '@react-three/fiber';
import Player from './Player';
import Platform from './Platform';
import CameraController from './CameraController';
import Cloud from './Cloud'; // Import the Cloud component
import Portal from './Portal';
import MovingPlatform from './MovingPlatform';
import { useRef, useState } from 'react';
import * as THREE from 'three';

// Define levels
const levels = {
  1: [
    { position: [0, -1, 0], size: [10, 1, 10], color: "#ff0000" },
    { position: [0, 0, -10], size: [3, 1, 3] },
    { position: [0, 1, -20], size: [5, 1, 5] },
    { position: [0, 2, -30], size: [3, 1, 3] },
    { position: [0, 3, -40], size: [4, 1, 4] },
    { position: [0, 5, -50], size: [6, 1, 6] },
    { position: [0, 5, -60], size: [3, 1, 3] },
    { position: [0, 6, -70], size: [4, 1, 4], color: "#00ff00" },
  ],
  2: [
    { position: [0, -1, 0], size: [10, 1, 10], color: "#ff0000" },
    { position: [3, 0, -12], size: [3, 1, 3] },
    { position: [-3, 1, -18], size: [3, 1, 3] },
    { position: [4, 2, -24], size: [3, 1, 3] },
    { position: [-3, 3, -30], size: [3, 1, 3] },
    { position: [3, 4, -36], size: [3, 1, 3] },
    { 
      type: 'moving',
      position: [0, 5, -42], 
      size: [4, 1, 4],
      movement: { axis: 'x', range: 4, speed: 1.5 }
    },
    { position: [0, 6, -48], size: [4, 1, 4], color: "#00ff00" },
  ]
};

const GameScene = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const playerRef = useRef<THREE.Mesh>(null);

  const handleLevelComplete = () => {
    if (currentLevel < Object.keys(levels).length) {
      setCurrentLevel(prev => prev + 1);
      // Reset player position for new level
      if (playerRef.current) {
        playerRef.current.position.set(0, 1, 0);
      }
    } else {
      console.log("Game Complete!");
      // You could add a game completion screen here
    }
  };

  const handleFall = () => {
    setIsGameOver(true);
  };

  const restartGame = () => {
    setIsRestarting(true);
    setIsGameOver(false);
    setCurrentLevel(1);
    
    // Reset isRestarting after a short delay
    setTimeout(() => {
      setIsRestarting(false);
    }, 100);
  };

  const currentPlatforms = levels[currentLevel];
  const lastPlatform = currentPlatforms[currentPlatforms.length - 1];
  const portalPosition: [number, number, number] = [
    lastPlatform.position[0],
    lastPlatform.position[1] + 1,
    lastPlatform.position[2]
  ];

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <Canvas style={{ backgroundColor: '#87CEEB', height: '100vh', display: isGameOver ? 'none' : 'block' }}>
        <CameraController playerRef={playerRef} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <Player 
          ref={playerRef} 
          platforms={currentPlatforms} 
          onFall={handleFall}
          onLevelComplete={handleLevelComplete}
          isRestarting={isRestarting}
        />

        {/* Render platforms */}
        {currentPlatforms.map((platform, index) => (
          platform.type === 'moving' ? (
            <MovingPlatform
              key={index}
              position={platform.position as [number, number, number]}
              size={platform.size as [number, number, number]}
              color={platform.color}
              movement={platform.movement}
            />
          ) : (
            <Platform
              key={index}
              position={platform.position as [number, number, number]}
              size={platform.size as [number, number, number]}
              color={platform.color}
            />
          )
        ))}

        {/* Clouds and decorations */}
        <Cloud position={[10, 15, -20]} />
        <Cloud position={[-15, 18, -40]} />
        <Cloud position={[20, 20, -60]} />
        <Cloud position={[5, -5, -15]} />
        <Cloud position={[-10, -7, -35]} />
        <Cloud position={[15, -6, -55]} />

        <Portal position={portalPosition} />
      </Canvas>

      {isGameOver && (
        <div style={styles.loseOverlay}>
          <h1 style={styles.loseText}>You Lose</h1>
          <button 
            style={styles.restartButton} 
            onClick={restartGame}
          >
            Restart
          </button>
        </div>
      )}

      <div style={styles.levelIndicator}>
        Level {currentLevel}
      </div>
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
  levelIndicator: {
    position: 'absolute' as 'absolute',
    top: '20px',
    left: '20px',
    padding: '10px 20px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    borderRadius: '5px',
    fontSize: '1.2rem',
  },
};

export default GameScene;
