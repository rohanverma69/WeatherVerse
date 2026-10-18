import { SavedLocation, UserPreferences } from '../types/weather';

const STORAGE_KEYS = {
  FAVORITES: 'weatherverse_favorites_v1',
  HISTORY: 'weatherverse_history_v1',
  PREFERENCES: 'weatherverse_prefs_v1',
  LAST_LOCATION: 'weatherverse_last_loc_v1',
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  tempUnit: 'celsius',
  windUnit: 'kmh',
  enableCursorTrail: true,
  graphicsQuality: 'high',
  apiProvider: 'open-meteo',
};

export const storageService = {
  // Favorites
  getFavorites(): SavedLocation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load favorites:', e);
    }
    // Default initial favorites
    return [
      {
        id: 'tokyo-default',
        name: 'Tokyo',
        country: 'Japan',
        admin1: 'Tokyo',
        latitude: 35.6762,
        longitude: 139.6503,
        timezone: 'Asia/Tokyo',
      },
      {
        id: 'paris-default',
        name: 'Paris',
        country: 'France',
        admin1: 'Île-de-France',
        latitude: 48.8566,
        longitude: 2.3522,
        timezone: 'Europe/Paris',
      },
      {
        id: 'newyork-default',
        name: 'New York',
        country: 'United States',
        admin1: 'New York',
        latitude: 40.7128,
        longitude: -74.006,
        timezone: 'America/New_York',
      }
    ];
  },

  saveFavorites(favorites: SavedLocation[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites:', e);
    }
  },

  toggleFavorite(location: SavedLocation): { isFav: boolean; favorites: SavedLocation[] } {
    const list = this.getFavorites();
    const existingIndex = list.findIndex(
      f => Math.abs(f.latitude - location.latitude) < 0.05 && Math.abs(f.longitude - location.longitude) < 0.05
    );

    let updated: SavedLocation[];
    let isFav: boolean;

    if (existingIndex >= 0) {
      updated = list.filter((_, idx) => idx !== existingIndex);
      isFav = false;
    } else {
      updated = [location, ...list.slice(0, 15)];
      isFav = true;
    }

    this.saveFavorites(updated);
    return { isFav, favorites: updated };
  },

  isFavorite(lat: number, lon: number): boolean {
    const list = this.getFavorites();
    return list.some(
      f => Math.abs(f.latitude - lat) < 0.05 && Math.abs(f.longitude - lon) < 0.05
    );
  },

  // Recent Searches
  getSearchHistory(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load search history:', e);
    }
    return ['Tokyo', 'London', 'Dubai', 'San Francisco'];
  },

  addSearchHistory(term: string): string[] {
    if (!term || term.trim().length === 0) return this.getSearchHistory();
    const cleanTerm = term.trim();
    const existing = this.getSearchHistory().filter(t => t.toLowerCase() !== cleanTerm.toLowerCase());
    const updated = [cleanTerm, ...existing].slice(0, 8);
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save search history:', e);
    }
    return updated;
  },

  clearSearchHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (e) {
      console.warn('Failed to clear search history:', e);
    }
  },

  // User Preferences
  getPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (data) return { ...DEFAULT_PREFERENCES, ...JSON.parse(data) };
    } catch (e) {
      console.warn('Failed to load preferences:', e);
    }
    return DEFAULT_PREFERENCES;
  },

  savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save preferences:', e);
    }
    return updated;
  },

  // Last active location
  getLastLocation(): SavedLocation | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LAST_LOCATION);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to load last location:', e);
    }
    return null;
  },

  saveLastLocation(loc: SavedLocation): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_LOCATION, JSON.stringify(loc));
    } catch (e) {
      console.warn('Failed to save last location:', e);
    }
  }
};
