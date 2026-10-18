import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Loader2, X, History, Compass, ArrowRight } from 'lucide-react';
import { LocationData } from '../../types/weather';
import { searchCities, reverseGeocode } from '../../services/weatherApi';
import { storageService } from '../../services/storage';

interface SearchBarProps {
  onSelectLocation: (location: LocationData) => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectLocation,
  isLoading = false,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search history
  useEffect(() => {
    setHistory(storageService.getSearchHistory());
  }, []);

  // Debounced search query
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    // Check if query is latitude, longitude
    const coordMatch = trimmed.match(/^([-+]?\d{1,2}(?:\.\d+)?),\s*([-+]?\d{1,3}(?:\.\d+)?)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lon = parseFloat(coordMatch[2]);
      if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        setSuggestions([{
          name: `Coordinates (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
          country: 'Custom Coordinates',
          latitude: lat,
          longitude: lon,
          timezone: 'auto',
        }]);
        setIsOpen(true);
        return;
      }
    }

    setIsSearching(true);
    setErrorMessage(null);
    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(trimmed);
        setSuggestions(results);
        setIsOpen(true);
        setSelectedIndex(-1);
        if (results.length === 0) {
          setErrorMessage(`No matching cities found for "${trimmed}"`);
        }
      } catch (err) {
        setErrorMessage('Failed to search locations. Please try again.');
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle location selection
  const handleSelect = (loc: LocationData) => {
    storageService.addSearchHistory(loc.name);
    setHistory(storageService.getSearchHistory());
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setErrorMessage(null);
    onSelectLocation(loc);
  };

  // Geolocation trigger
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const loc = await reverseGeocode(lat, lon);
          handleSelect(loc);
        } catch (err) {
          console.error(err);
          setErrorMessage('Could not determine city name from GPS coordinates.');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMessage('Location permission denied. You can search your city above.');
        } else {
          setErrorMessage('Unable to retrieve location. Please search manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex]);
      } else if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto z-50">
      {/* Search Input Box */}
      <div className="relative flex items-center rounded-2xl bg-slate-900/70 backdrop-blur-2xl border border-white/10 hover:border-cyan-500/40 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 shadow-glass transition-all duration-300">
        <div className="pl-4 text-cyan-400 flex items-center justify-center">
          {isSearching || isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search city, state or 'lat, lon'..."
          className="w-full py-4 pl-3 pr-24 bg-transparent text-white placeholder-slate-400 font-sans text-base focus:outline-none"
          aria-label="Search city or location"
          autoComplete="off"
        />

        {/* Clear query button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              inputRef.current?.focus();
            }}
            className="p-1 mr-1 text-slate-400 hover:text-white transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Current Location GPS Button */}
        <button
          type="button"
          onClick={handleGeolocation}
          disabled={isLocating}
          className="mr-2 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/30 text-cyan-300 hover:text-cyan-100 text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 active:scale-95 disabled:opacity-50"
          title="Use current GPS location"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Compass className="w-3.5 h-3.5 animate-pulse" />
          )}
          <span className="hidden sm:inline">GPS</span>
        </button>
      </div>

      {/* Error message notification */}
      {errorMessage && (
        <div className="mt-2 text-xs text-rose-300 bg-rose-950/60 border border-rose-500/30 px-3 py-1.5 rounded-lg backdrop-blur-md flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-rose-200">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Autocomplete Suggestions / History Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/5 max-h-80 overflow-y-auto">
          {/* Autocomplete Results */}
          {suggestions.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-1 text-[11px] font-mono tracking-wider uppercase text-cyan-400/80">
                Matching Cities
              </div>
              {suggestions.map((loc, index) => (
                <button
                  key={`${loc.name}-${loc.latitude}-${index}`}
                  onClick={() => handleSelect(loc)}
                  className={`w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors ${
                    selectedIndex === index
                      ? 'bg-cyan-500/20 text-cyan-200'
                      : 'hover:bg-white/5 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-white">{loc.name}</span>
                      <span className="text-xs text-slate-400 ml-1.5">
                        {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 opacity-60" />
                </button>
              ))}
            </div>
          ) : query.length >= 2 && !isSearching ? (
            <div className="p-4 text-center text-sm text-slate-400">
              No matching locations found for "{query}".
            </div>
          ) : null}

          {/* Recent Searches (when query is short or empty) */}
          {query.length < 2 && history.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1 text-[11px] font-mono tracking-wider uppercase text-slate-400 flex items-center justify-between">
                <span>Recent Searches</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    storageService.clearSearchHistory();
                    setHistory([]);
                  }}
                  className="text-[10px] text-slate-400 hover:text-cyan-300"
                >
                  Clear
                </button>
              </div>
              {history.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(item);
                  }}
                  className="w-full text-left px-4 py-2 flex items-center gap-2.5 text-slate-300 hover:bg-white/5 transition-colors text-sm"
                >
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
