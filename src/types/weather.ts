export type WeatherConditionType = 
  | 'sunny'
  | 'clear_night'
  | 'cloudy'
  | 'partly_cloudy'
  | 'rainy'
  | 'heavy_rain'
  | 'thunderstorm'
  | 'snowy'
  | 'foggy'
  | 'windy';

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms';

export interface LocationData {
  id?: number | string;
  name: string;
  country: string;
  admin1?: string; // State or region
  latitude: number;
  longitude: number;
  timezone: string;
  elevation?: number;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  pressure: number;
  visibility: number; // in meters or km
  uvIndex: number;
  weatherCode: number;
  condition: WeatherConditionType;
  conditionText: string;
  isDay: boolean;
  time: string;
  cloudCover: number;
  precipitation: number;
}

export interface HourlyForecastItem {
  time: string;
  timestamp: number;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  condition: WeatherConditionType;
  isDay: boolean;
  windSpeed: number;
  windDirection: number;
}

export interface DailyForecastItem {
  date: string;
  dayOfWeek: string;
  timestamp: number;
  maxTemp: number;
  minTemp: number;
  precipitationProbability: number;
  precipitationSum: number;
  weatherCode: number;
  condition: WeatherConditionType;
  conditionText: string;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  windSpeedMax: number;
}

export interface AirQualityData {
  aqi: number; // 1-5 or 0-500 scale
  aqiCategory: 'Good' | 'Fair' | 'Moderate' | 'Poor' | 'Very Poor' | 'Hazardous';
  pm2_5: number;
  pm10: number;
  nitrogenDioxide: number;
  ozone: number;
  sulphurDioxide: number;
  carbonMonoxide: number;
}

export interface SunTimes {
  sunrise: string;
  sunset: string;
  daylightDuration: number; // seconds
}

export interface WeatherData {
  location: LocationData;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality?: AirQualityData;
  sunTimes: SunTimes;
  lastUpdated: string;
}

export interface SavedLocation {
  id: string;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  currentTemp?: number;
  condition?: WeatherConditionType;
}

export interface UserPreferences {
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
  enableCursorTrail: boolean;
  graphicsQuality: 'high' | 'medium' | 'low';
  customApiKey?: string;
  apiProvider: 'open-meteo' | 'openweathermap';
}
