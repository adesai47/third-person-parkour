// src/components/GameScene.tsx
import { Canvas } from '@react-three/fiber';
import Player from './Player';
import Platform from './Platform';
import CameraController from './CameraController';
import Cloud from './Cloud'; // Import the Cloud component
import Portal from './Portal';
import MovingPlatform from './MovingPlatform';
import TogglingPlatform from './TogglingPlatform';
import { useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

// First, define the platform types
interface BasePlatform {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  isStart?: boolean;
  isEnd?: boolean;
}

interface MovingPlatform extends BasePlatform {
  type: 'moving';
  movement: {
    axis: 'x' | 'y' | 'z';
    range: number;
    speed: number;
  };
}

interface TogglingPlatform extends BasePlatform {
  type: 'toggling';
  toggleInterval: number;
}

type Platform = BasePlatform | MovingPlatform | TogglingPlatform;

// Define the levels type
type Levels = {
  [key: number]: Platform[];
};

// Now define the levels object with the proper type
const levels: Levels = {
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
    { 
      position: [0, -1, 0], 
      size: [10, 1, 10], 
      color: "#ff0000",
      isStart: true
    },
    // First moving platform - horizontal
    { 
      type: 'moving',
      position: [0, 0, -12], 
      size: [3, 1, 3],
      movement: { 
        axis: 'x', 
        range: 5, 
        speed: 2 
      }
    },
    // Vertical moving platform
    { 
      type: 'moving',
      position: [-3, 1, -22], 
      size: [3, 1, 3],
      movement: { 
        axis: 'y', 
        range: 2.5, 
        speed: 1.5 
      }
    },
    // Fast horizontal moving platform
    { 
      type: 'moving',
      position: [3, 2, -32], 
      size: [3, 1, 3],
      movement: { 
        axis: 'x', 
        range: 4, 
        speed: 2.5 
      }
    },
    // Rest platform (static)
    { 
      position: [-2, 3, -42], 
      size: [3, 1, 3]
    },
    // Final moving platform - challenging vertical
    { 
      type: 'moving',
      position: [2, 4, -52], 
      size: [3, 1, 3],
      movement: { 
        axis: 'y', 
        range: 3, 
        speed: 2 
      }
    },
    // End platform (green)
    { 
      position: [0, 5, -62], 
      size: [4, 1, 4], 
      color: "#00ff00",
      isEnd: true
    }
  ],
  4: [
    // Starting platform (red, static)
    { 
      position: [0, -1, 0], 
      size: [10, 1, 10], 
      color: "#ff0000",
      isStart: true
    },
    // First disappearing platform
    { 
      type: 'toggling',
      position: [0, 0, -12], 
      size: [3, 1, 3], 
      color: "#00ff00",
      toggleInterval: 2.0  // Longer interval
    },
    // Second disappearing platform
    { 
      type: 'toggling',
      position: [3, 1, -22], 
      size: [3, 1, 3], 
      color: "#00ff00",
      toggleInterval: 2.5  // Offset timing
    },
    // Third disappearing platform
    { 
      type: 'toggling',
      position: [-2, 2, -32], 
      size: [3, 1, 3], 
      color: "#00ff00",
      toggleInterval: 2.0  // Even longer interval
    },
    // Fourth disappearing platform
    { 
      type: 'toggling',
      position: [2, 3, -42], 
      size: [3, 1, 3], 
      color: "#00ff00",
      toggleInterval: 2.2  // Different timing
    },
    // End platform (green, static)
    { 
      position: [0, 4, -52], 
      size: [5, 1, 5], 
      color: "#00ff00",
      isEnd: true
    }
  ]
};

const GameScene = () => {
  const [currentLevel, setCurrentLevel] = useState<keyof typeof levels>(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const playerRef = useRef<THREE.Mesh>(null);
  const [platformStates, setPlatformStates] = useState<{ [key: string]: boolean }>({});

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
    } else if (currentLevel === 3) {
      setCurrentLevel(4);
    }
    
    // Reset player position for new level
    if (playerRef.current) {
      playerRef.current.position.set(0, 1, 0);
    }
  }, [currentLevel]);

  // Restart current level
  const restartCurrentLevel = useCallback(() => {
    setIsRestarting(true);
    setIsGameOver(false);
    
    if (playerRef.current) {
      playerRef.current.position.set(0, 1, 0);
    }
    
    setTimeout(() => {
      setIsRestarting(false);
    }, 100);
  }, []);

  // Restart from level 1
  const restartFromBeginning = useCallback(() => {
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

        {/* Render platforms for current level */}
        {levels[currentLevel].map((platform, index) => {
          if (platform.type === 'moving') {
            return (
              <MovingPlatform
                key={index}
                position={platform.position}
                size={platform.size}
                color={platform.color}
                movement={platform.movement}
              />
            );
          } else if (platform.type === 'toggling' || platform.toggleInterval) {
            return (
              <TogglingPlatform
                key={index}
                position={platform.position}
                size={platform.size}
                color={platform.color}
                toggleInterval={platform.toggleInterval || 2}
                platformId={`platform-${index}`}
                setPlatformStates={setPlatformStates}
              />
            );
          } else {
            return (
              <Platform
                key={index}
                position={platform.position}
                size={platform.size}
                color={platform.color}
              />
            );
          }
        })}


        <Player 
          ref={playerRef} 
          platforms={levels[currentLevel]} 
          onFall={handleFall}
          onLevelComplete={handleLevelComplete}
          isRestarting={isRestarting}
          currentLevel={currentLevel}
          platformStates={platformStates}
        />

        {/* Only show portal for levels 1-3 */}
        {currentLevel < 4 && (
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

      {/* Updated Game Over overlay */}
      {isGameOver && (
        <div style={styles.loseOverlayContainer}>
          <div style={styles.loseBox}>
            <h1 style={styles.loseText}>You Lose</h1>
            <div style={styles.buttonContainer}>
              <button 
                style={styles.restartButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
                onClick={restartCurrentLevel}
              >
                Restart Level {currentLevel}
              </button>
              <button 
                style={styles.restartButtonRed}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c0392b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e74c3c'}
                onClick={restartFromBeginning}
              >
                Start from Level 1
              </button>
            </div>
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
    marginBottom: '10px',
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
    width: '100%',
    textAlign: 'center' as 'center',
    fontWeight: '500',
  },
  restartButtonRed: {
    padding: '12px 30px',
    fontSize: '1.2rem',
    backgroundColor: '#e74c3c',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#fff',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    width: '100%',
    textAlign: 'center' as 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: '15px',
    width: '100%',
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