import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const RainyScene: React.FC<{
  heavy?: boolean;
  quality?: 'high' | 'medium' | 'low';
}> = ({ heavy = false, quality = 'high' }) => {
  const rainRef = useRef<THREE.Points>(null);
  const flashLightRef = useRef<THREE.PointLight>(null);

  const dropCount = heavy
    ? (quality === 'high' ? 2400 : 1400)
    : (quality === 'high' ? 1400 : 800);

  // Rain drop positions and speeds
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(dropCount * 3);
    const spd = new Float32Array(dropCount);

    for (let i = 0; i < dropCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = Math.random() * 20 - 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
      spd[i] = (heavy ? 0.45 : 0.28) + Math.random() * 0.15;
    }
    return [pos, spd];
  }, [dropCount, heavy]);

  // Lightning timer
  const lightningState = useRef({
    nextFlash: 5 + Math.random() * 8,
    isFlashing: false,
    flashDuration: 0.12,
    timer: 0,
  });

  useFrame((_, delta) => {
    // Animate falling rain
    if (rainRef.current) {
      const posArray = rainRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < dropCount; i++) {
        // Fall down with wind slant
        posArray[i * 3 + 1] -= speeds[i];
        posArray[i * 3] -= speeds[i] * 0.15; // wind slant

        // Reset to top when passing bottom
        if (posArray[i * 3 + 1] < -8) {
          posArray[i * 3 + 1] = 12;
          posArray[i * 3] = (Math.random() - 0.5) * 24;
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Occasional distant lightning flash
    const ls = lightningState.current;
    ls.timer += delta;
    if (!ls.isFlashing && ls.timer > ls.nextFlash) {
      ls.isFlashing = true;
      ls.timer = 0;
      if (flashLightRef.current) {
        flashLightRef.current.intensity = 4.5;
      }
    } else if (ls.isFlashing && ls.timer > ls.flashDuration) {
      ls.isFlashing = false;
      ls.timer = 0;
      ls.nextFlash = 6 + Math.random() * 10;
      if (flashLightRef.current) {
        flashLightRef.current.intensity = 0;
      }
    }
  });

  return (
    <group>
      {/* Moody Rain Atmospheric Lighting */}
      <ambientLight intensity={0.4} color="#334155" />
      <directionalLight position={[-4, 8, 3]} intensity={0.6} color="#64748b" />
      
      {/* Distant Lightning Flash Light */}
      <pointLight
        ref={flashLightRef}
        position={[0, 6, -3]}
        intensity={0}
        color="#a5f3fc"
        distance={35}
      />

      {/* Dark Rain Clouds at Top */}
      <mesh position={[0, 5.5, -3]}>
        <sphereGeometry args={[7, 16, 16]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.9}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh position={[-4, 6.0, -2]}>
        <sphereGeometry args={[6, 16, 16]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.9}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Rain Streaks */}
      <points ref={rainRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dropCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={heavy ? 0.08 : 0.06}
          color="#93c5fd"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Ground Water Splash / Puddle Reflection Plane */}
      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
};
