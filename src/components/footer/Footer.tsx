import React from 'react';
import { CloudSun } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-20 border-t border-white/[0.08] bg-slate-950/80 backdrop-blur-2xl py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
              <CloudSun className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="font-display font-bold text-white text-base">WeatherVerse</div>
            <div className="text-[11px] font-mono text-slate-400">Atmospheric Simulation & Forecasting Platform</div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span>Atmospheric Telemetry Online</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono">
        <div>
          © {new Date().getFullYear()} WeatherVerse. Crafted with precision for high-fidelity weather visualization.
        </div>
        <div className="mt-2 sm:mt-0 flex items-center gap-4">
          <span>Privacy Focused</span>
          <span>•</span>
          <span>Zero-Key Instant Experience</span>
        </div>
      </div>
    </footer>
  );
};
