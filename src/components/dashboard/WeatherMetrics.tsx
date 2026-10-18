import React from 'react';
import { 
  Wind, 
  Droplets, 
  Sun, 
  Compass, 
  Gauge, 
  Eye, 
  Sunrise, 
  Sunset, 
  ShieldAlert, 
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { 
  CurrentWeather, 
  SunTimes, 
  AirQualityData, 
  TemperatureUnit, 
  WindSpeedUnit 
} from '../../types/weather';
import { 
  formatTemp, 
  formatWindSpeed, 
  getWindDirectionLabel 
} from '../../utils/units';
import { TiltCard } from '../ui/TiltCard';

interface WeatherMetricsProps {
  current: CurrentWeather;
  sunTimes: SunTimes;
  airQuality?: AirQualityData;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const WeatherMetrics: React.FC<WeatherMetricsProps> = ({
  current,
  sunTimes,
  airQuality,
  tempUnit,
  windUnit,
}) => {
  // UV Index color & description
  const getUvInfo = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: 'text-emerald-400', bar: 'bg-emerald-400', desc: 'No protection required' };
    if (uv <= 5) return { text: 'Moderate', color: 'text-amber-400', bar: 'bg-amber-400', desc: 'Wear SPF 30+ sunglasses' };
    if (uv <= 7) return { text: 'High', color: 'text-orange-400', bar: 'bg-orange-400', desc: 'Protection essential' };
    if (uv <= 10) return { text: 'Very High', color: 'text-rose-500', bar: 'bg-rose-500', desc: 'Avoid midday direct sun' };
    return { text: 'Extreme', color: 'text-purple-400', bar: 'bg-purple-400', desc: 'Stay indoors if possible' };
  };

  const uvInfo = getUvInfo(current.uvIndex);

  // Daylight remaining calculation
  const daylightHours = Math.floor(sunTimes.daylightDuration / 3600);
  const daylightMinutes = Math.floor((sunTimes.daylightDuration % 3600) / 60);

  return (
    <div className="w-full">
      <div className="mb-5">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span>Atmospheric Telemetry & Metrics</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time physical indicators, sensor gauges, and planetary dynamics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* 1. Wind Speed & Direction Compass */}
        <TiltCard glowColor="cyan">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-3">
            <span className="flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-cyan-400" />
              Wind Telemetry
            </span>
            <span className="text-cyan-300 font-bold">{getWindDirectionLabel(current.windDirection)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-extrabold text-white">
                {formatWindSpeed(current.windSpeed, windUnit)}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Gusts up to <span className="text-slate-200 font-semibold">{formatWindSpeed(current.windGusts, windUnit)}</span>
              </div>
            </div>

            {/* Rotating 3D Compass Dial */}
            <div className="relative w-16 h-16 rounded-full border border-white/10 bg-slate-800/50 flex items-center justify-center shadow-inner">
              <span className="absolute top-1 text-[9px] font-mono text-slate-400">N</span>
              <span className="absolute bottom-1 text-[9px] font-mono text-slate-400">S</span>
              <span className="absolute left-1 text-[9px] font-mono text-slate-400">W</span>
              <span className="absolute right-1 text-[9px] font-mono text-slate-400">E</span>
              <div
                className="w-10 h-10 flex items-center justify-center transition-transform duration-700"
                style={{ transform: `rotate(${current.windDirection}deg)` }}
              >
                <div className="w-1 h-7 bg-gradient-to-t from-transparent via-cyan-400 to-rose-400 rounded-full shadow-[0_0_8px_#00f2fe]" />
              </div>
            </div>
          </div>
        </TiltCard>

        {/* 2. Humidity & Dew Point */}
        <TiltCard glowColor="blue">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-3">
            <span className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-400" />
              Relative Humidity
            </span>
            <span className="text-blue-300 font-bold">{current.humidity}%</span>
          </div>

          <div className="space-y-3">
            <div className="text-3xl font-extrabold text-white">
              {current.humidity}%
            </div>

            {/* Humidity Fill Bar */}
            <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{ width: `${Math.min(100, current.humidity)}%` }}
              />
            </div>

            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Comfort: {current.humidity > 65 ? 'Humid' : current.humidity < 30 ? 'Dry' : 'Optimal'}</span>
              <span>Cloud Cover: {current.cloudCover}%</span>
            </div>
          </div>
        </TiltCard>

        {/* 3. UV Index */}
        <TiltCard glowColor="amber">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-3">
            <span className="flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" />
              UV Radiation Index
            </span>
            <span className={`font-bold ${uvInfo.color}`}>{uvInfo.text}</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{current.uvIndex}</span>
              <span className="text-xs text-slate-400 font-mono">/ 11+ max</span>
            </div>

            {/* Segmented UV Meter */}
            <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/5 flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => (
                <div
                  key={step}
                  className={`h-full flex-1 rounded-sm transition-all duration-500 ${
                    step <= current.uvIndex ? uvInfo.bar : 'bg-slate-700/40'
                  }`}
                />
              ))}
            </div>

            <div className="text-xs text-slate-400">{uvInfo.desc}</div>
          </div>
        </TiltCard>

        {/* 4. Air Quality Index (AQI) */}
        <TiltCard glowColor={airQuality?.aqiCategory === 'Good' ? 'emerald' : 'purple'}>
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-3">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              Air Quality Telemetry
            </span>
            <span className="font-bold text-emerald-300">
              {airQuality ? airQuality.aqiCategory : 'Moderate'}
            </span>
          </div>

          {airQuality ? (
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{airQuality.aqi}</span>
                <span className="text-xs font-mono text-slate-400">US AQI</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5 text-[11px] font-mono text-slate-300">
                <div>PM2.5: <span className="text-cyan-300">{airQuality.pm2_5} µg/m³</span></div>
                <div>PM10: <span className="text-cyan-300">{airQuality.pm10} µg/m³</span></div>
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-1">
                Ozone: {airQuality.ozone} µg/m³ • NO₂: {airQuality.nitrogenDioxide} µg/m³
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-3xl font-extrabold text-white">42</div>
              <div className="text-xs text-emerald-400">Good • Clean Air Atmosphere</div>
            </div>
          )}
        </TiltCard>

        {/* 5. Atmospheric Surface Pressure */}
        <TiltCard glowColor="purple">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-3">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-purple-400" />
              Barometric Pressure
            </span>
            <span className="text-purple-300 font-bold">hPa</span>
          </div>

          <div className="space-y-3">
            <div className="text-3xl font-extrabold text-white">
              {current.pressure}{' '}
              <span className="text-sm font-normal text-slate-400">hPa</span>
            </div>

            <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-purple-500 shadow-[0_0_8px_#8b5cf6]"
                style={{ width: `${Math.min(100, Math.max(10, ((current.pressure - 950) / 100) * 100))}%` }}
              />
            </div>

            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>{current.pressure > 1013 ? 'High Pressure (Stable)' : 'Low Pressure (Active)'}</span>
              <span className="font-mono">{current.pressure} mbar</span>
            </div>
          </div>
        </TiltCard>

        {/* 6. Visibility */}
        <TiltCard glowColor="cyan">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-3">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-400" />
              Atmospheric Visibility
            </span>
            <span className="text-cyan-300 font-bold">Clarity</span>
          </div>

          <div className="space-y-3">
            <div className="text-3xl font-extrabold text-white">
              {current.visibility}{' '}
              <span className="text-sm font-normal text-slate-400">km</span>
            </div>

            <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2fe]"
                style={{ width: `${Math.min(100, (current.visibility / 15) * 100)}%` }}
              />
            </div>

            <div className="text-xs text-slate-400">
              {current.visibility >= 10 ? 'Crystal clear optical line-of-sight' : 'Haze or mist reducing visibility'}
            </div>
          </div>
        </TiltCard>

        {/* 7. Sunrise & Sunset Solar Arc */}
        <TiltCard glowColor="amber" className="sm:col-span-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-3">
            <span className="flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" />
              Celestial Arc & Daylight
            </span>
            <span className="text-amber-300 font-bold">
              {daylightHours}h {daylightMinutes}m total daylight
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
            {/* Sunrise */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Sunrise className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-mono text-slate-400 uppercase">Sunrise</div>
                <div className="text-2xl font-bold text-white tracking-tight">{sunTimes.sunrise}</div>
              </div>
            </div>

            {/* Arc visual separator */}
            <div className="hidden sm:flex flex-col items-center">
              <div className="w-24 h-10 border-t-2 border-dashed border-amber-400/40 rounded-t-full relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-amber-400 rounded-full shadow-[0_0_10px_#f59e0b]" />
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1">Solar Noon</span>
            </div>

            {/* Sunset */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-400/20 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <Sunset className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-mono text-slate-400 uppercase">Sunset</div>
                <div className="text-2xl font-bold text-white tracking-tight">{sunTimes.sunset}</div>
              </div>
            </div>
          </div>
        </TiltCard>
      </div>
    </div>
  );
};
