import React, { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { WeatherConditionType } from '../../types/weather';
import { SunnyScene } from './scenes/SunnyScene';
import { NightScene } from './scenes/NightScene';
import { CloudyScene } from './scenes/CloudyScene';
import { RainyScene } from './scenes/RainyScene';
import { ThunderstormScene } from './scenes/ThunderstormScene';
import { SnowyScene } from './scenes/SnowyScene';
import { FoggyScene } from './scenes/FoggyScene';

interface WeatherCanvasProps {
  condition: WeatherConditionType;
  isDay: boolean;
  quality?: 'high' | 'medium' | 'low';
}

// Camera Rig that softly follows mouse parallax
const CameraRig: React.FC = () => {
  const { camera, pointer } = useThree();
  const vec = useRef({ x: 0, y: 0 });

  useFrame(() => {
    // Smooth lerp to mouse position
    vec.current.x += (pointer.x * 0.8 - vec.current.x) * 0.05;
    vec.current.y += (pointer.y * 0.5 - vec.current.y) * 0.05;

    camera.position.x = vec.current.x;
    camera.position.y = vec.current.y;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// Check if WebGL is supported
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

// Fallback background when WebGL is unavailable
const WebGLFallback: React.FC<{ condition: WeatherConditionType; isDay: boolean }> = ({ condition, isDay }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Ambient gradient glow spheres */}
      <div className={`absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] opacity-40 transition-colors duration-1000 ${
        condition === 'sunny' ? 'bg-amber-500' :
        condition === 'clear_night' ? 'bg-indigo-600' :
        condition === 'thunderstorm' ? 'bg-purple-700' :
        condition === 'snowy' ? 'bg-sky-200' :
        'bg-cyan-600'
      }`} />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-[120px] opacity-30 bg-violet-600" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030712]/50 to-[#030712]" />
    </div>
  );
};

export const WeatherCanvas: React.FC<WeatherCanvasProps> = ({
  condition,
  isDay,
  quality = 'high',
}) => {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());
  }, []);

  // Determine which 3D scene to mount
  const renderScene = () => {
    switch (condition) {
      case 'sunny':
        return isDay ? <SunnyScene quality={quality} /> : <NightScene quality={quality} />;
      case 'clear_night':
        return <NightScene quality={quality} />;
      case 'partly_cloudy':
        return <CloudyScene partly quality={quality} />;
      case 'cloudy':
        return <CloudyScene quality={quality} />;
      case 'rainy':
        return <RainyScene quality={quality} />;
      case 'heavy_rain':
        return <RainyScene heavy quality={quality} />;
      case 'thunderstorm':
        return <ThunderstormScene quality={quality} />;
      case 'snowy':
        return <SnowyScene quality={quality} />;
      case 'foggy':
        return <FoggyScene quality={quality} />;
      default:
        return isDay ? <SunnyScene quality={quality} /> : <NightScene quality={quality} />;
    }
  };

  // Atmosphere background gradient based on condition
  const getAtmosphereGradient = () => {
    if (condition === 'sunny' && isDay) {
      return 'from-[#0b1329] via-[#09152e] to-[#030712]';
    }
    if (condition === 'clear_night' || !isDay) {
      return 'from-[#050814] via-[#080d24] to-[#030712]';
    }
    if (condition === 'thunderstorm') {
      return 'from-[#0c081e] via-[#090b1c] to-[#030712]';
    }
    if (condition === 'rainy' || condition === 'heavy_rain') {
      return 'from-[#07131e] via-[#0a1628] to-[#030712]';
    }
    if (condition === 'snowy') {
      return 'from-[#091524] via-[#081220] to-[#030712]';
    }
    return 'from-[#09101d] via-[#091222] to-[#030712]';
  };

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 transition-colors duration-1000 bg-gradient-to-b ${getAtmosphereGradient()}`}>
      {/* Ambient background light glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]" />

      {hasWebGL ? (
        <Canvas
          camera={{ position: [0, 0, 7], fov: 50 }}
          dpr={quality === 'high' ? [1, 2] : [1, 1.25]}
          gl={{
            antialias: quality === 'high',
            powerPreference: 'high-performance',
            alpha: true,
          }}
          className="w-full h-full"
        >
          <CameraRig />
          <Suspense fallback={null}>
            {renderScene()}
          </Suspense>
        </Canvas>
      ) : (
        <WebGLFallback condition={condition} isDay={isDay} />
      )}

      {/* Atmospheric vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent pointer-events-none opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/60 via-transparent to-[#030712]/60 pointer-events-none" />
    </div>
  );
};
