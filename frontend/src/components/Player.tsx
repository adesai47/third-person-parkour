// src/components/Player.tsx
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface PlatformData {
  position: [number, number, number];
  size: [number, number, number];
}

interface PlayerProps {
  platforms: PlatformData[];
}

const Player: React.FC<PlayerProps> = ({ platforms }) => {
  const ref = useRef<THREE.Mesh>(null!);
  const [velocity, setVelocity] = useState(new THREE.Vector3());
  const [pressedKeys, setPressedKeys] = useState<{ [key: string]: boolean }>({});
  const [jumpCount, setJumpCount] = useState(0); // Track jumps, allowing double jump

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setPressedKeys((keys) => ({ ...keys, [event.code]: true }));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setPressedKeys((keys) => ({ ...keys, [event.code]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Check for landing on a platform
  const checkPlatformCollision = () => {
    for (const platform of platforms) {
      const [px, py, pz] = platform.position;
      const [width, height, depth] = platform.size;

      const playerHeight = 1; // Player height matches the height in boxGeometry args

      const isWithinX = ref.current.position.x >= px - width / 2 && ref.current.position.x <= px + width / 2;
      const isWithinZ = ref.current.position.z >= pz - depth / 2 && ref.current.position.z <= pz + depth / 2;
      const isAtLandingHeight = ref.current.position.y <= py + height / 2 + playerHeight / 2;

      if (isWithinX && isWithinZ && isAtLandingHeight) {
        // Set player on top of the platform
        ref.current.position.y = py + height / 2 + playerHeight / 2;
        setVelocity((v) => new THREE.Vector3(v.x, 0, v.z)); // Reset vertical velocity
        setJumpCount(0); // Reset jump count when landing
        return;
      }
    }
  };

  useFrame(() => {
    let newVelocity = new THREE.Vector3(velocity.x, velocity.y, velocity.z);

    // Horizontal movement
    if (pressedKeys['KeyW']) newVelocity.z = -0.1;
    else if (pressedKeys['KeyS']) newVelocity.z = 0.1;
    else newVelocity.z = 0;

    if (pressedKeys['KeyA']) newVelocity.x = -0.1;
    else if (pressedKeys['KeyD']) newVelocity.x = 0.1;
    else newVelocity.x = 0;

    // Jumping with double jump feature
    if (pressedKeys['Space'] && jumpCount < 2 && velocity.y <= 0.01) {
      newVelocity.y = 0.2; // Apply jump velocity
      setJumpCount((count) => count + 1); // Increment jump count
    }

    // Apply gravity if player is above ground
    if (ref.current.position.y > 0 || newVelocity.y > 0) {
      newVelocity.y -= 0.01; // Gravity effect
    }

    // Update player position and velocity
    ref.current.position.add(newVelocity);
    setVelocity(newVelocity);

    checkPlatformCollision();
  });

  return (
    <mesh ref={ref} position={[0, 1, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#3498db" />
    </mesh>
  );
};

export default Player;
