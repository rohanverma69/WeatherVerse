import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SnowyScene: React.FC<{ quality?: 'high' | 'medium' | 'low' }> = ({ quality = 'high' }) => {
  const snowRef = useRef<THREE.Points>(null);

  const flakeCount = quality === 'high' ? 1400 : quality === 'medium' ? 800 : 400;

  const [positions, driftSpeeds, wobblePhases] = useMemo(() => {
    const pos = new Float32Array(flakeCount * 3);
    const spd = new Float32Array(flakeCount);
    const wbl = new Float32Array(flakeCount);

    for (let i = 0; i < flakeCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = Math.random() * 20 - 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;

      spd[i] = 0.035 + Math.random() * 0.04;
      wbl[i] = Math.random() * Math.PI * 2;
    }
    return [pos, spd, wbl];
  }, [flakeCount]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (snowRef.current) {
      const posArray = snowRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < flakeCount; i++) {
        // Fall slowly with gentle horizontal swirl
        posArray[i * 3 + 1] -= driftSpeeds[i];
        posArray[i * 3] += Math.sin(time * 1.2 + wobblePhases[i]) * 0.018;
        posArray[i * 3 + 2] += Math.cos(time * 0.9 + wobblePhases[i]) * 0.012;

        // Reset if passed bottom
        if (posArray[i * 3 + 1] < -8) {
          posArray[i * 3 + 1] = 10;
          posArray[i * 3] = (Math.random() - 0.5) * 22;
        }
      }
      snowRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Cool Frosty Ambient Lighting */}
      <ambientLight intensity={0.7} color="#dbeafe" />
      <directionalLight position={[4, 7, 3]} intensity={0.9} color="#e0f2fe" />

      {/* Frost Cloud Canopy */}
      <mesh position={[0, 5, -3]}>
        <sphereGeometry args={[8, 16, 16]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.9}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Swirling Snowflakes */}
      <points ref={snowRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={flakeCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color="#ffffff"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Crystalline Snow Ground Plane */}
      <mesh position={[0, -5.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 18]} />
        <meshStandardMaterial
          color="#e2e8f0"
          roughness={0.6}
          metalness={0.1}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};
