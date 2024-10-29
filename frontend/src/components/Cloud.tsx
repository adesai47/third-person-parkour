// src/components/Cloud.tsx
import React from 'react';
import { GroupProps } from '@react-three/fiber';

const Cloud: React.FC<GroupProps> = (props) => {
  return (
    <group {...props}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 1, 3]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[2, -0.5, -1]}>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-2, -0.5, 1]}>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.5, 0.5, 1.5]}>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
};

export default Cloud;
