// src/components/FollowCamera.tsx
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const FollowCamera = () => {
  const { camera } = useThree();
  const playerPosition = new THREE.Vector3();

  useFrame(({ scene }) => {
    const player = scene.getObjectByName('player'); // Assuming Player component sets this name
    if (player) {
      // Update player position
      player.getWorldPosition(playerPosition);

      // Set the camera's position to follow the player
      camera.position.lerp(
        new THREE.Vector3(playerPosition.x + 5, playerPosition.y + 5, playerPosition.z + 10),
        0.1
      );

      // Look at the player
      camera.lookAt(playerPosition);
    }
  });

  return null;
};

export default FollowCamera;