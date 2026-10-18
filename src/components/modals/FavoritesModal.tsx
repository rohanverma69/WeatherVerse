import React from 'react';
import { X, Star, Trash2, ArrowRight, Plus, MapPin } from 'lucide-react';
import { SavedLocation, LocationData, TemperatureUnit } from '../../types/weather';
import { POPULAR_CITIES } from '../../services/weatherApi';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: SavedLocation[];
  onSelectLocation: (location: LocationData) => void;
  onRemoveFavorite: (fav: SavedLocation) => void;
  onAddPopular: (city: LocationData) => void;
  tempUnit: TemperatureUnit;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectLocation,
  onRemoveFavorite,
  onAddPopular,
  tempUnit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-6 shadow-2xl z-10 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Favorite Locations</h3>
              <p className="text-xs text-slate-400">Quick-access saved meteorological telemetry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto py-4 space-y-2 flex-1 scrollbar-thin">
          {favorites.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No saved cities yet. Click the star icon next to any city to bookmark it!
            </div>
          ) : (
            favorites.map((fav) => (
              <div
                key={fav.id}
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-cyan-400/30 transition-all duration-200"
              >
                <button
                  onClick={() => {
                    onSelectLocation({
                      name: fav.name,
                      country: fav.country,
                      admin1: fav.admin1,
                      latitude: fav.latitude,
                      longitude: fav.longitude,
                      timezone: fav.timezone,
                    });
                    onClose();
                  }}
                  className="flex items-center gap-3 text-left flex-1"
                >
                  <MapPin className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {fav.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {[fav.admin1, fav.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRemoveFavorite(fav)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Popular Global Destinations Showcase */}
          <div className="pt-4 border-t border-white/5">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Popular Global Metropolises
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    onSelectLocation(city);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/30 text-xs text-slate-300 hover:text-cyan-200 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>{city.name}</span>
                  <span className="text-[10px] text-slate-500">{city.country}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
