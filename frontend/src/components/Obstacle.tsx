// src/components/Obstacle.tsx
import React from 'react';

interface ObstacleProps {
  position: [number, number, number];
  size: [number, number, number];
}

const Obstacle: React.FC<ObstacleProps> = ({ position, size }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#e74c3c" />
    </mesh>
  );
};

export default Obstacle;
