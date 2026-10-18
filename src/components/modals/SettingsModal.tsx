import React, { useState } from 'react';
import { X, Settings, Sparkles, Sliders, Shield, RotateCcw, Check } from 'lucide-react';
import { UserPreferences, TemperatureUnit, WindSpeedUnit } from '../../types/weather';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(preferences.customApiKey || '');
  const [savedKeyMsg, setSavedKeyMsg] = useState(false);

  if (!isOpen) return null;

  const handleSaveApiKey = () => {
    onUpdatePreferences({ customApiKey: apiKeyInput.trim() });
    setSavedKeyMsg(true);
    setTimeout(() => setSavedKeyMsg(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">System Preferences</h3>
              <p className="text-xs text-slate-400">Configure atmosphere rendering, units, and API telemetry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="py-5 space-y-6">
          {/* Temperature Unit */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
              Temperature Unit
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdatePreferences({ tempUnit: 'celsius' })}
                className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  preferences.tempUnit === 'celsius'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                Celsius (°C)
              </button>
              <button
                onClick={() => onUpdatePreferences({ tempUnit: 'fahrenheit' })}
                className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  preferences.tempUnit === 'fahrenheit'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          {/* Wind Speed Unit */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
              Wind Velocity Unit
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['kmh', 'mph', 'ms'] as WindSpeedUnit[]).map((unit) => (
                <button
                  key={unit}
                  onClick={() => onUpdatePreferences({ windUnit: unit })}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold uppercase transition-all ${
                    preferences.windUnit === unit
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {unit === 'kmh' ? 'km/h' : unit === 'mph' ? 'mph' : 'm/s'}
                </button>
              ))}
            </div>
          </div>

          {/* Graphics Quality */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
              Atmosphere Rendering Quality
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['high', 'medium', 'low'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => onUpdatePreferences({ graphicsQuality: q })}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                    preferences.graphicsQuality === q
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {q === 'high' ? 'Ultra (HQ)' : q === 'medium' ? 'Balanced' : 'Eco Mode'}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Adjust particle count and antialiasing to optimize battery and GPU performance.
            </p>
          </div>

          {/* Sparkle Cursor Effect Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-sm font-semibold text-white">Sparkle Cursor Trail</div>
                <div className="text-xs text-slate-400">Interactive glowing particles and cursor physics</div>
              </div>
            </div>
            <button
              onClick={() => onUpdatePreferences({ enableCursorTrail: !preferences.enableCursorTrail })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                preferences.enableCursorTrail ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  preferences.enableCursorTrail ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Weather API Key Option (Optional) */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <div className="text-sm font-semibold text-white">API Telemetry Provider</div>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Currently powered by <strong className="text-cyan-300">Open-Meteo High Resolution Model</strong> (100% free, real-time, no API key required). Optionally specify a custom key if desired:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Optional OpenWeatherMap API Key..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="flex-1 bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-semibold flex items-center gap-1"
              >
                {savedKeyMsg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => {
              onUpdatePreferences({
                tempUnit: 'celsius',
                windUnit: 'kmh',
                enableCursorTrail: true,
                graphicsQuality: 'high',
              });
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
