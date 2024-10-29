import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface PortalProps {
  position: [number, number, number];
}

const Portal: React.FC<PortalProps> = ({ position }) => {
  const portalRef = useRef<THREE.Mesh>(null);
  
  // Animate the portal
  useFrame((state) => {
    if (portalRef.current) {
      portalRef.current.rotation.y += 0.02;
      // Make the portal float up and down slightly
      portalRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Portal center */}
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial 
          color="#8c00ff"
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.8}
        />
      </mesh>

      {/* Add some inner rings for effect */}
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[0.8, 1.0, 32]} />
        <meshBasicMaterial 
          color="#ffffff"
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.4}
        />
      </mesh>

      {/* Portal glow */}
      <pointLight color="#4a00ff" intensity={2} distance={5} />
    </group>
  );
};

export default Portal; 