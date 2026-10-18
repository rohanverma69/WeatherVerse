import { TemperatureUnit, WindSpeedUnit } from '../types/weather';

/**
 * Converts temperature based on active unit
 */
export function formatTemp(celsius: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    const f = Math.round((celsius * 9) / 5 + 32);
    return `${f}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatTempNumber(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

/**
 * Converts wind speed based on active unit
 */
export function formatWindSpeed(kmh: number, unit: WindSpeedUnit): string {
  if (unit === 'mph') {
    return `${Math.round(kmh * 0.621371)} mph`;
  } else if (unit === 'ms') {
    return `${Math.round(kmh / 3.6)} m/s`;
  }
  return `${Math.round(kmh)} km/h`;
}

/**
 * Converts degrees to compass cardinal direction
 */
export function getWindDirectionLabel(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * Formats local time from ISO string or timestamp in a given timezone
 */
export function formatLocalTime(isoOrTime: string | number, timezone: string, options?: Intl.DateTimeFormatOptions): string {
  try {
    const date = typeof isoOrTime === 'number' ? new Date(isoOrTime) : new Date(isoOrTime);
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      ...options
    }).format(date);
  } catch (e) {
    const d = new Date(isoOrTime);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

/**
 * Formats full local date (e.g. "Sunday, October 18, 2026")
 */
export function formatLocalDate(isoOrTime: string | number, timezone: string): string {
  try {
    const date = typeof isoOrTime === 'number' ? new Date(isoOrTime) : new Date(isoOrTime);
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (e) {
    const d = new Date(isoOrTime);
    return d.toDateString();
  }
}
