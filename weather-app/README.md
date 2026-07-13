# Fieldglass — Weather Dashboard

A production-quality, responsive weather dashboard built with React, TypeScript, Tailwind CSS, Framer Motion, and Recharts. It shows live current conditions, a 24-hour forecast, and a 7-day forecast for your current location or any city you search for, with a background that changes to match real conditions (clear, cloudy, rain, storm, snow, fog — day or night).

## 1. Install dependencies

Requires Node.js 18+.

```bash
cd weather-app
npm install
```

## 2. Weather API key

This app uses **[Open-Meteo](https://open-meteo.com)** for both the forecast data and city search (geocoding), plus its Air Quality API. Open-Meteo's endpoints used here are **free and do not require an API key** — that's why the app works immediately after `npm install` with no sign-up step.

An optional `VITE_WEATHER_API_KEY` variable is still wired into the API service layer (`src/services/weatherApi.ts`) so the same code can be pointed at a keyed provider (e.g. OpenWeatherMap) later with minimal changes — just leave it blank to use Open-Meteo as-is.

```bash
cp .env.example .env
# .env
VITE_WEATHER_API_KEY=
```

Reverse geocoding (turning your GPS coordinates into a city name) uses the free, keyless BigDataCloud client API.

## 3. Run the development server

```bash
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`). Your browser will ask for location permission — allow it to see local weather, or dismiss it and search for a city instead.

## 4. Build for production

```bash
npm run build
npm run preview   # serves the production build locally
```

The optimized output is written to `dist/`.

## 5. API endpoints used

| Purpose | Endpoint |
|---|---|
| Forecast (current, hourly, daily) | `https://api.open-meteo.com/v1/forecast` |
| City search / geocoding | `https://geocoding-api.open-meteo.com/v1/search` |
| Reverse geocoding (GPS → city name) | `https://api.bigdatacloud.net/data/reverse-geocode-client` |
| Air quality (US AQI, PM2.5) | `https://air-quality-api.open-meteo.com/v1/air-quality` |

All requests use `timezone=auto` so times, sunrise/sunset, and hourly labels are computed in the **location's own timezone**, not the browser's.

## 6. Known limitations / fallback behavior

- Open-Meteo has generous free-tier rate limits, but under heavy use the app detects HTTP 429 responses and shows a dedicated "too many requests" state with a retry button.
- If geolocation is denied, unsupported, or times out, the app shows a permission-denied state and lets you search manually or fall back to a default city (London).
- If reverse geocoding fails (rare), the location is still loaded using coordinates, labeled "Current Location."
- Air quality data isn't available for a small number of remote locations; the Air Quality card simply doesn't render in that case rather than showing an error.
- Weather responses are cached in memory for 5 minutes per coordinate pair to avoid redundant requests when switching between cards quickly.

## Project structure

```
src/
  components/    UI components (presentational, one concern each)
  hooks/         useGeolocation, useWeather, useDebounce, useLocalStorage
  services/      weatherApi.ts, geocoding.ts — all network + normalization logic
  types/         shared TypeScript interfaces
  utils/         unit conversion, date/timezone formatting, weather-code mapping
```

## Tech stack

React 19 · TypeScript (strict mode) · Vite · Tailwind CSS · Framer Motion · Recharts · lucide-react
