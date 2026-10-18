import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Share2, 
  RefreshCw, 
  MapPin, 
  Clock, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  Sparkles,
  Thermometer
} from 'lucide-react';
import { WeatherData, TemperatureUnit, LocationData } from '../../types/weather';
import { formatTemp, formatLocalDate, formatLocalTime } from '../../utils/units';
import { SearchBar } from './SearchBar';
import { WeatherIcon } from '../ui/WeatherIcon';

interface HeroSectionProps {
  weather: WeatherData;
  tempUnit: TemperatureUnit;
  onToggleTempUnit: () => void;
  onSelectLocation: (location: LocationData) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  weather,
  tempUnit,
  onToggleTempUnit,
  onSelectLocation,
  isFavorite,
  onToggleFavorite,
  onRefresh,
  isRefreshing,
}) => {
  const [copied, setCopied] = useState(false);
  const { current, location, daily, sunTimes, lastUpdated } = weather;

  const todayForecast = daily[0];
  const highTemp = todayForecast ? todayForecast.maxTemp : current.temperature + 4;
  const lowTemp = todayForecast ? todayForecast.minTemp : current.temperature - 5;

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('city', location.name);
    url.searchParams.set('lat', location.latitude.toString());
    url.searchParams.set('lon', location.longitude.toString());
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-24 pb-12 overflow-hidden">
      {/* Search Bar at the top of Hero */}
      <div className="w-full max-w-xl mb-8">
        <SearchBar onSelectLocation={onSelectLocation} isLoading={isRefreshing} />
      </div>

      {/* Main Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-3xl mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 text-xs font-mono tracking-wider uppercase mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>WeatherVerse Engine • Live Atmosphere</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-3">
          Feel the Weather.{' '}
          <span className="gradient-text-cyan drop-shadow-[0_0_35px_rgba(0,242,254,0.3)]">
            See the Atmosphere.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto font-light">
          Your world, in motion — beautifully forecast with dynamic atmospheric physics and real-time telemetry.
        </p>
      </motion.div>

      {/* Hero Weather Stage Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl relative rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-6 sm:p-10 shadow-2xl shadow-cyan-950/30"
      >
        {/* Glow ambient accent */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-violet-500/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          {/* Left Column: Location, Condition, Time */}
          <div className="space-y-4">
            {/* Location & Country */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400">
                <MapPin className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {location.name}
                  </h2>
                  {/* Favorite Button */}
                  <button
                    onClick={onToggleFavorite}
                    className={`p-1.5 rounded-lg border transition-all ${
                      isFavorite
                        ? 'bg-amber-400/20 border-amber-400/40 text-amber-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    aria-label="Toggle favorite"
                  >
                    <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-300' : ''}`} />
                  </button>
                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="p-1.5 rounded-lg border bg-white/5 border-white/10 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/30 transition-all"
                    title="Copy shareable link"
                    aria-label="Share weather link"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-sm text-slate-400 font-medium">
                  {[location.admin1, location.country].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>

            {/* Weather Condition Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <WeatherIcon condition={current.condition} isDay={current.isDay} size={32} />
              <div>
                <div className="text-lg font-semibold text-white">
                  {current.conditionText}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Feels like {formatTemp(current.apparentTemperature, tempUnit)}</span>
                  <span>•</span>
                  <span>Humidity {current.humidity}%</span>
                </div>
              </div>
            </div>

            {/* Local Time and Date */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl border border-white/5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Local Time: {formatLocalTime(Date.now(), location.timezone)}</span>
              </div>
              <div className="bg-black/20 px-3 py-1.5 rounded-xl border border-white/5">
                <span>{formatLocalDate(Date.now(), location.timezone)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Giant Animated Temperature & Controls */}
          <div className="flex flex-col items-start md:items-end justify-center">
            {/* Unit Toggle and Refresh Row */}
            <div className="flex items-center gap-2 mb-2">
              {/* Unit Switcher */}
              <button
                onClick={onToggleTempUnit}
                className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-semibold text-cyan-300 hover:text-white transition-all"
                title="Switch Celsius / Fahrenheit"
              >
                Switch to {tempUnit === 'celsius' ? '°F' : '°C'}
              </button>

              {/* Refresh Button */}
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all disabled:opacity-50"
                title="Refresh live weather"
                aria-label="Refresh weather data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            </div>

            {/* Giant Temperature */}
            <div className="flex items-baseline cursor-pointer group" onClick={onToggleTempUnit}>
              <span className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] group-hover:scale-[1.02] transition-transform">
                {Math.round(current.temperature)}
              </span>
              <span className="text-4xl sm:text-5xl md:text-6xl font-light text-cyan-400 ml-1">
                {tempUnit === 'celsius' ? '°C' : '°F'}
              </span>
            </div>

            {/* Daily High & Low Indicators */}
            <div className="flex items-center gap-4 mt-2 text-sm font-medium text-slate-300">
              <div className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <ArrowUp className="w-3.5 h-3.5" />
                <span>High: {formatTemp(highTemp, tempUnit)}</span>
              </div>
              <div className="flex items-center gap-1 text-sky-400 bg-sky-950/40 px-2.5 py-1 rounded-lg border border-sky-500/20">
                <ArrowDown className="w-3.5 h-3.5" />
                <span>Low: {formatTemp(lowTemp, tempUnit)}</span>
              </div>
            </div>

            {/* Last Updated Timestamp */}
            <div className="text-[11px] text-slate-500 font-mono mt-3">
              Telemetry synchronized at {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
