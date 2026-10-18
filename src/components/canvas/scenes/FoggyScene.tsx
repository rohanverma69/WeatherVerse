import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FogLayer: React.FC<{
  position: [number, number, number];
  scale: [number, number];
  speed: number;
  color?: string;
  baseOpacity?: number;
}> = ({ position, scale, speed, color = '#94a3b8', baseOpacity = 0.25 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.x += delta * speed;
      if (meshRef.current.position.x > 10) {
        meshRef.current.position.x = -10;
      }
    }
    if (materialRef.current) {
      materialRef.current.opacity = baseOpacity + Math.sin(time * 0.8 + position[1]) * 0.08;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={scale} />
      <meshBasicMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={baseOpacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export const FoggyScene: React.FC<{ quality?: 'high' | 'medium' | 'low' }> = ({ quality = 'high' }) => {
  return (
    <group>
      <ambientLight intensity={0.5} color="#64748b" />
      <directionalLight position={[0, 5, 2]} intensity={0.4} color="#94a3b8" />

      {/* Layered Fog Sheets */}
      <FogLayer position={[-2, 1.5, -1]} scale={[16, 4]} speed={0.05} color="#cbd5e1" baseOpacity={0.22} />
      <FogLayer position={[3, -0.5, 0]} scale={[18, 5]} speed={-0.04} color="#94a3b8" baseOpacity={0.28} />
      <FogLayer position={[-4, -2.0, 1]} scale={[20, 4]} speed={0.06} color="#64748b" baseOpacity={0.25} />

      {quality !== 'low' && (
        <>
          <FogLayer position={[1, 3.0, -3]} scale={[22, 6]} speed={-0.03} color="#475569" baseOpacity={0.32} />
          <FogLayer position={[-1, 0.2, -2]} scale={[16, 3]} speed={0.07} color="#cbd5e1" baseOpacity={0.18} />
        </>
      )}
    </group>
  );
};
