import React from 'react';
import { X, Sparkles, Cpu, Layers, ShieldCheck, Globe, Zap, Compass } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 shadow-2xl z-10 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/25 text-cyan-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">WeatherVerse</h3>
              <p className="text-xs text-slate-400 font-mono">Next-Generation Atmospheric Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-6 space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            <strong className="text-white">WeatherVerse</strong> is an immersive meteorological platform built to transform standard forecast tables into living, breathing spatial simulations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-1">
                <Cpu className="w-4 h-4" />
                <span>Atmospheric Engine</span>
              </div>
              <p className="text-xs text-slate-400">
                Procedural solar coronas, lightning strikes, volumetric clouds, snowflake wind physics, and cosmic starfields rendered in real-time WebGL.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-2 text-purple-400 font-semibold mb-1">
                <Globe className="w-4 h-4" />
                <span>Real-Time Telemetry</span>
              </div>
              <p className="text-xs text-slate-400">
                Global meteorological models powered by Open-Meteo High-Resolution Ensemble API, delivering sub-minute accuracy with zero subscription barriers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
                <Zap className="w-4 h-4" />
                <span>Interactive Cursor</span>
              </div>
              <p className="text-xs text-slate-400">
                Spring-based luminous orb and starlight sparkle trail with micro-confetti click dynamics, fully tuned for desktop performance and accessible reduced-motion standards.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                <Compass className="w-4 h-4" />
                <span>Doppler Radar Map</span>
              </div>
              <p className="text-xs text-slate-400">
                Interactive geospatial radar layers with CartoDB Dark Matter tiles, RainViewer reflectivity overlays, and coordinate telemetry.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-300">
            <strong>Accessibility & Privacy First:</strong> Geolocation is requested strictly with user permission, search history is retained locally in your browser storage, and WebGL smoothly falls back to CSS atmospheric backdrops if hardware acceleration is unavailable.
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
