// src/components/Player.tsx
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState, forwardRef } from 'react';
import * as THREE from 'three';

interface PlatformData {
  position: [number, number, number];
  size: [number, number, number];
}

interface PlayerProps {
  platforms: PlatformData[];
  onFall: () => void;
}

const Player = forwardRef<THREE.Mesh, PlayerProps>(({ platforms, onFall }, ref) => {
  const innerRef = useRef<THREE.Mesh>(null!);
  const playerRef = (ref as any) || innerRef; // Combine refs if ref is provided

  const [velocity, setVelocity] = useState(new THREE.Vector3());
  const [jumpCount, setJumpCount] = useState(0);  // Track jumps
  const [pressedKeys, setPressedKeys] = useState<{ [key: string]: boolean }>({});

  // Handle key presses
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

  // Platform collision check
  const checkPlatformCollision = () => {
    for (const platform of platforms) {
      const [px, py, pz] = platform.position;
      const [width, height, depth] = platform.size;

      const playerHeight = 1; // Assume player height is 1 for simplicity

      const isWithinX = playerRef.current.position.x >= px - width / 2 && playerRef.current.position.x <= px + width / 2;
      const isWithinZ = playerRef.current.position.z >= pz - depth / 2 && playerRef.current.position.z <= pz + depth / 2;
      const isLandingHeight = playerRef.current.position.y <= py + height / 2 + playerHeight / 2;

      if (isWithinX && isWithinZ && isLandingHeight) {
        // Land the player on top of the platform
        playerRef.current.position.y = py + height / 2 + playerHeight / 2;
        setVelocity((v) => new THREE.Vector3(v.x, 0, v.z)); // Stop vertical velocity
        setJumpCount(0); // Reset jump count
        return true;
      }
    }
    return false;
  };

  useFrame(() => {
    if (playerRef.current) {
      let newVelocity = velocity.clone();

      // Apply horizontal movement based on key presses
      if (pressedKeys['KeyW']) newVelocity.z = -0.1; // Move forward
      else if (pressedKeys['KeyS']) newVelocity.z = 0.1; // Move backward
      else newVelocity.z = 0; // Stop forward/backward movement

      if (pressedKeys['KeyA']) newVelocity.x = -0.1; // Move left
      else if (pressedKeys['KeyD']) newVelocity.x = 0.1; // Move right
      else newVelocity.x = 0; // Stop left/right movement

      // Handle jumping with double jump
      if (pressedKeys['Space'] && jumpCount < 2 && velocity.y <= 0.01) {
        newVelocity.y = 0.2; // Jump velocity
        setJumpCount((count) => count + 1);
      }

      // Apply gravity continuously
      newVelocity.y -= 0.01; // Gravity effect

      // Update position based on velocity
      playerRef.current.position.add(newVelocity);
      setVelocity(newVelocity);

      // Check if player has landed on a platform
      if (!checkPlatformCollision()) {
        // If no platform is below and player has fallen below threshold, trigger onFall
        if (playerRef.current.position.y < -10) {
          onFall();
        }
      }
    }
  });

  return (
    <mesh ref={playerRef} position={[0, 1, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#3498db" />
    </mesh>
  );
});

export default Player;
