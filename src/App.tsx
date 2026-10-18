import React, { useState, useEffect, useCallback } from 'react';
import { LocationData, WeatherData, SavedLocation, UserPreferences } from './types/weather';
import { fetchWeatherData, POPULAR_CITIES } from './services/weatherApi';
import { storageService, DEFAULT_PREFERENCES } from './services/storage';
import { CursorTrail } from './components/cursor/CursorTrail';
import { WeatherCanvas } from './components/canvas/WeatherCanvas';
import { Navbar } from './components/navigation/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { HourlyForecast } from './components/dashboard/HourlyForecast';
import { TemperatureChart } from './components/dashboard/TemperatureChart';
import { DailyForecast } from './components/dashboard/DailyForecast';
import { WeatherMetrics } from './components/dashboard/WeatherMetrics';
import { WeatherMap } from './components/map/WeatherMap';
import { FavoritesModal } from './components/modals/FavoritesModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { AboutModal } from './components/modals/AboutModal';
import { SkeletonLoader } from './components/ui/SkeletonLoader';
import { ErrorState } from './components/ui/ErrorState';
import { Footer } from './components/footer/Footer';

export const App: React.FC = () => {
  // Preferences & Saved State
  const [preferences, setPreferences] = useState<UserPreferences>(() => storageService.getPreferences());
  const [favorites, setFavorites] = useState<SavedLocation[]>(() => storageService.getFavorites());

  // Location & Weather Data
  const [currentLocation, setCurrentLocation] = useState<LocationData>(() => {
    // Check URL parameters first for shareable links
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const lat = params.get('lat');
      const lon = params.get('lon');
      const city = params.get('city');
      if (lat && lon && city) {
        return {
          name: city,
          country: '',
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          timezone: 'auto',
        };
      }
    }
    // Check local storage last location or default to Tokyo
    const last = storageService.getLastLocation();
    if (last) {
      return {
        name: last.name,
        country: last.country,
        admin1: last.admin1,
        latitude: last.latitude,
        longitude: last.longitude,
        timezone: last.timezone,
      };
    }
    return POPULAR_CITIES[0]; // Tokyo default
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Fetch Weather Data Function
  const loadWeather = useCallback(async (location: LocationData, isRefreshAction = false) => {
    if (isRefreshAction) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await fetchWeatherData(location, preferences.customApiKey);
      setWeatherData(data);
      storageService.saveLastLocation({
        id: `${location.latitude}-${location.longitude}`,
        name: location.name,
        country: location.country,
        admin1: location.admin1,
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: data.location.timezone,
      });
    } catch (err: any) {
      console.error('Failed to load weather:', err);
      setError(err?.message || 'Failed to fetch meteorological data. Please check your network or try another city.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [preferences.customApiKey]);

  // Load weather when location changes
  useEffect(() => {
    loadWeather(currentLocation);
  }, [currentLocation, loadWeather]);

  // Toggle favorite
  const handleToggleFavorite = () => {
    if (!weatherData) return;
    const loc: SavedLocation = {
      id: `${currentLocation.latitude}-${currentLocation.longitude}`,
      name: currentLocation.name,
      country: currentLocation.country,
      admin1: currentLocation.admin1,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      timezone: weatherData.location.timezone,
      currentTemp: weatherData.current.temperature,
      condition: weatherData.current.condition,
    };
    const { favorites: updated } = storageService.toggleFavorite(loc);
    setFavorites(updated);
  };

  const isCurrentFavorite = storageService.isFavorite(currentLocation.latitude, currentLocation.longitude);

  // Update preferences
  const handleUpdatePreferences = (prefs: Partial<UserPreferences>) => {
    const updated = storageService.savePreferences(prefs);
    setPreferences(updated);
  };

  // Section navigation
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 bg-[#030712] selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Interactive Cursor with Sparkle Trail */}
      <CursorTrail enabled={preferences.enableCursorTrail} />

      {/* 3D Atmospheric Canvas Background */}
      {weatherData && (
        <WeatherCanvas
          condition={weatherData.current.condition}
          isDay={weatherData.current.isDay}
          quality={preferences.graphicsQuality}
        />
      )}

      {/* Navigation Header */}
      <Navbar
        cityName={currentLocation.name}
        country={currentLocation.country}
        tempUnit={preferences.tempUnit}
        onToggleTempUnit={() =>
          handleUpdatePreferences({
            tempUnit: preferences.tempUnit === 'celsius' ? 'fahrenheit' : 'celsius',
          })
        }
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Content Area */}
      <main className="relative z-10">
        {isLoading && !weatherData ? (
          <SkeletonLoader />
        ) : error && !weatherData ? (
          <ErrorState
            message={error}
            onRetry={() => loadWeather(currentLocation)}
            onSelectCity={(city) => setCurrentLocation(city)}
          />
        ) : weatherData ? (
          <>
            {/* Hero Section */}
            <HeroSection
              weather={weatherData}
              tempUnit={preferences.tempUnit}
              onToggleTempUnit={() =>
                handleUpdatePreferences({
                  tempUnit: preferences.tempUnit === 'celsius' ? 'fahrenheit' : 'celsius',
                })
              }
              onSelectLocation={(loc) => setCurrentLocation(loc)}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleFavorite}
              onRefresh={() => loadWeather(currentLocation, true)}
              isRefreshing={isRefreshing}
            />

            {/* Dashboard Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
              {/* 1. 24-Hour Hourly Forecast Carousel */}
              <section id="forecast" className="scroll-mt-24">
                <HourlyForecast
                  hourly={weatherData.hourly}
                  timezone={weatherData.location.timezone}
                  tempUnit={preferences.tempUnit}
                  windUnit={preferences.windUnit}
                />
              </section>

              {/* 2. Temperature Curve Trend & Rain Chart */}
              <section>
                <TemperatureChart
                  hourly={weatherData.hourly}
                  timezone={weatherData.location.timezone}
                  tempUnit={preferences.tempUnit}
                />
              </section>

              {/* 3. Atmospheric Telemetry Metrics (3D Glass Cards) */}
              <section id="telemetry" className="scroll-mt-24">
                <WeatherMetrics
                  current={weatherData.current}
                  sunTimes={weatherData.sunTimes}
                  airQuality={weatherData.airQuality}
                  tempUnit={preferences.tempUnit}
                  windUnit={preferences.windUnit}
                />
              </section>

              {/* 4. 7-Day Extended Forecast Outlook */}
              <section>
                <DailyForecast
                  daily={weatherData.daily}
                  tempUnit={preferences.tempUnit}
                />
              </section>

              {/* 5. Doppler Weather Radar & Map */}
              <section id="radar" className="scroll-mt-24">
                <WeatherMap
                  location={currentLocation}
                  weather={weatherData}
                  tempUnit={preferences.tempUnit}
                />
              </section>
            </div>
          </>
        ) : null}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectLocation={(loc) => setCurrentLocation(loc)}
        onRemoveFavorite={(fav) => {
          const updated = favorites.filter((f) => f.id !== fav.id);
          storageService.saveFavorites(updated);
          setFavorites(updated);
        }}
        onAddPopular={(city) => {
          setCurrentLocation(city);
          setIsFavoritesOpen(false);
        }}
        tempUnit={preferences.tempUnit}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
};

export default App;
