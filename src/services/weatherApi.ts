import { 
  WeatherData, 
  LocationData, 
  WeatherConditionType, 
  CurrentWeather, 
  HourlyForecastItem, 
  DailyForecastItem, 
  AirQualityData, 
  SunTimes 
} from '../types/weather';

/**
 * Maps WMO Weather Interpretation Codes to WeatherVerse condition types and descriptions
 * Reference: https://open-meteo.com/en/docs
 */
export function mapWmoCodeToCondition(code: number, isDay: boolean = true): {
  type: WeatherConditionType;
  text: string;
} {
  switch (code) {
    case 0:
      return {
        type: isDay ? 'sunny' : 'clear_night',
        text: isDay ? 'Clear Sky' : 'Clear Night Sky'
      };
    case 1:
      return {
        type: isDay ? 'sunny' : 'clear_night',
        text: isDay ? 'Mainly Sunny' : 'Mainly Clear'
      };
    case 2:
      return {
        type: 'partly_cloudy',
        text: isDay ? 'Partly Cloudy' : 'Scattered Clouds'
      };
    case 3:
      return {
        type: 'cloudy',
        text: 'Overcast & Gloomy'
      };
    case 45:
    case 48:
      return {
        type: 'foggy',
        text: code === 45 ? 'Atmospheric Fog' : 'Freezing Rime Fog'
      };
    case 51:
    case 53:
    case 55:
      return {
        type: 'rainy',
        text: 'Light Drizzle & Mist'
      };
    case 56:
    case 57:
      return {
        type: 'rainy',
        text: 'Freezing Drizzle'
      };
    case 61:
    case 63:
      return {
        type: 'rainy',
        text: 'Gentle Rain Showers'
      };
    case 65:
      return {
        type: 'heavy_rain',
        text: 'Heavy Torrential Rain'
      };
    case 66:
    case 67:
      return {
        type: 'rainy',
        text: 'Freezing Rain'
      };
    case 71:
    case 73:
      return {
        type: 'snowy',
        text: 'Gentle Snowfall'
      };
    case 75:
    case 77:
      return {
        type: 'snowy',
        text: 'Heavy Blizzard & Snow'
      };
    case 80:
    case 81:
      return {
        type: 'rainy',
        text: 'Passing Rain Showers'
      };
    case 82:
      return {
        type: 'heavy_rain',
        text: 'Violent Cloudburst Rain'
      };
    case 85:
    case 86:
      return {
        type: 'snowy',
        text: 'Snow Showers'
      };
    case 95:
      return {
        type: 'thunderstorm',
        text: 'Thunderstorm & Lightning'
      };
    case 96:
    case 99:
      return {
        type: 'thunderstorm',
        text: 'Severe Thunderstorm & Hail'
      };
    default:
      return {
        type: isDay ? 'sunny' : 'clear_night',
        text: 'Fair Weather'
      };
  }
}

/**
 * Maps Air Quality Index numbers to categories and recommendations
 */
export function getAqiCategory(aqi: number): {
  category: AirQualityData['aqiCategory'];
  color: string;
  advice: string;
} {
  if (aqi <= 50) {
    return {
      category: 'Good',
      color: '#10b981', // green
      advice: 'Air quality is pristine. Perfect for outdoor workouts and stargazing.'
    };
  } else if (aqi <= 100) {
    return {
      category: 'Fair',
      color: '#06b6d4', // cyan
      advice: 'Air quality is acceptable for most people; sensitive individuals should take note.'
    };
  } else if (aqi <= 150) {
    return {
      category: 'Moderate',
      color: '#f59e0b', // amber
      advice: 'Unhealthy for sensitive groups. Reduce prolonged outdoor exertion.'
    };
  } else if (aqi <= 200) {
    return {
      category: 'Poor',
      color: '#f97316', // orange
      advice: 'Unhealthy air. Active children and adults should avoid outdoor activities.'
    };
  } else if (aqi <= 300) {
    return {
      category: 'Very Poor',
      color: '#ef4444', // red
      advice: 'Health alert: Everyone may experience more serious health effects.'
    };
  } else {
    return {
      category: 'Hazardous',
      color: '#8b5cf6', // purple
      advice: 'Emergency conditions: Health warnings of emergency conditions for all.'
    };
  }
}

/**
 * Searches for cities with live autocomplete via Open-Meteo Geocoding API
 */
export async function searchCities(query: string): Promise<LocationData[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding error: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((res: any) => ({
      id: `${res.id}-${res.latitude}-${res.longitude}`,
      name: res.name,
      country: res.country || '',
      admin1: res.admin1 || '',
      latitude: res.latitude,
      longitude: res.longitude,
      timezone: res.timezone || 'UTC',
      elevation: res.elevation,
    }));
  } catch (err) {
    console.error('Failed to search cities:', err);
    return [];
  }
}

/**
 * Reverse geocodes coordinates to city name
 */
export async function reverseGeocode(lat: number, lon: number): Promise<LocationData> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      }
    });
    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};
      const cityName = addr.city || addr.town || addr.village || addr.municipality || addr.county || 'Current Location';
      const countryName = addr.country || '';
      const stateName = addr.state || addr.region || '';
      return {
        name: cityName,
        country: countryName,
        admin1: stateName,
        latitude: lat,
        longitude: lon,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      };
    }
  } catch (err) {
    console.warn('Reverse geocoding failed, using coordinates:', err);
  }

  return {
    name: `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
    country: '',
    latitude: lat,
    longitude: lon,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  };
}

/**
 * Fetches real-time Air Quality data
 */
async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityData | undefined> {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi,european_aqi&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) return undefined;
    const data = await response.json();
    const curr = data.current;
    if (!curr) return undefined;

    const rawAqi = curr.us_aqi ?? curr.european_aqi ?? 45;
    const { category } = getAqiCategory(rawAqi);

    return {
      aqi: Math.round(rawAqi),
      aqiCategory: category,
      pm2_5: Number((curr.pm2_5 ?? 12).toFixed(1)),
      pm10: Number((curr.pm10 ?? 24).toFixed(1)),
      nitrogenDioxide: Number((curr.nitrogen_dioxide ?? 15).toFixed(1)),
      ozone: Number((curr.ozone ?? 60).toFixed(1)),
      sulphurDioxide: Number((curr.sulphur_dioxide ?? 8).toFixed(1)),
      carbonMonoxide: Number((curr.carbon_monoxide ?? 250).toFixed(1)),
    };
  } catch (err) {
    console.warn('Air quality data unavailable:', err);
    return undefined;
  }
}

/**
 * Fetches full comprehensive weather forecast from Open-Meteo
 */
export async function fetchWeatherData(
  location: LocationData,
  customApiKey?: string
): Promise<WeatherData> {
  const { latitude, longitude } = location;

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,visibility,wind_speed_10m,wind_direction_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

  const [weatherRes, airQuality] = await Promise.all([
    fetch(weatherUrl),
    fetchAirQuality(latitude, longitude),
  ]);

  if (!weatherRes.ok) {
    throw new Error(`Weather service returned ${weatherRes.status}: ${weatherRes.statusText}`);
  }

  const raw = await weatherRes.json();
  const currentRaw = raw.current;
  const hourlyRaw = raw.hourly;
  const dailyRaw = raw.daily;

  if (!currentRaw) {
    throw new Error('Incomplete weather data received from server');
  }

  const isDay = Boolean(currentRaw.is_day);
  const weatherCode = currentRaw.weather_code ?? 0;
  const { type: conditionType, text: conditionText } = mapWmoCodeToCondition(weatherCode, isDay);

  // Current Weather Object
  const current: CurrentWeather = {
    temperature: Math.round(currentRaw.temperature_2m),
    apparentTemperature: Math.round(currentRaw.apparent_temperature),
    humidity: Math.round(currentRaw.relative_humidity_2m),
    windSpeed: Math.round(currentRaw.wind_speed_10m),
    windDirection: Math.round(currentRaw.wind_direction_10m),
    windGusts: Math.round(currentRaw.wind_gusts_10m || currentRaw.wind_speed_10m * 1.3),
    pressure: Math.round(currentRaw.surface_pressure),
    visibility: Math.round((hourlyRaw?.visibility?.[0] ?? 10000) / 1000), // in km
    uvIndex: Math.round(currentRaw.uv_index ?? dailyRaw?.uv_index_max?.[0] ?? 4),
    weatherCode,
    condition: conditionType,
    conditionText,
    isDay,
    time: currentRaw.time,
    cloudCover: currentRaw.cloud_cover ?? 20,
    precipitation: currentRaw.precipitation ?? 0,
  };

  // Next 24 Hours Forecast
  const hourly: HourlyForecastItem[] = [];
  if (hourlyRaw && hourlyRaw.time) {
    const nowTimeStr = currentRaw.time;
    // Find index of current hour
    let startIndex = hourlyRaw.time.findIndex((t: string) => t >= nowTimeStr);
    if (startIndex === -1) startIndex = 0;

    for (let i = startIndex; i < Math.min(startIndex + 24, hourlyRaw.time.length); i++) {
      const hCode = hourlyRaw.weather_code[i] ?? 0;
      const hIsDay = Boolean(hourlyRaw.is_day[i]);
      const { type: hCondition } = mapWmoCodeToCondition(hCode, hIsDay);
      
      hourly.push({
        time: hourlyRaw.time[i],
        timestamp: new Date(hourlyRaw.time[i]).getTime(),
        temperature: Math.round(hourlyRaw.temperature_2m[i]),
        apparentTemperature: Math.round(hourlyRaw.apparent_temperature[i]),
        humidity: Math.round(hourlyRaw.relative_humidity_2m[i]),
        precipitationProbability: Math.round(hourlyRaw.precipitation_probability[i] ?? 0),
        precipitation: Number((hourlyRaw.precipitation[i] ?? 0).toFixed(1)),
        weatherCode: hCode,
        condition: hCondition,
        isDay: hIsDay,
        windSpeed: Math.round(hourlyRaw.wind_speed_10m[i]),
        windDirection: Math.round(hourlyRaw.wind_direction_10m[i]),
      });
    }
  }

  // 7-Day Daily Forecast
  const daily: DailyForecastItem[] = [];
  if (dailyRaw && dailyRaw.time) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < Math.min(7, dailyRaw.time.length); i++) {
      const dateObj = new Date(dailyRaw.time[i]);
      const dayOfWeek = i === 0 ? 'Today' : days[dateObj.getDay()];
      const dCode = dailyRaw.weather_code[i] ?? 0;
      const { type: dCondition, text: dConditionText } = mapWmoCodeToCondition(dCode, true);

      daily.push({
        date: dailyRaw.time[i],
        dayOfWeek,
        timestamp: dateObj.getTime(),
        maxTemp: Math.round(dailyRaw.temperature_2m_max[i]),
        minTemp: Math.round(dailyRaw.temperature_2m_min[i]),
        precipitationProbability: Math.round(dailyRaw.precipitation_probability_max?.[i] ?? 0),
        precipitationSum: Number((dailyRaw.precipitation_sum?.[i] ?? 0).toFixed(1)),
        weatherCode: dCode,
        condition: dCondition,
        conditionText: dConditionText,
        uvIndexMax: Math.round(dailyRaw.uv_index_max?.[i] ?? 5),
        sunrise: dailyRaw.sunrise?.[i] ?? '06:00',
        sunset: dailyRaw.sunset?.[i] ?? '18:30',
        windSpeedMax: Math.round(dailyRaw.wind_speed_10m_max?.[i] ?? 15),
      });
    }
  }

  const sunTimes: SunTimes = {
    sunrise: dailyRaw?.sunrise?.[0] ? dailyRaw.sunrise[0].split('T')[1] || dailyRaw.sunrise[0] : '06:24',
    sunset: dailyRaw?.sunset?.[0] ? dailyRaw.sunset[0].split('T')[1] || dailyRaw.sunset[0] : '18:48',
    daylightDuration: dailyRaw?.daylight_duration?.[0] ?? 44000,
  };

  return {
    location,
    current,
    hourly,
    daily,
    airQuality,
    sunTimes,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Pre-configured popular global showcase cities
 */
export const POPULAR_CITIES: LocationData[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    admin1: 'Tokyo Prefecture',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    admin1: 'Île-de-France',
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris',
  },
  {
    id: 'new-york',
    name: 'New York',
    country: 'United States',
    admin1: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    admin1: 'England',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    admin1: 'Dubai',
    latitude: 25.2048,
    longitude: 55.2708,
    timezone: 'Asia/Dubai',
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    admin1: 'New South Wales',
    latitude: -33.8688,
    longitude: 151.2093,
    timezone: 'Australia/Sydney',
  },
  {
    id: 'reykjavik',
    name: 'Reykjavik',
    country: 'Iceland',
    admin1: 'Capital Region',
    latitude: 64.1466,
    longitude: -21.9426,
    timezone: 'Atlantic/Reykjavik',
  }
];
