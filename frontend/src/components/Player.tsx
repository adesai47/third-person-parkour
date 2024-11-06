// src/components/Player.tsx
import { forwardRef, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Platform {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  isSafe?: boolean;
  type?: 'moving';
  movement?: {
    axis: 'x' | 'y' | 'z';
    range: number;
    speed: number;
  };
  isStart?: boolean;
  isEnd?: boolean;
  toggleInterval?: number;
}

interface PlayerProps {
  platforms: Platform[];
  onFall: () => void;
  onLevelComplete?: () => void;
  isRestarting?: boolean;
  currentLevel: number;
  platformStates: { [key: string]: boolean };
  style: PlayerStyle;
}

const Player = forwardRef<THREE.Mesh, PlayerProps>(({ style, ...props }, ref) => {
  const velocity = useRef(new THREE.Vector3());
  const isJumping = useRef(false);
  const jumpCount = useRef(0);
  const pressedKeys = useRef<{ [key: string]: boolean }>({});
  const hasFallen = useRef(false);
  const currentPlatform = useRef<Platform | null>(null);
  const lastTime = useRef(0);
  const lightRef = useRef<THREE.PointLight>(null);

  // Updated getStartingPlatformPosition function
  const getStartingPlatformPosition = () => {
    const startingPlatform = props.platforms.find(platform => platform.isStart || platform.position[1] === -1);
    if (startingPlatform) {
      // Return position above the platform (y + 2 to ensure we're well above it)
      return [
        startingPlatform.position[0],
        startingPlatform.position[1] + 2,
        startingPlatform.position[2]
      ] as [number, number, number];
    }
    return [0, 2, 0]; // Higher default position
  };

  // Ensure proper initial position
  useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      const startPos = getStartingPlatformPosition();
      ref.current.position.set(...startPos);
      velocity.current.set(0, 0, 0); // Reset velocity
      hasFallen.current = false; // Reset fall state
    }
  }, [props.currentLevel]);

  // Handle platform movement if applicable
  const getPlatformCurrentPosition = (platform: Platform, time: number) => {
    if (platform.type === 'moving' && platform.movement) {
      const pos = [...platform.position];
      const offset = Math.sin(time * platform.movement.speed) * platform.movement.range;
      const axisIndex = platform.movement.axis === 'x' ? 0 : platform.movement.axis === 'y' ? 1 : 2;
      pos[axisIndex] += offset;
      return pos as [number, number, number];
    }
    return platform.position;
  };

  // Updated checkPlatformCollision function
  const checkPlatformCollision = (playerPosition: THREE.Vector3, time: number) => {
    currentPlatform.current = null;

    for (let i = 0; i < props.platforms.length; i++) {
      const platform = props.platforms[i];
      const platformId = `platform-${i}`;

      // Always check collision with starting platform
      if (platform.isStart || i === 0) {
        const platformPos = getPlatformCurrentPosition(platform, time);
        const size = platform.size;

        const minX = platformPos[0] - size[0] / 2;
        const maxX = platformPos[0] + size[0] / 2;
        const minZ = platformPos[2] - size[2] / 2;
        const maxZ = platformPos[2] + size[2] / 2;
        const platformTop = platformPos[1] + size[1] / 2;
        const platformBottom = platformPos[1] - size[1] / 2;

        // Improved collision detection
        if (
          playerPosition.x >= minX &&
          playerPosition.x <= maxX &&
          playerPosition.z >= minZ &&
          playerPosition.z <= maxZ
        ) {
          const playerBottom = playerPosition.y - 0.5;
          
          // Landing on top of platform
          if (playerBottom <= platformTop && playerBottom > platformTop - 0.5 && velocity.current.y <= 0) {
            playerPosition.y = platformTop + 0.5;
            velocity.current.y = 0;
            currentPlatform.current = platform;
            isJumping.current = false;
            jumpCount.current = 0;
            return true;
          }
        }
      }

      // Rest of platform collision checks for non-starting platforms
      if (props.currentLevel === 4 && !platform.isStart && !platform.isEnd && !props.platformStates[platformId]) {
        continue;
      }

      const platformPos = getPlatformCurrentPosition(platform, time);
      const size = platform.size;

      // Basic AABB collision detection
      const minX = platformPos[0] - size[0] / 2;
      const maxX = platformPos[0] + size[0] / 2;
      const minZ = platformPos[2] - size[2] / 2;
      const maxZ = platformPos[2] + size[2] / 2;
      const platformTop = platformPos[1] + size[1] / 2;

      if (
        playerPosition.x >= minX &&
        playerPosition.x <= maxX &&
        playerPosition.z >= minZ &&
        playerPosition.z <= maxZ &&
        playerPosition.y - 0.5 <= platformTop &&
        velocity.current.y <= 0
      ) {
        playerPosition.y = platformTop + 0.5;
        velocity.current.y = 0;
        currentPlatform.current = platform;
        isJumping.current = false;
        jumpCount.current = 0;
        return true;
      }
    }
    return false;
  };

  // Handle keyboard input for movement and jumping
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      pressedKeys.current[event.code] = true;

      if (event.code === 'Space' && jumpCount.current < 2) {
        velocity.current.y = 0.3;
        jumpCount.current += 1;
        isJumping.current = true;
      }
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

  // Add getPlatformDelta function to calculate platform movement
  const getPlatformDelta = (platform: Platform, currentTime: number) => {
    if (platform.type === 'moving' && platform.movement) {
      const currentOffset = Math.sin(currentTime * platform.movement.speed) * platform.movement.range;
      const previousOffset = Math.sin(lastTime.current * platform.movement.speed) * platform.movement.range;
      const delta = currentOffset - previousOffset;
      
      const movement = new THREE.Vector3();
      if (platform.movement.axis === 'x') movement.x = delta;
      if (platform.movement.axis === 'y') movement.y = delta;
      if (platform.movement.axis === 'z') movement.z = delta;
      
      return movement;
    }
    return new THREE.Vector3();
  };

  useFrame((state) => {
    if (!ref || !('current' in ref) || !ref.current) return;

    const playerMesh = ref.current;
    const newPosition = playerMesh.position.clone();
    const moveSpeed = 0.15;

    // Apply platform movement if standing on a moving platform
    if (currentPlatform.current && currentPlatform.current.type === 'moving') {
      const platformDelta = getPlatformDelta(currentPlatform.current, state.clock.elapsedTime);
      newPosition.add(platformDelta);
    }

    // Regular movement controls
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

    // Apply gravity
    velocity.current.y -= 0.015;
    newPosition.y += velocity.current.y;

    // Check platform collisions
    const onPlatform = checkPlatformCollision(newPosition, state.clock.elapsedTime);
    
    if (onPlatform) {
      isJumping.current = false;
      jumpCount.current = 0;
    }

    // Update player position
    playerMesh.position.copy(newPosition);

    // Update last time for platform movement calculations
    lastTime.current = state.clock.elapsedTime;

    // Fall detection
    if (newPosition.y < -10 && !hasFallen.current) {
      hasFallen.current = true;
      props.onFall();
      return;
    }

    // Check for level completion
    const lastPlatform = props.platforms[props.platforms.length - 1];
    const portalPosition = [
      lastPlatform.position[0],
      lastPlatform.position[1] + 1,
      lastPlatform.position[2]
    ];
    
    const distanceToPortal = newPosition.distanceTo(new THREE.Vector3(...portalPosition));
    if (distanceToPortal < 2 && props.currentLevel < 4) {
      props.onLevelComplete?.();
    }
  });

  // Reset player position on restart
  useEffect(() => {
    if (props.isRestarting) {
      if (ref && 'current' in ref && ref.current) {
        ref.current.position.set(...getStartingPlatformPosition());
        velocity.current.set(0, 0, 0);
        isJumping.current = false;
        jumpCount.current = 0;
        hasFallen.current = false;
        pressedKeys.current = {};
      }
    }
  }, [props.isRestarting, props.currentLevel, ref]);

  const getMesh = () => {
    switch (style.design) {
      case 'sphere':
        return <sphereGeometry args={[0.5, 32, 32]} />;
      case 'diamond':
        return <octahedronGeometry args={[0.5]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  const getMaterial = () => {
    if (style.material === 'neon') {
      return (
        <meshStandardMaterial
          color={style.color}
          emissive={style.color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      );
    }
    return (
      <meshStandardMaterial
        color={style.color}
        roughness={0.7}
      />
    );
  };

  // Update light color when style changes
  useEffect(() => {
    if (lightRef.current && style.material === 'neon') {
      lightRef.current.color.set(style.color);
    }
  }, [style.color, style.material]);

  // Animate the neon glow
  useFrame((state, delta) => {
    if (lightRef.current && style.material === 'neon') {
      const intensity = 3 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
      lightRef.current.intensity = intensity;
    }
  });

  return (
    <group>
      <mesh ref={ref} {...props}>
        {getMesh()}
        {getMaterial()}
      </mesh>
      
      {/* Add point light for neon effect */}
      {style.material === 'neon' && (
        <pointLight
          ref={lightRef}
          color={style.color}
          intensity={3}
          distance={5}
          decay={2}
        />
      )}
    </group>
  );
});

export default Player;