import React from 'react';
import { Calendar, Droplets, Wind, Sun, ArrowUp, ArrowDown } from 'lucide-react';
import { DailyForecastItem, TemperatureUnit } from '../../types/weather';
import { formatTemp, formatTempNumber } from '../../utils/units';
import { WeatherIcon } from '../ui/WeatherIcon';

interface DailyForecastProps {
  daily: DailyForecastItem[];
  tempUnit: TemperatureUnit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({
  daily,
  tempUnit,
}) => {
  // Find global min and max among all 7 days for the temperature range bar
  const allMins = daily.map((d) => formatTempNumber(d.minTemp, tempUnit));
  const allMaxs = daily.map((d) => formatTempNumber(d.maxTemp, tempUnit));
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const range = globalMax - globalMin || 1;

  return (
    <div className="w-full relative rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 shadow-glass">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <span>7-Day Atmospheric Outlook</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Extended daily forecast, temperature range distribution, and weather conditions
          </p>
        </div>
      </div>

      {/* Forecast list */}
      <div className="space-y-3">
        {daily.map((item, index) => {
          const isToday = index === 0;
          const minVal = formatTempNumber(item.minTemp, tempUnit);
          const maxVal = formatTempNumber(item.maxTemp, tempUnit);

          // Calculate percentage for temperature bar
          const leftPercent = Math.max(0, ((minVal - globalMin) / range) * 100);
          const rightPercent = Math.min(100, ((maxVal - globalMin) / range) * 100);
          const barWidthPercent = Math.max(8, rightPercent - leftPercent);

          return (
            <div
              key={item.date}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/[0.04] ${
                isToday
                  ? 'bg-cyan-500/[0.08] border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'bg-white/[0.02] border-white/[0.06]'
              }`}
            >
              {/* Day & Date & Condition */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="w-10 text-left">
                  <div className={`text-sm font-bold ${isToday ? 'text-cyan-300' : 'text-white'}`}>
                    {item.dayOfWeek}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {new Date(item.date).toLocaleDateString([], { month: 'numeric', day: 'numeric' })}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <WeatherIcon condition={item.condition} isDay size={26} />
                  <span className="text-xs text-slate-300 font-medium hidden md:inline">
                    {item.conditionText}
                  </span>
                </div>
              </div>

              {/* Rain Probability */}
              <div className="flex items-center gap-1.5 min-w-[80px] my-2 sm:my-0 text-xs">
                {item.precipitationProbability > 0 ? (
                  <div className="flex items-center gap-1 text-cyan-400 font-mono">
                    <Droplets className="w-3.5 h-3.5" />
                    <span>{item.precipitationProbability}%</span>
                  </div>
                ) : (
                  <span className="text-slate-500 font-mono text-[11px]">-</span>
                )}
              </div>

              {/* Temperature Bar & Min/Max */}
              <div className="flex items-center gap-3 flex-1 max-w-sm">
                {/* Min Temp */}
                <span className="text-xs font-mono font-medium text-slate-400 w-10 text-right">
                  {minVal}°
                </span>

                {/* Range Bar Track */}
                <div className="relative flex-1 h-2 bg-slate-800/80 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidthPercent}%`,
                    }}
                  />
                </div>

                {/* Max Temp */}
                <span className="text-xs font-mono font-bold text-white w-10 text-left">
                  {maxVal}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
