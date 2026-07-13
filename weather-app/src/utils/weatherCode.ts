import type { WeatherCategory, WeatherCondition } from '../types/weather';

interface CodeMeta {
  category: WeatherCategory;
  day: string;
  night: string;
}

// WMO weather interpretation codes -> internal categories.
const CODE_MAP: Record<number, CodeMeta> = {
  0: { category: 'clear', day: 'Clear sky', night: 'Clear sky' },
  1: { category: 'clear', day: 'Mostly clear', night: 'Mostly clear' },
  2: { category: 'partly-cloudy', day: 'Partly cloudy', night: 'Partly cloudy' },
  3: { category: 'cloudy', day: 'Overcast', night: 'Overcast' },
  45: { category: 'fog', day: 'Fog', night: 'Fog' },
  48: { category: 'fog', day: 'Depositing rime fog', night: 'Depositing rime fog' },
  51: { category: 'rain', day: 'Light drizzle', night: 'Light drizzle' },
  53: { category: 'rain', day: 'Drizzle', night: 'Drizzle' },
  55: { category: 'rain', day: 'Dense drizzle', night: 'Dense drizzle' },
  56: { category: 'rain', day: 'Freezing drizzle', night: 'Freezing drizzle' },
  57: { category: 'rain', day: 'Dense freezing drizzle', night: 'Dense freezing drizzle' },
  61: { category: 'rain', day: 'Slight rain', night: 'Slight rain' },
  63: { category: 'rain', day: 'Rain', night: 'Rain' },
  65: { category: 'rain', day: 'Heavy rain', night: 'Heavy rain' },
  66: { category: 'rain', day: 'Freezing rain', night: 'Freezing rain' },
  67: { category: 'rain', day: 'Heavy freezing rain', night: 'Heavy freezing rain' },
  71: { category: 'snow', day: 'Slight snow', night: 'Slight snow' },
  73: { category: 'snow', day: 'Snow', night: 'Snow' },
  75: { category: 'snow', day: 'Heavy snow', night: 'Heavy snow' },
  77: { category: 'snow', day: 'Snow grains', night: 'Snow grains' },
  80: { category: 'rain', day: 'Light showers', night: 'Light showers' },
  81: { category: 'rain', day: 'Showers', night: 'Showers' },
  82: { category: 'rain', day: 'Violent showers', night: 'Violent showers' },
  85: { category: 'snow', day: 'Snow showers', night: 'Snow showers' },
  86: { category: 'snow', day: 'Heavy snow showers', night: 'Heavy snow showers' },
  95: { category: 'thunderstorm', day: 'Thunderstorm', night: 'Thunderstorm' },
  96: { category: 'thunderstorm', day: 'Thunderstorm with hail', night: 'Thunderstorm with hail' },
  99: { category: 'thunderstorm', day: 'Severe thunderstorm with hail', night: 'Severe thunderstorm with hail' },
};

export function mapWeatherCode(code: number, isDay: boolean): WeatherCondition {
  const meta = CODE_MAP[code] ?? { category: 'cloudy', day: 'Unknown', night: 'Unknown' };
  return {
    code,
    category: meta.category,
    description: isDay ? meta.day : meta.night,
    isDay,
  };
}

export function categoryLabel(category: WeatherCategory): string {
  switch (category) {
    case 'clear': return 'Clear';
    case 'partly-cloudy': return 'Partly Cloudy';
    case 'cloudy': return 'Cloudy';
    case 'fog': return 'Fog';
    case 'rain': return 'Rain';
    case 'thunderstorm': return 'Storm';
    case 'snow': return 'Snow';
  }
}
