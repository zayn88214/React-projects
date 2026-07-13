import type {
  AirQuality,
  CurrentWeather,
  DailyPoint,
  GeoLocation,
  HourlyPoint,
  WeatherData,
} from '../types/weather';
import { mapWeatherCode } from '../utils/weatherCode';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

// Open-Meteo's forecast endpoint is free and keyless. Some deployments of
// this app may instead proxy through a keyed provider (e.g. OpenWeatherMap);
// if VITE_WEATHER_API_KEY is set it is appended here for that scenario.
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY as string | undefined;

export class WeatherApiError extends Error {
  public readonly kind: 'network' | 'rate-limit' | 'no-data' | 'missing-key';
  constructor(message: string, kind: 'network' | 'rate-limit' | 'no-data' | 'missing-key' = 'network') {
    super(message);
    this.name = 'WeatherApiError';
    this.kind = kind;
  }
}

// Short in-memory cache to avoid duplicate requests for the same coordinates.
const cache = new Map<string, { data: WeatherData; expires: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

function cacheKey(lat: number, lon: number): string {
  return `${lat.toFixed(3)},${lon.toFixed(3)}`;
}

async function fetchJson(url: string, signal?: AbortSignal) {
  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new WeatherApiError('Network request failed. Check your connection.', 'network');
  }
  if (response.status === 429) {
    throw new WeatherApiError('The weather service is rate-limiting requests. Try again shortly.', 'rate-limit');
  }
  if (!response.ok) {
    throw new WeatherApiError('The weather service returned an error.', 'network');
  }
  return response.json();
}

export async function fetchAirQuality(lat: number, lon: number, signal?: AbortSignal): Promise<AirQuality | null> {
  try {
    const url = `${AIR_QUALITY_URL}?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5&timezone=auto`;
    const data = await fetchJson(url, signal);
    const aqi = data?.current?.us_aqi ?? null;
    const pm25 = data?.current?.pm2_5 ?? null;
    let category: AirQuality['category'] = 'unknown';
    if (aqi !== null) {
      if (aqi <= 50) category = 'good';
      else if (aqi <= 100) category = 'moderate';
      else if (aqi <= 150) category = 'unhealthy-sensitive';
      else if (aqi <= 200) category = 'unhealthy';
      else if (aqi <= 300) category = 'very-unhealthy';
      else category = 'hazardous';
    }
    return { usAqi: aqi, pm25, category };
  } catch {
    // Air quality is a supplemental feature; failure here should not break the page.
    return null;
  }
}

export async function fetchWeather(location: GeoLocation, signal?: AbortSignal): Promise<WeatherData> {
  const key = cacheKey(location.latitude, location.longitude);
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return { ...cached.data, location };
  }

  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: [
      'temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'is_day',
      'precipitation', 'weather_code', 'pressure_msl', 'wind_speed_10m',
      'wind_direction_10m', 'wind_gusts_10m',
    ].join(','),
    hourly: [
      'temperature_2m', 'precipitation_probability', 'weather_code',
      'wind_speed_10m', 'visibility', 'uv_index',
    ].join(','),
    daily: [
      'weather_code', 'temperature_2m_max', 'temperature_2m_min', 'sunrise', 'sunset',
      'precipitation_probability_max', 'uv_index_max', 'wind_speed_10m_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '8',
  });
  if (API_KEY) params.set('apikey', API_KEY);

  const url = `${FORECAST_URL}?${params.toString()}`;
  const data = await fetchJson(url, signal);

  if (!data?.current || !data?.hourly || !data?.daily) {
    throw new WeatherApiError('No forecast data was returned for this location.', 'no-data');
  }

  const timezone: string = data.timezone ?? 'UTC';
  const isDayNow = data.current.is_day === 1;

  const current: CurrentWeather = {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    weather: mapWeatherCode(data.current.weather_code, isDayNow),
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    windGusts: data.current.wind_gusts_10m,
    visibility: pickHourlyNow(data.hourly, 'visibility', data.current.time),
    pressure: data.current.pressure_msl,
    uvIndex: pickHourlyNow(data.hourly, 'uv_index', data.current.time),
    precipitationProbability: pickHourlyNow(data.hourly, 'precipitation_probability', data.current.time) ?? 0,
  };

  const hourly: HourlyPoint[] = (data.hourly.time as string[]).map((time: string, i: number) => ({
    time,
    temperature: data.hourly.temperature_2m[i],
    precipitationProbability: data.hourly.precipitation_probability[i] ?? 0,
    weather: mapWeatherCode(data.hourly.weather_code[i], isHourDay(time, data.daily)),
    windSpeed: data.hourly.wind_speed_10m[i],
    visibility: data.hourly.visibility?.[i] ?? null,
    uvIndex: data.hourly.uv_index?.[i] ?? null,
  }));

  const daily: DailyPoint[] = (data.daily.time as string[]).map((date: string, i: number) => ({
    date,
    weather: mapWeatherCode(data.daily.weather_code[i], true),
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    precipitationProbability: data.daily.precipitation_probability_max?.[i] ?? 0,
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
    uvIndexMax: data.daily.uv_index_max?.[i] ?? null,
    windSpeedMax: data.daily.wind_speed_10m_max?.[i] ?? 0,
  }));

  const airQuality = await fetchAirQuality(location.latitude, location.longitude, signal);

  const weatherData: WeatherData = {
    location: { ...location, timezone },
    timezone,
    localTimeIso: data.current.time,
    current,
    todaySunrise: daily[0]?.sunrise ?? data.current.time,
    todaySunset: daily[0]?.sunset ?? data.current.time,
    hourly: hourly.filter((h) => new Date(h.time).getTime() >= new Date(data.current.time).getTime() - 3600_000).slice(0, 24),
    daily,
    airQuality,
  };

  cache.set(key, { data: weatherData, expires: Date.now() + CACHE_TTL_MS });
  return weatherData;
}

function pickHourlyNow(hourly: any, field: string, currentTimeIso: string): number | null {
  const times: string[] = hourly.time;
  const target = new Date(currentTimeIso).getTime();
  let closestIdx = 0;
  let closestDiff = Infinity;
  for (let i = 0; i < times.length; i++) {
    const diff = Math.abs(new Date(times[i]).getTime() - target);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestIdx = i;
    }
  }
  return hourly[field]?.[closestIdx] ?? null;
}

function isHourDay(hourIso: string, daily: any): boolean {
  // Approximate day index for this hour to compare against that day's sunrise/sunset.
  const hourTime = new Date(hourIso).getTime();
  const dailyTimes: string[] = daily.time;
  let dayIdx = 0;
  for (let i = 0; i < dailyTimes.length; i++) {
    if (hourIso.startsWith(dailyTimes[i])) {
      dayIdx = i;
      break;
    }
  }
  const sunrise = new Date(daily.sunrise[dayIdx]).getTime();
  const sunset = new Date(daily.sunset[dayIdx]).getTime();
  return hourTime >= sunrise && hourTime < sunset;
}
