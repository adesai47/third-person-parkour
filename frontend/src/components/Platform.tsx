// src/components/Platform.tsx
import React from 'react';

interface PlatformProps {
  position: [number, number, number];
  size: [number, number, number];
}

const Platform: React.FC<PlatformProps> = ({ position, size }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#7f8c8d" />
    </mesh>
  );
};

export default Platform;
