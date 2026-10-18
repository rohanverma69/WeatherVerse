import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ThunderstormScene: React.FC<{ quality?: 'high' | 'medium' | 'low' }> = ({ quality = 'high' }) => {
  const rainRef = useRef<THREE.Points>(null);
  const flashLight1 = useRef<THREE.PointLight>(null);
  const flashLight2 = useRef<THREE.PointLight>(null);
  const boltRef = useRef<THREE.Line>(null);

  const dropCount = quality === 'high' ? 2200 : quality === 'medium' ? 1400 : 700;

  // Rain positions
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(dropCount * 3);
    const spd = new Float32Array(dropCount);
    for (let i = 0; i < dropCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = Math.random() * 22 - 11;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
      spd[i] = 0.42 + Math.random() * 0.2;
    }
    return [pos, spd];
  }, [dropCount]);

  // Lightning state
  const lightning = useRef({
    timer: 0,
    interval: 3.5,
    isStriking: false,
    strikeTimer: 0,
    burstCount: 0,
  });

  useFrame((_, delta) => {
    // Animate torrential rain with severe wind slant
    if (rainRef.current) {
      const posArray = rainRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < dropCount; i++) {
        posArray[i * 3 + 1] -= speeds[i];
        posArray[i * 3] -= speeds[i] * 0.25; // severe storm wind
        if (posArray[i * 3 + 1] < -8) {
          posArray[i * 3 + 1] = 12;
          posArray[i * 3] = (Math.random() - 0.5) * 26;
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Dynamic lightning trigger
    const l = lightning.current;
    l.timer += delta;

    if (!l.isStriking && l.timer > l.interval) {
      l.isStriking = true;
      l.timer = 0;
      l.strikeTimer = 0;
      l.burstCount = Math.floor(Math.random() * 3) + 2; // double or triple strike
    }

    if (l.isStriking) {
      l.strikeTimer += delta;
      // Strobe flash calculation
      const strobe = Math.sin(l.strikeTimer * 45) > 0.2;
      const intensity = strobe ? 6.5 : 0.8;

      if (flashLight1.current) flashLight1.current.intensity = intensity;
      if (flashLight2.current) flashLight2.current.intensity = intensity * 0.7;

      if (boltRef.current) {
        boltRef.current.visible = strobe;
      }

      if (l.strikeTimer > 0.28) {
        l.isStriking = false;
        l.timer = 0;
        l.interval = 2.5 + Math.random() * 4.5;
        if (flashLight1.current) flashLight1.current.intensity = 0;
        if (flashLight2.current) flashLight2.current.intensity = 0;
        if (boltRef.current) boltRef.current.visible = false;
      }
    }
  });

  // Jagged lightning bolt geometry
  const boltGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [
      new THREE.Vector3(1, 6, -1),
      new THREE.Vector3(0.5, 4.2, -1.2),
      new THREE.Vector3(1.2, 3.1, -0.8),
      new THREE.Vector3(0.1, 1.8, -1),
      new THREE.Vector3(0.8, 0.4, -0.9),
      new THREE.Vector3(-0.3, -1.2, -1.1),
      new THREE.Vector3(0.4, -3.0, -1),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  return (
    <group>
      {/* Dark Ominous Ambient Lighting */}
      <ambientLight intensity={0.25} color="#1e1b4b" />
      <directionalLight position={[-4, 8, 3]} intensity={0.3} color="#4338ca" />

      {/* Intense Cyan and Violet Lightning Flashes */}
      <pointLight
        ref={flashLight1}
        position={[1, 4, 1]}
        intensity={0}
        color="#a5f3fc"
        distance={40}
      />
      <pointLight
        ref={flashLight2}
        position={[-3, 5, -2]}
        intensity={0}
        color="#c084fc"
        distance={35}
      />

      {/* Heavy Storm Clouds */}
      <group position={[0, 4.5, -2]}>
        <mesh position={[-3, 0, 0]}>
          <sphereGeometry args={[4.5, 16, 16]} />
          <meshStandardMaterial color="#090d16" roughness={0.9} transparent opacity={0.88} />
        </mesh>
        <mesh position={[2, 0.5, -1]}>
          <sphereGeometry args={[5, 16, 16]} />
          <meshStandardMaterial color="#0d111e" roughness={0.9} transparent opacity={0.85} />
        </mesh>
        <mesh position={[0, -0.5, 1]}>
          <sphereGeometry args={[4.2, 16, 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} transparent opacity={0.82} />
        </mesh>
      </group>

      {/* Jagged Lightning Bolt Line */}
      <primitive
        object={new THREE.Line(
          boltGeometry,
          new THREE.LineBasicMaterial({
            color: '#e0f2fe',
            linewidth: 3,
            transparent: true,
            opacity: 0.95,
          })
        )}
        ref={boltRef}
        visible={false}
      />

      {/* Torrential Storm Rain */}
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
          size={0.08}
          color="#93c5fd"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
