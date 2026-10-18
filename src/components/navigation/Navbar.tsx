import React from 'react';
import { 
  CloudSun, 
  Star, 
  Settings, 
  MapPin, 
  Radio, 
  TrendingUp, 
  Info,
  Sparkles
} from 'lucide-react';
import { TemperatureUnit } from '../../types/weather';

interface NavbarProps {
  cityName: string;
  country: string;
  tempUnit: TemperatureUnit;
  onToggleTempUnit: () => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cityName,
  country,
  tempUnit,
  onToggleTempUnit,
  favoritesCount,
  onOpenFavorites,
  onOpenSettings,
  onOpenAbout,
  onNavigateSection,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/60 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#030712] rounded-[14px] flex items-center justify-center">
              <CloudSun className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            </div>
            {/* Pulsing micro-star */}
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f2fe] animate-ping" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-lg tracking-tight text-white">
                WeatherVerse
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 tracking-wider">
              ATMOSPHERIC INTELLIGENCE
            </div>
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-2xl p-1 backdrop-blur-md">
          <button
            onClick={() => onNavigateSection('forecast')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            Forecast
          </button>
          <button
            onClick={() => onNavigateSection('radar')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5 text-indigo-400" />
            Radar Map
          </button>
          <button
            onClick={() => onNavigateSection('telemetry')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Telemetry
          </button>
          <button
            onClick={onOpenAbout}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
          >
            <Info className="w-3.5 h-3.5 text-slate-400" />
            About
          </button>
        </nav>

        {/* Action Controls Right */}
        <div className="flex items-center gap-2">
          {/* Active City indicator chip */}
          <div className="hidden sm:flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-white">{cityName}</span>
          </div>

          {/* Unit Toggle Button */}
          <button
            onClick={onToggleTempUnit}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-cyan-300 hover:text-white transition-all"
            title="Toggle °C / °F"
          >
            {tempUnit === 'celsius' ? '°C' : '°F'}
          </button>

          {/* Favorites Button with Badge */}
          <button
            onClick={onOpenFavorites}
            className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-amber-300 transition-all"
            title="Favorite Cities"
            aria-label="Saved Cities"
          >
            <Star className="w-4 h-4" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-bold text-[9px] flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-cyan-300 transition-all"
            title="Settings & Preferences"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
