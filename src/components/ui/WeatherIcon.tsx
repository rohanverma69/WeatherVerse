import React from 'react';
import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudSun, 
  CloudMoon, 
  CloudRain, 
  CloudDrizzle, 
  CloudLightning, 
  Snowflake, 
  CloudFog, 
  Wind 
} from 'lucide-react';
import { WeatherConditionType } from '../../types/weather';

interface WeatherIconProps {
  condition: WeatherConditionType;
  isDay?: boolean;
  className?: string;
  size?: number;
  animate?: boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  isDay = true,
  className = '',
  size = 28,
  animate = true,
}) => {
  const iconProps = {
    size,
    strokeWidth: 1.8,
  };

  switch (condition) {
    case 'sunny':
      return (
        <div className={`relative inline-flex items-center justify-center text-amber-400 ${animate ? 'animate-spin-slow' : ''} ${className}`}>
          <Sun {...iconProps} className="drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
        </div>
      );

    case 'clear_night':
      return (
        <div className={`relative inline-flex items-center justify-center text-indigo-300 ${className}`}>
          <Moon {...iconProps} className="drop-shadow-[0_0_12px_rgba(165,180,252,0.6)]" />
        </div>
      );

    case 'partly_cloudy':
      return (
        <div className={`relative inline-flex items-center justify-center ${isDay ? 'text-amber-300' : 'text-indigo-300'} ${className}`}>
          {isDay ? (
            <CloudSun {...iconProps} className="drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]" />
          ) : (
            <CloudMoon {...iconProps} className="drop-shadow-[0_0_10px_rgba(165,180,252,0.4)]" />
          )}
        </div>
      );

    case 'cloudy':
      return (
        <div className={`relative inline-flex items-center justify-center text-slate-300 ${className}`}>
          <Cloud {...iconProps} className="drop-shadow-[0_0_8px_rgba(203,213,225,0.4)]" />
        </div>
      );

    case 'rainy':
      return (
        <div className={`relative inline-flex items-center justify-center text-cyan-400 ${className}`}>
          <CloudDrizzle {...iconProps} className="drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
        </div>
      );

    case 'heavy_rain':
      return (
        <div className={`relative inline-flex items-center justify-center text-blue-400 ${className}`}>
          <CloudRain {...iconProps} className="drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
        </div>
      );

    case 'thunderstorm':
      return (
        <div className={`relative inline-flex items-center justify-center text-amber-300 ${className}`}>
          <CloudLightning {...iconProps} className="drop-shadow-[0_0_14px_rgba(245,158,11,0.7)]" />
        </div>
      );

    case 'snowy':
      return (
        <div className={`relative inline-flex items-center justify-center text-sky-200 ${animate ? 'hover:rotate-180 transition-transform duration-700' : ''} ${className}`}>
          <Snowflake {...iconProps} className="drop-shadow-[0_0_12px_rgba(224,242,254,0.7)]" />
        </div>
      );

    case 'foggy':
      return (
        <div className={`relative inline-flex items-center justify-center text-slate-300 ${className}`}>
          <CloudFog {...iconProps} className="drop-shadow-[0_0_8px_rgba(148,163,184,0.4)]" />
        </div>
      );

    case 'windy':
      return (
        <div className={`relative inline-flex items-center justify-center text-teal-300 ${className}`}>
          <Wind {...iconProps} className="drop-shadow-[0_0_8px_rgba(94,234,212,0.4)]" />
        </div>
      );

    default:
      return (
        <div className={`relative inline-flex items-center justify-center text-cyan-300 ${className}`}>
          <Sun {...iconProps} />
        </div>
      );
  }
};
