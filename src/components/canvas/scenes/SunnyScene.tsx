import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SunnyScene: React.FC<{ quality?: 'high' | 'medium' | 'low' }> = ({ quality = 'high' }) => {
  const sunRef = useRef<THREE.Mesh>(null);
  const raysRef = useRef<THREE.Group>(null);
  const flareRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = quality === 'high' ? 300 : quality === 'medium' ? 150 : 80;

  // Floating solar dust particles
  const [particlesPos, particleVelocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = Math.random() * 0.008 + 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    return [pos, vel];
  }, [particleCount]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Pulse and rotate sun
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.15;
      const scale = 1 + Math.sin(time * 1.5) * 0.03;
      sunRef.current.scale.set(scale, scale, scale);
    }

    // Rotate rays
    if (raysRef.current) {
      raysRef.current.rotation.z -= delta * 0.08;
      const rayScale = 1 + Math.sin(time * 2) * 0.05;
      raysRef.current.scale.set(rayScale, rayScale, 1);
    }

    // Animate solar dust particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleVelocities[i * 3 + 1];
        positions[i * 3] += Math.sin(time + i) * 0.003;

        // Reset if drifted too high
        if (positions[i * 3 + 1] > 7) {
          positions[i * 3 + 1] = -7;
          positions[i * 3] = (Math.random() - 0.5) * 16;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[2.5, 1.2, -1]}>
      {/* Dynamic Solar Lighting */}
      <pointLight position={[0, 0, 1]} intensity={3.5} color="#fbbf24" distance={25} />
      <ambientLight intensity={0.6} color="#fed7aa" />

      {/* Sun Core Sphere */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#fbbf24"
          emissiveIntensity={1.8}
          roughness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* Sun Corona Halo Ring 1 */}
      <mesh>
        <ringGeometry args={[1.35, 1.9, 64]} />
        <meshBasicMaterial
          color="#fde047"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sun Corona Halo Ring 2 (Outer Glow) */}
      <mesh>
        <ringGeometry args={[1.9, 2.8, 64]} />
        <meshBasicMaterial
          color="#fb923c"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Animated Light Rays */}
      <group ref={raysRef}>
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => (
          <mesh
            key={idx}
            rotation={[0, 0, (angle * Math.PI) / 180]}
            position={[0, 0, -0.05]}
          >
            <planeGeometry args={[idx % 2 === 0 ? 0.12 : 0.08, idx % 2 === 0 ? 5.2 : 4.0]} />
            <meshBasicMaterial
              color={idx % 2 === 0 ? '#fef08a' : '#fed7aa'}
              transparent
              opacity={idx % 2 === 0 ? 0.35 : 0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Floating Golden Stardust Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlesPos}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#fef08a"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
