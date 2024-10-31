// src/components/GameScene.tsx
import { Canvas } from '@react-three/fiber';
import Player from './Player';
import Platform from './Platform';
import CameraController from './CameraController';
import Cloud from './Cloud'; // Import the Cloud component
import Portal from './Portal';
import MovingPlatform from './MovingPlatform';
import { useRef, useState, useCallback } from 'react';
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
  ],
  3: [
    // Starting platform (red)
    { position: [0, -1, 0], size: [10, 1, 10], color: "#ff0000" },
    
    // Static platform to start
    { position: [0, 0, -8], size: [3, 1, 3] },
    
    // First moving platform - side to side
    { 
      type: 'moving',
      position: [0, 1, -16], 
      size: [3, 1, 3],
      movement: { axis: 'x', range: 5, speed: 1.5 }
    },
    
    // Static rest platform
    { position: [-3, 2, -24], size: [3, 1, 3] },
    
    // Moving platform - up and down
    { 
      type: 'moving',
      position: [3, 3, -32], 
      size: [3, 1, 3],
      movement: { axis: 'y', range: 2, speed: 1.2 }
    },
    
    // Two consecutive moving platforms - opposite directions
    { 
      type: 'moving',
      position: [-2, 4, -40], 
      size: [3, 1, 3],
      movement: { axis: 'x', range: 4, speed: 1.8 }
    },
    { 
      type: 'moving',
      position: [2, 5, -48], 
      size: [3, 1, 3],
      movement: { axis: 'x', range: 4, speed: -1.8 } // Negative speed for opposite direction
    },
    
    // Moving platform - vertical challenge
    { 
      type: 'moving',
      position: [0, 6, -56], 
      size: [4, 1, 4],
      movement: { axis: 'y', range: 3, speed: 1.5 }
    },
    
    // Moving platforms in sync - creating a path
    { 
      type: 'moving',
      position: [-4, 7, -64], 
      size: [3, 1, 3],
      movement: { axis: 'x', range: 3, speed: 1.3 }
    },
    { 
      type: 'moving',
      position: [4, 8, -72], 
      size: [3, 1, 3],
      movement: { axis: 'x', range: 3, speed: 1.3 }
    },
    
    // Final moving platform challenge - combines both movements
    { 
      type: 'moving',
      position: [0, 9, -80], 
      size: [4, 1, 4],
      movement: { axis: 'x', range: 5, speed: 1.6 }
    },
    { 
      type: 'moving',
      position: [0, 10, -88], 
      size: [4, 1, 4],
      movement: { axis: 'y', range: 2, speed: 1.4 }
    },
    
    // Final platform (green)
    { position: [0, 11, -96], size: [5, 1, 5], color: "#00ff00" }
  ]
};

const GameScene = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const playerRef = useRef<THREE.Mesh>(null);

  const handleFall = useCallback(() => {
    if (!isGameOver) {
      setIsGameOver(true);
    }
  }, [isGameOver]);

  const handleLevelComplete = useCallback(() => {
    if (currentLevel === 1) {
      setCurrentLevel(2);
    } else if (currentLevel === 2) {
      setCurrentLevel(3);
    }
    
    // Reset player position for new level
    if (playerRef.current) {
      playerRef.current.position.set(0, 1, 0);
    }
  }, [currentLevel]);

  const restartGame = useCallback(() => {
    setIsRestarting(true);
    setIsGameOver(false);
    setCurrentLevel(1);
    
    if (playerRef.current) {
      playerRef.current.position.set(0, 1, 0);
    }
    
    setTimeout(() => {
      setIsRestarting(false);
    }, 100);
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <Canvas style={{ 
        backgroundColor: '#87CEEB', 
        height: '100vh',
        filter: isGameOver ? 'brightness(0.4)' : 'none',
        transition: 'filter 0.3s ease'
      }}>
        <CameraController playerRef={playerRef} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <Player 
          ref={playerRef} 
          platforms={levels[currentLevel]} 
          onFall={handleFall}
          onLevelComplete={handleLevelComplete}
          isRestarting={isRestarting}
          currentLevel={currentLevel}
        />

        {/* Render platforms for current level */}
        {levels[currentLevel].map((platform, index) => (
          platform.type === 'moving' ? (
            <MovingPlatform
              key={index}
              position={platform.position}
              size={platform.size}
              color={platform.color}
              movement={platform.movement}
            />
          ) : (
            <Platform
              key={index}
              position={platform.position}
              size={platform.size}
              color={platform.color}
            />
          )
        ))}

        {/* Only show portal if not on final level */}
        {currentLevel < 3 && (
          <Portal 
            position={[
              levels[currentLevel][levels[currentLevel].length - 1].position[0],
              levels[currentLevel][levels[currentLevel].length - 1].position[1] + 1,
              levels[currentLevel][levels[currentLevel].length - 1].position[2]
            ]} 
          />
        )}

        {/* Clouds and decorations */}
        <Cloud position={[10, 15, -20]} />
        <Cloud position={[-15, 18, -40]} />
        <Cloud position={[20, 20, -60]} />
        <Cloud position={[5, -5, -15]} />
        <Cloud position={[-10, -7, -35]} />
        <Cloud position={[15, -6, -55]} />
      </Canvas>

      {/* Level indicator */}
      <div style={styles.levelIndicator}>
        Level {currentLevel}
      </div>

      {/* Game over overlay */}
      {isGameOver && (
        <div style={styles.loseOverlayContainer}>
          <div style={styles.loseBox}>
            <h1 style={styles.loseText}>You Lose</h1>
            <button 
              style={styles.restartButton}
              onClick={restartGame}
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Updated styles
const styles = {
  loseOverlayContainer: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'auto',
  },
  loseBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    padding: '40px 60px',
    borderRadius: '15px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    gap: '20px',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  loseText: {
    fontSize: '2.5rem',
    color: '#fff',
    margin: 0,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  },
  restartButton: {
    padding: '12px 30px',
    fontSize: '1.2rem',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#fff',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
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
    zIndex: 1000,
  },
};

export default GameScene;