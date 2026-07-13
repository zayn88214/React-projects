import { useCallback, useRef, useState } from 'react';
import type { AppStatus, GeoLocation, WeatherData } from '../types/weather';
import { fetchWeather, WeatherApiError } from '../services/weatherApi';

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [status, setStatus] = useState<AppStatus>('requesting-location');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (location: GeoLocation, opts?: { isSearch?: boolean }) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus(opts?.isSearch ? 'search-loading' : 'loading');
    setErrorMessage(null);

    try {
      const result = await fetchWeather(location, controller.signal);
      if (controller.signal.aborted) return;
      setData(result);
      setStatus('ready');
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      if (err instanceof WeatherApiError) {
        if (err.kind === 'rate-limit') setStatus('rate-limited');
        else if (err.kind === 'no-data') setStatus('no-forecast');
        else if (err.kind === 'missing-key') setStatus('missing-key');
        else setStatus('network-error');
        setErrorMessage(err.message);
      } else {
        setStatus('network-error');
        setErrorMessage('Something unexpected went wrong.');
      }
    }
  }, []);

  return { data, status, errorMessage, setStatus, load };
}
