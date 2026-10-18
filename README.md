# WeatherVerse 3D 🪐🌦️
### *Feel the Weather. See the Atmosphere.*

WeatherVerse 3D is a luxury, futuristic 3D meteorological web application combining real-time planetary atmospheric data with cinematic WebGL rendering, responsive physics, and an interactive particle cursor.

---

## 🌟 Key Features

### 1. 🪐 Real-Time 3D Weather Atmospheres
Powered by **Three.js** and **React Three Fiber**, WeatherVerse dynamically transitions between realistic 3D scenes synchronized with live meteorological conditions:
- **Sunny & Clear**: Glowing 3D solar sphere, animated coronal light rays, floating golden stardust particles, and lens flare.
- **Starfield & Night**: 1,800+ cosmic stars with twinkling depths, glowing moon with crater shading, lunar halo, and animated shooting stars.
- **Volumetric Clouds & Overcast**: Multi-layered drifting cloud masses with realistic scattering and ambient sunlight absorption.
- **Rain & Heavy Downpours**: 1,800+ rain streaks with directional wind slant, ground splash reflections, and distant lightning flashes.
- **Electric Thunderstorms**: Strobe lightning strikes, illuminated cloud silhouettes, jagged electric bolts, and torrential storm physics.
- **Snowfall & Blizzard**: 1,400+ tumbling snowflakes drifting on sinusoidal wind vortices with crystalline ice ground shimmer.
- **Atmospheric Fog**: Layered animated horizontal fog planes undulating across the viewport with exponential depth fog.
- **Hardware Fallback**: Graceful automated CSS/Canvas fallback if WebGL is disabled or unsupported.

### 2. ✨ Interactive Mouse Cursor & Sparkle Trail
- Fluid spring-interpolated luminous orb following the pointer with zero input lag.
- Procedural starlight sparkle particles (cyan, violet, gold, starlight white) with randomized rotation, velocity, and decay.
- Interactive click burst: Spawns a festive micro-burst of starlight diamonds upon clicking.
- Interactive hover responsiveness: Expands when hovering buttons, cards, or search suggestions.
- **Accessibility & Mobile First**: Automatically disabled on touch screens and honors `prefers-reduced-motion: reduce`. Completely non-blocking (`pointer-events: none`).

### 3. 🔍 Live Meteorological Search & Autocomplete
- Global city search powered by Open-Meteo Geocoding with instant suggestions.
- Direct GPS / Browser Geolocation with permission safety.
- Coordinate queries (e.g., `35.68, 139.75` for Tokyo).
- Local search history stored directly in your browser.
- Instant fallback suggestions for verified world metropolises.

### 4. 📊 High-Precision Forecast Dashboard
- **24-Hour Hourly Carousel**: Horizontally scrollable timeline with temperature, weather icon, precipitation risk (%), and wind velocity.
- **Bézier Spline Temperature Chart**: Interactive SVG curve visualization with gradient fill, precipitation probability bars, and crosshair hover tooltips.
- **7-Day Atmospheric Outlook**: Extended forecast with dynamic temperature range bars showing daily minimum and maximum relative to the week's extremes.
- **Interactive 3D Glass Cards (TiltCards)**:
  - **Wind Telemetry**: Animated 360° rotating compass dial, current speed, and peak gusts.
  - **Relative Humidity**: Dynamic gradient water gauge, dew point, and comfort index.
  - **UV Radiation Index**: 10-step segmented risk meter with skin protection guidance.
  - **Air Quality Telemetry (AQI)**: PM2.5, PM10, Ozone, and NO₂ pollutant metrics.
  - **Barometric Pressure**: Atmospheric surface pressure in hPa with stability indicators.
  - **Optical Visibility**: Distance clarity in kilometers.
  - **Celestial Solar Arc**: Sunrise & sunset timeline with total daylight countdown.

### 5. 🛰️ Doppler Radar & Weather Map
- Real-time Leaflet map styled in CartoDB Dark Matter.
- RainViewer radar reflectivity layer showing active precipitation echoes.
- Pulsing animated radar marker centered over the searched city.
- Fullscreen and zoom controls.

### 6. ⭐ Bookmarks & Customization
- Save favorite cities with persistent local storage.
- Toggle between Celsius (°C) and Fahrenheit (°F).
- Toggle wind units: `km/h`, `mph`, `m/s`.
- 3D Atmosphere Quality selector (Ultra HQ, Balanced, Eco Mode).
- Shareable URLs: Generates deep links like `?city=Paris&lat=48.85&lon=2.35`.

---

## 🛠️ Tech Stack

- **Framework**: React 18, TypeScript, Vite
- **3D Graphics & WebGL**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Tailwind CSS, Custom Glassmorphism, CSS Variables
- **Map & Radar**: Leaflet, CartoDB Dark Matter, RainViewer Radar API
- **Data Providers**: Open-Meteo Weather & Air Quality API (100% free, no key required), OpenStreetMap Nominatim

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node v24)
- npm `v9+` or `v11+`

### Installation

1. Clone or open the repository directory:
```bash
cd weatherForcasting
```

2. Install dependencies:
```bash
npm install
```

3. Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 API Security & Environment Variables

WeatherVerse 3D connects out-of-the-box to Open-Meteo's high-resolution global weather models without requiring an API key.

If you wish to configure an optional custom OpenWeatherMap API key:
1. Copy the example environment file:
```bash
cp .env.example .env
```
2. Add your key:
```env
VITE_OPENWEATHER_API_KEY=your_key_here
```
> **Security Note**: Never commit your `.env` file to version control. Keys can also be entered client-side via the Settings modal.

---

## 📦 Building for Production

Compile TypeScript and bundle optimized chunks for production:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 🌐 Deploying to Vercel

1. Push your project to a GitHub repository.
2. In [Vercel](https://vercel.com), click **Add New Project** and select your repository.
3. Keep default settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Click **Deploy**. Your 3D weather station is live worldwide!

---

## ♿ Accessibility & Performance Optimizations
- **Reduced Motion**: Respects `prefers-reduced-motion` by reducing particle count and disabling pointer sparkle physics.
- **Hardware Acceleration**: Dynamically scales DPR (`devicePixelRatio`) and particle density according to selected quality mode.
- **Non-blocking Input**: Cursor sparkles run on a dedicated canvas with `pointer-events: none`, preserving full text selection and click responsiveness.
