// src/components/TogglingPlatform.tsx
import React, { useState, useEffect } from 'react';

interface TogglingPlatformProps {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  toggleInterval: number;
  platformId: string;
  setPlatformStates: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

const TogglingPlatform: React.FC<TogglingPlatformProps> = ({ 
  position, 
  size, 
  color, 
  toggleInterval,
  platformId,
  setPlatformStates
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(prev => {
        const newState = !prev;
        setPlatformStates(prevStates => ({
          ...prevStates,
          [platformId]: newState
        }));
        return newState;
      });
    }, toggleInterval * 1000);

    // Initialize platform state
    setPlatformStates(prev => ({
      ...prev,
      [platformId]: true
    }));

    return () => {
      clearInterval(interval);
      // Cleanup platform state
      setPlatformStates(prev => {
        const newState = { ...prev };
        delete newState[platformId];
        return newState;
      });
    };
  }, [toggleInterval, platformId, setPlatformStates]);

  return (
    <mesh position={position} visible={visible}>
      <boxGeometry args={size} />
      <meshStandardMaterial 
        color={color || '#00ff00'} 
        transparent
        opacity={visible ? 1 : 0}
      >
        <primitive attach="onBeforeCompile" object={(shader: any) => {
          shader.uniforms.time = { value: 0 };
          shader.vertexShader = `
            uniform float time;
            ${shader.vertexShader}
          `;
          shader.fragmentShader = `
            uniform float time;
            ${shader.fragmentShader}
          `.replace(
            'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
            'gl_FragColor = vec4( outgoingLight, diffuseColor.a * (visible ? 1.0 : 0.0) );'
          );
        }} />
      </meshStandardMaterial>
    </mesh>
  );
};

export default TogglingPlatform;
