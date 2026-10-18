import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const NightScene: React.FC<{ quality?: 'high' | 'medium' | 'low' }> = ({ quality = 'high' }) => {
  const moonRef = useRef<THREE.Mesh>(null);
  const starsRef = useRef<THREE.Points>(null);
  const meteorRef = useRef<THREE.Group>(null);

  const starCount = quality === 'high' ? 1800 : quality === 'medium' ? 1000 : 500;

  // Starfield positions and colors
  const [starPositions, starColors] = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const palette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#a5f3fc'), // Cyan tint
      new THREE.Color('#ddd6fe'), // Violet tint
      new THREE.Color('#fef08a'), // Warm tint
    ];

    for (let i = 0; i < starCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    return [pos, colors];
  }, [starCount]);

  // Shooting star animation state
  const meteorState = useRef({
    x: -12,
    y: 8,
    z: -8,
    active: true,
    speed: 0.18,
  });

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Gentle moon rotation
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.05;
      moonRef.current.position.y = 1.2 + Math.sin(time * 0.5) * 0.08;
    }

    // Starfield gentle rotation
    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.015;
      starsRef.current.rotation.x = Math.sin(time * 0.02) * 0.05;
    }

    // Shooting star animation
    if (meteorRef.current) {
      const ms = meteorState.current;
      ms.x += ms.speed;
      ms.y -= ms.speed * 0.6;

      if (ms.x > 15 || ms.y < -10) {
        // Reset shooting star
        ms.x = -15 + Math.random() * 5;
        ms.y = 8 + Math.random() * 4;
        ms.speed = 0.2 + Math.random() * 0.15;
      }
      meteorRef.current.position.set(ms.x, ms.y, ms.z);
    }
  });

  return (
    <group>
      {/* Soft Lunar Lighting */}
      <pointLight position={[2.5, 1.5, 2]} intensity={2.2} color="#c7d2fe" distance={20} />
      <ambientLight intensity={0.25} color="#312e81" />

      {/* Moon Group */}
      <group position={[2.8, 1.2, -1]}>
        {/* Moon Sphere */}
        <mesh ref={moonRef}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshStandardMaterial
            color="#e2e8f0"
            emissive="#93c5fd"
            emissiveIntensity={0.65}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* Lunar Halo Glow Ring 1 */}
        <mesh>
          <ringGeometry args={[1.25, 1.8, 64]} />
          <meshBasicMaterial
            color="#818cf8"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Lunar Halo Glow Ring 2 */}
        <mesh>
          <ringGeometry args={[1.8, 2.6, 64]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Starfield */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starCount}
            array={starPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={starCount}
            array={starColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Shooting Star Streak */}
      <group ref={meteorRef}>
        <mesh rotation={[0, 0, -Math.PI / 6]}>
          <planeGeometry args={[1.2, 0.04]} />
          <meshBasicMaterial
            color="#67e8f9"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
};
