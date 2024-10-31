import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
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
  
  // Memoize the geometry and material
  const geometry = useMemo(() => new THREE.BoxGeometry(...size), [size]);
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: color || new THREE.Color().setHSL(Math.random(), 0.5, 0.5),
    roughness: 0.7,
    metalness: 0.3
  }), [color]);

  useFrame((state) => {
    if (meshRef.current) {
      const offset = Math.sin(state.clock.elapsedTime * movement.speed) * movement.range;
      meshRef.current.position[movement.axis] = position[
        movement.axis === 'x' ? 0 : movement.axis === 'y' ? 1 : 2
      ] + offset;
    }
  });

  return <mesh ref={meshRef} position={position} geometry={geometry} material={material} />;
};

export default MovingPlatform; 