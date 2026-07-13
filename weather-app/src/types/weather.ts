export type WeatherCategory =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'rain'
  | 'thunderstorm'
  | 'snow';

export interface WeatherCondition {
  code: number;
  category: WeatherCategory;
  description: string;
  isDay: boolean;
}

export interface GeoLocation {
  id: number;
  name: string;
  admin1?: string;
  country: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface HourlyPoint {
  time: string; // ISO
  temperature: number;
  precipitationProbability: number;
  weather: WeatherCondition;
  windSpeed: number;
  visibility: number | null;
  uvIndex: number | null;
}

export interface DailyPoint {
  date: string; // ISO date
  weather: WeatherCondition;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number | null;
  windSpeedMax: number;
}

export interface AirQuality {
  usAqi: number | null;
  pm25: number | null;
  category: 'good' | 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous' | 'unknown';
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  weather: WeatherCondition;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  visibility: number | null;
  pressure: number;
  uvIndex: number | null;
  precipitationProbability: number;
}

export interface WeatherData {
  location: GeoLocation;
  timezone: string;
  localTimeIso: string;
  current: CurrentWeather;
  todaySunrise: string;
  todaySunset: string;
  hourly: HourlyPoint[];
  daily: DailyPoint[];
  airQuality: AirQuality | null;
}

export type TemperatureUnit = 'C' | 'F';
export type SpeedUnit = 'kmh' | 'mph';

export interface UnitPreferences {
  temperature: TemperatureUnit;
  speed: SpeedUnit;
}

export type AppStatus =
  | 'requesting-location'
  | 'loading'
  | 'search-loading'
  | 'location-denied'
  | 'invalid-city'
  | 'rate-limited'
  | 'network-error'
  | 'missing-key'
  | 'empty-search'
  | 'no-forecast'
  | 'ready';
