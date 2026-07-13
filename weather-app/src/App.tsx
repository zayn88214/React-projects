import { useEffect, useState, Suspense, lazy } from 'react';
import type { GeoLocation, TemperatureUnit, SpeedUnit } from './types/weather';
import { useGeolocation } from './hooks/useGeolocation';
import { useWeather } from './hooks/useWeather';
import { useLocalStorage } from './hooks/useLocalStorage';
import { reverseGeocode } from './services/geocoding';

import Header from './components/Header';
import WeatherBackground from './components/WeatherBackground';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import WeatherDetails from './components/WeatherDetails';
import SunProgress from './components/SunProgress';
import AirQualityCard from './components/AirQualityCard';
import FavoriteCities from './components/FavoriteCities';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorState from './components/ErrorState';
import PermissionState from './components/PermissionState';

const DailyForecast = lazy(() => import('./components/DailyForecast'));
const ForecastChart = lazy(() => import('./components/ForecastChart'));

const DEFAULT_CITY: GeoLocation = {
  id: 2643743,
  name: 'London',
  admin1: 'England',
  country: 'United Kingdom',
  countryCode: 'GB',
  latitude: 51.5074,
  longitude: -0.1278,
};

export default function App() {
  const geo = useGeolocation();
  const { data, status, errorMessage, setStatus, load } = useWeather();
  const [temperature, setTemperature] = useLocalStorage<TemperatureUnit>('units:temperature', 'C');
  const [speed, setSpeed] = useLocalStorage<SpeedUnit>('units:speed', 'kmh');
  const [favorites, setFavorites] = useLocalStorage<GeoLocation[]>('cities:favorites', []);
  const [recents, setRecents] = useLocalStorage<GeoLocation[]>('cities:recents', []);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [awaitingCurrentLocation, setAwaitingCurrentLocation] = useState(false);

  // Kick off geolocation request on first load.
  useEffect(() => {
    geo.request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When geolocation resolves, reverse-geocode and load weather.
  useEffect(() => {
    if (geo.status === 'granted' && geo.coords && !hasInitialized) {
      setHasInitialized(true);
      (async () => {
        try {
          const location = await reverseGeocode(geo.coords!.latitude, geo.coords!.longitude);
          addRecent(location);
          load(location);
        } catch {
          load(DEFAULT_CITY);
        }
      })();
    } else if ((geo.status === 'denied' || geo.status === 'unsupported') && !hasInitialized) {
      setStatus('location-denied');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo.status, geo.coords]);

  // Resolve an explicit "use current location" request from the search box,
  // independent of the first-load flow above (which only runs once).
  useEffect(() => {
    if (!awaitingCurrentLocation) return;
    if (geo.status === 'granted' && geo.coords) {
      setAwaitingCurrentLocation(false);
      (async () => {
        try {
          const location = await reverseGeocode(geo.coords!.latitude, geo.coords!.longitude);
          handleSelectLocation(location);
        } catch {
          handleSelectLocation(DEFAULT_CITY);
        }
      })();
    } else if (geo.status === 'denied' || geo.status === 'unsupported') {
      setAwaitingCurrentLocation(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awaitingCurrentLocation, geo.status, geo.coords]);

  function handleUseCurrentLocation() {
    setAwaitingCurrentLocation(true);
    geo.request();
  }

  function handleRemoveRecent(loc: GeoLocation) {
    setRecents((prev) => prev.filter((r) => r.id !== loc.id));
  }

  function addRecent(loc: GeoLocation) {
    setRecents((prev) => {
      const filtered = prev.filter((p) => p.id !== loc.id);
      return [loc, ...filtered].slice(0, 8);
    });
  }

  function handleSelectLocation(loc: GeoLocation) {
    setHasInitialized(true);
    addRecent(loc);
    load(loc, { isSearch: true });
  }

  function handleUseDefault() {
    setHasInitialized(true);
    addRecent(DEFAULT_CITY);
    load(DEFAULT_CITY);
  }

  function toggleFavorite(loc: GeoLocation) {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === loc.id);
      if (exists) return prev.filter((f) => f.id !== loc.id);
      return [...prev, loc];
    });
  }

  function isFavorite(loc: GeoLocation) {
    return favorites.some((f) => f.id === loc.id);
  }

  function handleRetry() {
    if (data) {
      load(data.location);
    } else if (geo.coords) {
      reverseGeocode(geo.coords.latitude, geo.coords.longitude).then(load);
    } else {
      load(DEFAULT_CITY);
    }
  }

  const category = data?.current.weather.category ?? 'clear';
  const isDay = data?.current.weather.isDay ?? true;

  return (
    <div className="min-h-screen relative">
      <WeatherBackground category={category} isDay={isDay} />

      <Header
        onSelectLocation={handleSelectLocation}
        recents={recents}
        onUseCurrentLocation={handleUseCurrentLocation}
        locatingCurrent={awaitingCurrentLocation}
        temperature={temperature}
        speed={speed}
        onChangeTemperature={setTemperature}
        onChangeSpeed={setSpeed}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-10">
          <aside className="order-2 lg:order-1 lg:pt-1" aria-label="Saved locations">
            <FavoriteCities
              favorites={favorites}
              recents={recents}
              currentId={data?.location.id}
              onSelect={(loc) => load(loc, { isSearch: true })}
              onToggleFavorite={toggleFavorite}
              onRemoveRecent={handleRemoveRecent}
              isFavorite={isFavorite}
            />
          </aside>

          <div className="order-1 lg:order-2 min-w-0 space-y-6 sm:space-y-8">
            {status === 'requesting-location' && (
              <PermissionState variant="requesting" onRequest={geo.request} onUseDefault={handleUseDefault} />
            )}

            {status === 'location-denied' && (
              <PermissionState variant="denied" onRequest={geo.request} onUseDefault={handleUseDefault} />
            )}

            {(status === 'loading' || status === 'search-loading') && <LoadingSkeleton />}

            {(status === 'network-error' || status === 'rate-limited' || status === 'missing-key' || status === 'no-forecast') && (
              <ErrorState status={status} message={errorMessage} onRetry={handleRetry} />
            )}

            {status === 'ready' && data && (
              <>
                <CurrentWeather data={data} unit={temperature} />
                <HourlyForecast hourly={data.hourly} timezone={data.timezone} unit={temperature} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <SunProgress
                    nowIso={data.localTimeIso}
                    sunriseIso={data.todaySunrise}
                    sunsetIso={data.todaySunset}
                    timezone={data.timezone}
                  />
                  <AirQualityCard airQuality={data.airQuality} />
                </div>

                <WeatherDetails data={data} speedUnit={speed} />

                <Suspense fallback={<div className="h-56 glass-light rounded-2xl animate-pulse" />}>
                  <ForecastChart hourly={data.hourly} timezone={data.timezone} unit={temperature} />
                </Suspense>

                <Suspense fallback={<div className="h-64 glass-light rounded-2xl animate-pulse" />}>
                  <DailyForecast daily={data.daily} timezone={data.timezone} unit={temperature} />
                </Suspense>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pt-2 pb-8 text-center text-xs text-mist/70 font-mono">
        Weather data from Open-Meteo · Air quality from Open-Meteo Air Quality API
      </footer>
    </div>
  );
}
