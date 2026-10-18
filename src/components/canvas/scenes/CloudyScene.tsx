import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural Cloud Puff Cluster
const CloudCluster: React.FC<{
  position: [number, number, number];
  scale?: number;
  speed?: number;
  color?: string;
}> = ({ position, scale = 1, speed = 0.05, color = '#cbd5e1' }) => {
  const groupRef = useRef<THREE.Group>(null);
  const initialX = position[0];

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x += delta * speed;
      // Wrap around when off-screen
      if (groupRef.current.position.x > 14) {
        groupRef.current.position.x = -14;
      }
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Central main sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial
          color={color}
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={0.88}
        />
      </mesh>
      {/* Left lobe */}
      <mesh position={[-0.9, -0.2, 0.2]}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshStandardMaterial
          color={color}
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Right lobe */}
      <mesh position={[0.9, -0.1, -0.1]}>
        <sphereGeometry args={[0.95, 16, 16]} />
        <meshStandardMaterial
          color={color}
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Top puff */}
      <mesh position={[0.2, 0.7, 0.1]}>
        <sphereGeometry args={[0.85, 16, 16]} />
        <meshStandardMaterial
          color={color}
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={0.88}
        />
      </mesh>
      {/* Back fluff */}
      <mesh position={[-0.4, 0.4, -0.4]}>
        <sphereGeometry args={[0.75, 16, 16]} />
        <meshStandardMaterial
          color={color}
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

export const CloudyScene: React.FC<{
  partly?: boolean;
  quality?: 'high' | 'medium' | 'low';
}> = ({ partly = false, quality = 'high' }) => {
  return (
    <group>
      {/* Atmospheric Cloud Lighting */}
      <ambientLight intensity={partly ? 0.8 : 0.55} color={partly ? '#fef3c7' : '#94a3b8'} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={partly ? 1.8 : 0.9}
        color={partly ? '#fef08a' : '#cbd5e1'}
      />

      {/* Sun glow peeking behind clouds if partly cloudy */}
      {partly && (
        <group position={[3.5, 2.5, -3]}>
          <mesh>
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={1.5}
            />
          </mesh>
          <pointLight color="#fbbf24" intensity={2} distance={20} />
        </group>
      )}

      {/* Clouds at various depths and speeds */}
      <CloudCluster position={[-6, 2.2, -2]} scale={1.2} speed={0.08} color="#e2e8f0" />
      <CloudCluster position={[1, 1.6, -1]} scale={1.4} speed={0.06} color="#cbd5e1" />
      <CloudCluster position={[7, 2.8, -3]} scale={1.1} speed={0.05} color="#94a3b8" />
      <CloudCluster position={[-2, 0.4, -4]} scale={1.6} speed={0.04} color="#64748b" />

      {quality !== 'low' && (
        <>
          <CloudCluster position={[-9, 1.0, -5]} scale={1.8} speed={0.03} color="#475569" />
          <CloudCluster position={[4, -0.5, -2.5]} scale={1.0} speed={0.07} color="#cbd5e1" />
        </>
      )}
    </group>
  );
};
