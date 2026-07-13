import type { SpeedUnit, TemperatureUnit } from '../types/weather';

export function formatTemp(celsius: number, unit: TemperatureUnit): string {
  const value = unit === 'C' ? celsius : celsius * 9 / 5 + 32;
  return `${Math.round(value)}°`;
}

export function convertTemp(celsius: number, unit: TemperatureUnit): number {
  return unit === 'C' ? celsius : celsius * 9 / 5 + 32;
}

export function formatSpeed(kmh: number, unit: SpeedUnit): string {
  const value = unit === 'kmh' ? kmh : kmh * 0.621371;
  return `${Math.round(value)} ${unit === 'kmh' ? 'km/h' : 'mph'}`;
}

export function windDirectionLabel(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round(deg / 22.5) % 16;
  return dirs[idx];
}

export function formatVisibility(meters: number | null, unit: SpeedUnit): string {
  if (meters === null) return '—';
  if (unit === 'kmh') {
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  }
  const miles = meters / 1609.34;
  return `${miles.toFixed(1)} mi`;
}

export function formatPressure(hpa: number): string {
  return `${Math.round(hpa)} hPa`;
}

export function uvLabel(uv: number | null): string {
  if (uv === null) return 'N/A';
  if (uv < 3) return 'Low';
  if (uv < 6) return 'Moderate';
  if (uv < 8) return 'High';
  if (uv < 11) return 'Very High';
  return 'Extreme';
}

export function aqiCategory(aqi: number | null): { label: string; tone: string } {
  if (aqi === null) return { label: 'Unavailable', tone: 'text-mist' };
  if (aqi <= 50) return { label: 'Good', tone: 'text-emerald-300' };
  if (aqi <= 100) return { label: 'Moderate', tone: 'text-brass-400' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', tone: 'text-orange-300' };
  if (aqi <= 200) return { label: 'Unhealthy', tone: 'text-red-400' };
  if (aqi <= 300) return { label: 'Very Unhealthy', tone: 'text-purple-400' };
  return { label: 'Hazardous', tone: 'text-rose-500' };
}
