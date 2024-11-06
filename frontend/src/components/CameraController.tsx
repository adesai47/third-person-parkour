// src/components/CameraController.tsx
import { useFrame, useThree } from '@react-three/fiber';
import { MutableRefObject } from 'react';
import * as THREE from 'three';

interface CameraControllerProps {
  playerRef: MutableRefObject<THREE.Mesh | null>;
}

const CameraController: React.FC<CameraControllerProps> = ({ playerRef }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (playerRef.current) {
      const playerPosition = playerRef.current.position;
      camera.position.lerp(
        new THREE.Vector3(playerPosition.x, playerPosition.y + 5, playerPosition.z + 10),
        0.1
      );
      camera.lookAt(playerPosition);
    }
  });

  return null;
};

export default CameraController;