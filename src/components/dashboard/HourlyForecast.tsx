import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Droplets, Wind } from 'lucide-react';
import { HourlyForecastItem, TemperatureUnit, WindSpeedUnit } from '../../types/weather';
import { formatTemp, formatWindSpeed, formatLocalTime } from '../../utils/units';
import { WeatherIcon } from '../ui/WeatherIcon';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  timezone: string;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourly,
  timezone,
  tempUnit,
  windUnit,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full relative rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 shadow-glass">
      {/* Header with Title and Scroll Controls */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>24-Hour Atmospheric Forecast</span>
            <span className="text-xs font-mono font-normal text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-400/20">
              Hourly Live
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Hourly temperature trends, sky condition, and precipitation risk
          </p>
        </div>

        {/* Carousel buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
            aria-label="Scroll hourly forecast left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
            aria-label="Scroll hourly forecast right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {hourly.map((item, index) => {
          const isNow = index === 0;
          const timeLabel = isNow
            ? 'Now'
            : formatLocalTime(item.timestamp, timezone, { hour: 'numeric', hour12: true });

          return (
            <div
              key={item.time}
              className={`flex-shrink-0 w-28 flex flex-col items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 group hover:-translate-y-1 ${
                isNow
                  ? 'bg-gradient-to-b from-cyan-500/20 to-blue-600/10 border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.08] hover:border-cyan-400/25'
              }`}
            >
              {/* Hour Label */}
              <span className={`text-xs font-mono font-medium ${isNow ? 'text-cyan-300 font-bold' : 'text-slate-400'}`}>
                {timeLabel}
              </span>

              {/* Weather Icon */}
              <div className="my-3 transition-transform group-hover:scale-110">
                <WeatherIcon condition={item.condition} isDay={item.isDay} size={28} />
              </div>

              {/* Temperature */}
              <span className="text-base font-bold text-white mb-2">
                {formatTemp(item.temperature, tempUnit)}
              </span>

              {/* Precipitation & Wind metadata */}
              <div className="w-full flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                {/* Rain % */}
                <div className="flex items-center gap-1 text-cyan-300" title="Precipitation chance">
                  <Droplets className="w-3 h-3 text-cyan-400" />
                  <span>{item.precipitationProbability}%</span>
                </div>

                {/* Wind */}
                <div className="flex items-center gap-0.5 text-slate-400" title="Wind speed">
                  <Wind className="w-2.5 h-2.5" />
                  <span className="text-[10px]">{Math.round(item.windSpeed)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
