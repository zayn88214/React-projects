import type { GeoLocation } from '../types/weather';

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

export class GeocodingError extends Error {
  public readonly kind: 'network' | 'not-found' | 'rate-limit';
  constructor(message: string, kind: 'network' | 'not-found' | 'rate-limit' = 'network') {
    super(message);
    this.name = 'GeocodingError';
    this.kind = kind;
  }
}

interface RawGeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

/** Searches for cities by name. Cancels stale requests via AbortController. */
export async function searchCities(query: string, signal?: AbortSignal): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = `${GEOCODE_URL}?name=${encodeURIComponent(trimmed)}&count=8&language=en&format=json`;

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    throw new GeocodingError('Could not reach the location service.', 'network');
  }

  if (response.status === 429) {
    throw new GeocodingError('Too many requests. Please wait a moment.', 'rate-limit');
  }
  if (!response.ok) {
    throw new GeocodingError('The location service returned an error.', 'network');
  }

  const data = await response.json();
  const results: RawGeoResult[] = data?.results ?? [];

  return results.map((r) => ({
    id: r.id,
    name: r.name,
    admin1: r.admin1,
    country: r.country,
    countryCode: r.country_code,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  }));
}

/** Resolves a human-readable place name for the given coordinates. */
export async function reverseGeocode(lat: number, lon: number, signal?: AbortSignal): Promise<GeoLocation> {
  const url = `${REVERSE_URL}?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
  try {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error('bad status');
    const data = await response.json();
    return {
      id: Math.round(lat * 1000) + Math.round(lon * 1000),
      name: data.city || data.locality || data.principalSubdivision || 'Current Location',
      admin1: data.principalSubdivision,
      country: data.countryName || '',
      countryCode: data.countryCode,
      latitude: lat,
      longitude: lon,
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err;
    // Reverse geocoding is best-effort; fall back to coordinates as the name.
    return {
      id: Math.round(lat * 1000) + Math.round(lon * 1000),
      name: 'Current Location',
      country: '',
      latitude: lat,
      longitude: lon,
    };
  }
}
