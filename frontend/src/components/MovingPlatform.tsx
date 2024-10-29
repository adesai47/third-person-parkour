import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface MovingPlatformProps {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  movement: {
    axis: 'x' | 'y' | 'z';
    range: number;
    speed: number;
  };
}

const MovingPlatform: React.FC<MovingPlatformProps> = ({ position, size, color, movement }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const startPosition = useRef(position);
  
  useFrame((state) => {
    if (meshRef.current) {
      const offset = Math.sin(state.clock.elapsedTime * movement.speed) * movement.range;
      meshRef.current.position[movement.axis] = startPosition.current[
        movement.axis === 'x' ? 0 : movement.axis === 'y' ? 1 : 2
      ] + offset;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial 
        color={color || new THREE.Color().setHSL(Math.random(), 0.5, 0.5)}
        roughness={0.7}
        metalness={0.3}
      />
    </mesh>
  );
};

export default MovingPlatform; 