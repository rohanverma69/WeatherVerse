import React from 'react';
import { AlertTriangle, RefreshCw, MapPin } from 'lucide-react';
import { POPULAR_CITIES } from '../../services/weatherApi';
import { LocationData } from '../../types/weather';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  onSelectCity: (city: LocationData) => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  onSelectCity,
}) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center z-10 relative">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-rose-500/20 p-8 shadow-2xl shadow-rose-950/30">
        {/* Error Icon */}
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-400/30 text-rose-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">Telemetry Interrupted</h3>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          {message || 'Unable to establish atmospheric telemetry for the requested coordinates.'}
        </p>

        {/* Retry Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={onRetry}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>

        {/* Suggested Cities */}
        <div className="pt-4 border-t border-white/5">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5">
            Or choose a major verified metropolis:
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_CITIES.slice(0, 4).map((city) => (
              <button
                key={city.id}
                onClick={() => onSelectCity(city)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/40 text-xs text-slate-300 hover:text-cyan-200 transition-all flex items-center gap-1.5"
              >
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>{city.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
