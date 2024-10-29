// src/components/Player.tsx
import { forwardRef, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Platform {
  position: [number, number, number];
  size: [number, number, number];
  type?: 'moving';
  movement?: {
    axis: 'x' | 'y' | 'z';
    range: number;
    speed: number;
  };
}

interface PlayerProps {
  platforms: Platform[];
  onFall: () => void;
  onLevelComplete?: () => void;
  isRestarting?: boolean;
}

const Player = forwardRef<THREE.Mesh, PlayerProps>(({ platforms, onFall, onLevelComplete, isRestarting }, ref) => {
  const velocity = useRef(new THREE.Vector3());
  const isJumping = useRef(false);
  const jumpCount = useRef(0);
  const pressedKeys = useRef<{ [key: string]: boolean }>({});
  const currentPlatform = useRef<Platform | null>(null);
  const lastPlatformOffset = useRef(new THREE.Vector3());

  // Function to get actual platform position (including movement)
  const getPlatformPosition = (platform: Platform, time: number) => {
    if (platform.type === 'moving' && platform.movement) {
      const pos = [...platform.position];
      const axisIndex = platform.movement.axis === 'x' ? 0 : platform.movement.axis === 'y' ? 1 : 2;
      pos[axisIndex] += Math.sin(time * platform.movement.speed) * platform.movement.range;
      return pos as [number, number, number];
    }
    return platform.position;
  };

  // Get platform movement delta
  const getPlatformDelta = (platform: Platform, time: number, lastTime: number) => {
    if (platform.type === 'moving' && platform.movement) {
      const currentPos = Math.sin(time * platform.movement.speed) * platform.movement.range;
      const lastPos = Math.sin(lastTime * platform.movement.speed) * platform.movement.range;
      const delta = currentPos - lastPos;
      
      const deltaVector = new THREE.Vector3();
      if (platform.movement.axis === 'x') deltaVector.x = delta;
      if (platform.movement.axis === 'y') deltaVector.y = delta;
      if (platform.movement.axis === 'z') deltaVector.z = delta;
      
      return deltaVector;
    }
    return new THREE.Vector3();
  };

  // Check collision with platform
  const checkPlatformCollision = (playerPosition: THREE.Vector3, time: number) => {
    for (const platform of platforms) {
      const platformPos = getPlatformPosition(platform, time);
      const size = platform.size;

      // Check if player is within platform bounds
      if (
        playerPosition.x >= platformPos[0] - size[0] / 2 &&
        playerPosition.x <= platformPos[0] + size[0] / 2 &&
        playerPosition.z >= platformPos[2] - size[2] / 2 &&
        playerPosition.z <= platformPos[2] + size[2] / 2
      ) {
        // Check vertical collision
        const platformTop = platformPos[1] + size[1] / 2;
        const playerBottom = playerPosition.y - 0.5;

        if (playerBottom <= platformTop && playerBottom > platformTop - 0.5) {
          // Snap player to platform top
          playerPosition.y = platformTop + 0.5;
          velocity.current.y = 0;
          isJumping.current = false;
          
          // Store current platform reference
          if (currentPlatform.current !== platform) {
            currentPlatform.current = platform;
            lastPlatformOffset.current.set(0, 0, 0);
          }
          return true;
        }
      }
    }
    currentPlatform.current = null;
    return false;
  };

  let lastTime = 0;
  useFrame((state) => {
    if (!ref || !('current' in ref) || !ref.current) return;

    const playerMesh = ref.current;
    const newPosition = playerMesh.position.clone();
    const moveSpeed = 0.15;

    // Apply platform movement if standing on a moving platform
    if (currentPlatform.current && currentPlatform.current.type === 'moving') {
      const platformDelta = getPlatformDelta(
        currentPlatform.current,
        state.clock.elapsedTime,
        lastTime
      );
      newPosition.add(platformDelta);
    }

    // Horizontal movement with reduced speed
    if (pressedKeys.current['KeyA'] || pressedKeys.current['ArrowLeft']) {
      newPosition.x -= moveSpeed;
    }
    if (pressedKeys.current['KeyD'] || pressedKeys.current['ArrowRight']) {
      newPosition.x += moveSpeed;
    }
    if (pressedKeys.current['KeyW'] || pressedKeys.current['ArrowUp']) {
      newPosition.z -= moveSpeed;
    }
    if (pressedKeys.current['KeyS'] || pressedKeys.current['ArrowDown']) {
      newPosition.z += moveSpeed;
    }

    // Jump logic with double jump
    if (pressedKeys.current['Space']) {
      if (!isJumping.current) {
        velocity.current.y = 0.3;
        isJumping.current = true;
        jumpCount.current = 1;
        currentPlatform.current = null;
      } else if (jumpCount.current === 1) {
        // Double jump
        velocity.current.y = 0.3;
        jumpCount.current = 2;
      }
      // Clear the space key press to prevent holding
      pressedKeys.current['Space'] = false;
    }

    // Apply gravity
    velocity.current.y -= 0.015;
    newPosition.y += velocity.current.y;

    // Check platform collision with new position
    const onPlatform = checkPlatformCollision(newPosition, state.clock.elapsedTime);
    if (onPlatform) {
      jumpCount.current = 0; // Reset jump count when landing
    }

    // Fall detection
    if (newPosition.y < -10) {
      onFall();
      return;
    }

    // Update position
    playerMesh.position.copy(newPosition);

    // Check for level completion
    const lastPlatform = platforms[platforms.length - 1];
    const portalPosition = [
      lastPlatform.position[0],
      lastPlatform.position[1] + 3,
      lastPlatform.position[2]
    ];
    
    const distanceToPortal = newPosition.distanceTo(new THREE.Vector3(...portalPosition));
    if (distanceToPortal < 2) {
      onLevelComplete?.();
    }

    lastTime = state.clock.elapsedTime;
  });

  // Key event handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      pressedKeys.current[event.code] = true;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.current[event.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Add effect to handle restart
  useEffect(() => {
    if (isRestarting && ref && 'current' in ref && ref.current) {
      // Reset position
      ref.current.position.set(0, 1, 0);
      // Reset velocity
      velocity.current.set(0, 0, 0);
      // Reset jumping state
      isJumping.current = false;
      // Reset platform reference
      currentPlatform.current = null;
      lastPlatformOffset.current.set(0, 0, 0);
      // Reset jump count
      jumpCount.current = 0;
    }
  }, [isRestarting]);

  return (
    <mesh ref={ref} position={[0, 1, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
});

export default Player;
