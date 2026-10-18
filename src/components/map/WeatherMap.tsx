import React, { useEffect, useRef, useState } from 'react';
import { Layers, MapPin, Maximize2, Minimize2, Radio, ZoomIn, ZoomOut, Droplets } from 'lucide-react';
import { LocationData, WeatherData, TemperatureUnit } from '../../types/weather';
import { formatTemp } from '../../utils/units';

interface WeatherMapProps {
  location: LocationData;
  weather: WeatherData;
  tempUnit: TemperatureUnit;
}

export const WeatherMap: React.FC<WeatherMapProps> = ({
  location,
  weather,
  tempUnit,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const pulseCircleRef = useRef<any>(null);
  const radarLayerRef = useRef<any>(null);
  const baseLayerRef = useRef<any>(null);

  const [showRadar, setShowRadar] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [radarTime, setRadarTime] = useState<string>('Live');

  // Fetch free RainViewer live radar path (past frames are 100% free with NO API key)
  const fetchRadarUrl = async (): Promise<string | null> => {
    try {
      const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
      if (!res.ok) return null;
      const data = await res.json();
      const past = data?.radar?.past;
      if (past && past.length > 0) {
        const latest = past[past.length - 1];
        const host = data.host || 'https://tilecache.rainviewer.com';
        if (latest.time) {
          setRadarTime(new Date(latest.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
        return `${host}${latest.path}/256/{z}/{x}/{y}/2/1_1.png`;
      }
    } catch (err) {
      console.warn('Live radar tile fetch skipped:', err);
    }
    return null;
  };

  // Initialize or update Leaflet map
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      const L = await import('leaflet');

      if (!isMounted || !mapContainerRef.current) return;

      const osmUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

      if (!mapInstanceRef.current) {
        // Create Leaflet instance
        const map = L.map(mapContainerRef.current, {
          center: [location.latitude, location.longitude],
          zoom: 7,
          zoomControl: false,
          attributionControl: false,
        });

        // 100% Free OpenStreetMap Base Layer with Dark Sci-Fi Filter
        const baseLayer = L.tileLayer(osmUrl, {
          maxZoom: 19,
          className: isDarkMode ? 'dark-mode-tiles' : '',
        });
        baseLayer.addTo(map);
        baseLayerRef.current = baseLayer;

        // Dynamic RainViewer Live Radar Layer (Free past frame, maxNativeZoom: 7 prevents unsupported zoom errors)
        fetchRadarUrl().then((radarUrl) => {
          if (!isMounted || !radarUrl) return;
          try {
            const radarTileLayer = L.tileLayer(radarUrl, {
              opacity: 0.72,
              zIndex: 100,
              minZoom: 1,
              maxNativeZoom: 7,
              maxZoom: 19,
            });
            if (showRadar) {
              radarTileLayer.addTo(map);
            }
            radarLayerRef.current = radarTileLayer;
          } catch (e) {
            console.warn('Radar layer initialization error:', e);
          }
        });

        // Animated Radar Halo Circle around City
        const pulseCircle = L.circle([location.latitude, location.longitude], {
          radius: 20000,
          color: '#00F2FE',
          fillColor: '#00F2FE',
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: '4, 8',
        }).addTo(map);
        pulseCircleRef.current = pulseCircle;

        // Custom Glowing Pulsing Marker Icon
        const customIcon = L.divIcon({
          className: 'custom-weather-marker',
          html: `
            <div style="position: relative; width: 34px; height: 34px;">
              <div style="position: absolute; inset: 0; border-radius: 9999px; background: rgba(0, 242, 254, 0.4); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="position: absolute; inset: 5px; border-radius: 9999px; background: #00F2FE; border: 2.5px solid #ffffff; box-shadow: 0 0 16px #00F2FE;"></div>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker([location.latitude, location.longitude], { icon: customIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: system-ui; padding: 6px;">
            <div style="font-weight: 700; font-size: 14px; color: #fff;">${location.name}</div>
            <div style="font-size: 12px; color: #38bdf8; font-weight: 600;">
              ${formatTemp(weather.current.temperature, tempUnit)} • ${weather.current.conditionText}
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">
              Humidity ${weather.current.humidity}% • Wind ${weather.current.windSpeed} km/h
            </div>
          </div>
        `);

        mapInstanceRef.current = map;
        markerRef.current = marker;
      } else {
        // Fly to updated coordinates
        mapInstanceRef.current.flyTo([location.latitude, location.longitude], 7, {
          duration: 1.4,
        });

        if (markerRef.current) {
          markerRef.current.setLatLng([location.latitude, location.longitude]);
          markerRef.current.setPopupContent(`
            <div style="font-family: system-ui; padding: 6px;">
              <div style="font-weight: 700; font-size: 14px; color: #fff;">${location.name}</div>
              <div style="font-size: 12px; color: #38bdf8; font-weight: 600;">
                ${formatTemp(weather.current.temperature, tempUnit)} • ${weather.current.conditionText}
              </div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">
                Humidity ${weather.current.humidity}% • Wind ${weather.current.windSpeed} km/h
              </div>
            </div>
          `);
        }

        if (pulseCircleRef.current) {
          pulseCircleRef.current.setLatLng([location.latitude, location.longitude]);
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, [location.latitude, location.longitude, weather.current.temperature, tempUnit]);

  // Toggle Radar layer visibility
  const toggleRadar = () => {
    if (!mapInstanceRef.current || !radarLayerRef.current) return;
    if (showRadar) {
      mapInstanceRef.current.removeLayer(radarLayerRef.current);
      setShowRadar(false);
    } else {
      radarLayerRef.current.addTo(mapInstanceRef.current);
      setShowRadar(true);
    }
  };

  // Toggle Dark / Standard map style
  const toggleMapStyle = async () => {
    const L = await import('leaflet');
    if (!mapInstanceRef.current || !baseLayerRef.current) return;
    mapInstanceRef.current.removeLayer(baseLayerRef.current);

    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);

    const osmUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    const newBase = L.tileLayer(osmUrl, {
      maxZoom: 19,
      className: nextMode ? 'dark-mode-tiles' : '',
    });
    newBase.addTo(mapInstanceRef.current);
    baseLayerRef.current = newBase;

    // Keep radar on top if active
    if (showRadar && radarLayerRef.current) {
      mapInstanceRef.current.removeLayer(radarLayerRef.current);
      radarLayerRef.current.addTo(mapInstanceRef.current);
    }
  };

  const zoomIn = () => mapInstanceRef.current?.zoomIn();
  const zoomOut = () => mapInstanceRef.current?.zoomOut();

  return (
    <div className={`w-full relative rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 shadow-glass transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 p-4 max-w-none' : ''
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span>Interactive Doppler Weather Radar & Atmospheric Map</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Zero-Key Live Doppler Radar, precipitation echoes, and geospatial coordinates
          </p>
        </div>

        {/* Map Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Radar Toggle */}
          <button
            onClick={toggleRadar}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              showRadar
                ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${showRadar ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`} />
            Radar {showRadar ? `Live (${radarTime})` : 'Off'}
          </button>

          {/* Theme Style Toggle */}
          <button
            onClick={toggleMapStyle}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all"
            title="Toggle Dark Sci-Fi / Standard Tiles"
          >
            {isDarkMode ? '🌙 Dark Grid' : '☀️ Standard'}
          </button>

          {/* Zoom In */}
          <button
            onClick={zoomIn}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={zoomOut}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-inner h-[380px] sm:h-[440px]">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Legend Overlay on Map */}
        <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/85 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-[11px] font-mono text-slate-300 flex items-center gap-2 shadow-lg">
          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-cyan-400 font-bold">Rainfall Radar:</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[10px]">Light</span>
            <div className="w-20 h-2 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 via-amber-400 to-rose-500" />
            <span className="text-slate-400 text-[10px]">Heavy</span>
          </div>
        </div>

        {/* Coordinates badge overlay */}
        <div className="absolute top-3 right-3 z-[400] bg-slate-900/80 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-xl text-[10px] font-mono text-slate-400">
          {location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E
        </div>
      </div>
    </div>
  );
};
