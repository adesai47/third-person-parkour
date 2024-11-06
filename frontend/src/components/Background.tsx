import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BackgroundProps {
  mode: 'day' | 'night';
}

const Background: React.FC<BackgroundProps> = ({ mode }) => {
  const starsRef = useRef<THREE.Points>(null);

  // Create stars
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 1000;
  const starPositions = new Float32Array(starCount * 3);
  
  for(let i = 0; i < starCount * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 100;
    starPositions[i + 1] = (Math.random() - 0.5) * 100;
    starPositions[i + 2] = -Math.random() * 50;
  }
  
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

  useFrame((state) => {
    if (starsRef.current && mode === 'night') {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <>
      {/* Sky */}
      <color attach="background" args={[mode === 'day' ? '#87CEEB' : '#000033']} />
      
      {/* Sun/Moon */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={mode === 'day' ? 1 : 0.1}
        color={mode === 'day' ? '#ffffff' : '#b4c9de'}
      />
      
      {/* Ambient light */}
      <ambientLight intensity={mode === 'day' ? 0.5 : 0.1} />
      
      {/* Stars (only visible at night) */}
      {mode === 'night' && (
        <points ref={starsRef}>
          <primitive object={starGeometry} />
          <pointsMaterial
            size={0.1}
            color="#ffffff"
            transparent
            opacity={0.8}
            sizeAttenuation
          />
        </points>
      )}
      
      {/* Moon (only visible at night) */}
      {mode === 'night' && (
        <mesh position={[15, 15, -10]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial
            color="#b4c9de"
            emissive="#b4c9de"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </>
  );
};

export default Background; 