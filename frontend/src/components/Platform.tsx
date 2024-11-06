// src/components/Platform.tsx
import React from 'react';
import * as THREE from 'three';

interface PlatformProps {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
}

const Platform: React.FC<PlatformProps> = ({ position, size, color }) => {
  const platformColor = color || new THREE.Color().setHSL(Math.random(), 0.5, 0.5);

  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial 
        color={platformColor}
        roughness={0.7}
        metalness={0.3}
      />
    </mesh>
  );
};

export default Platform;