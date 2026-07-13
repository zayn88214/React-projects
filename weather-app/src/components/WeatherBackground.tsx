import { useMemo } from 'react';
import type { WeatherCategory } from '../types/weather';

interface Props {
  category: WeatherCategory;
  isDay: boolean;
}

const GRADIENTS: Record<string, string> = {
  'clear-day': 'from-[#2b6fb0] via-[#4a90c9] to-[#a8d4e8]',
  'clear-night': 'from-[#050810] via-[#0b1330] to-[#1a2550]',
  'partly-cloudy-day': 'from-[#3f7bab] via-[#6a9cc0] to-[#b7cfd9]',
  'partly-cloudy-night': 'from-[#070b16] via-[#111a34] to-[#1e2a4a]',
  'cloudy-day': 'from-[#4a5568] via-[#63748a] to-[#8b9bab]',
  'cloudy-night': 'from-[#0a0d14] via-[#151c28] to-[#232c3a]',
  'fog-day': 'from-[#7c8894] via-[#9aa5ad] to-[#c3cad0]',
  'fog-night': 'from-[#12151b] via-[#1c2129] to-[#2b323d]',
  'rain-day': 'from-[#2c3e50] via-[#3d5266] to-[#5a7182]',
  'rain-night': 'from-[#060a10] via-[#0f1720] to-[#1a2530]',
  'thunderstorm-day': 'from-[#161d29] via-[#232c3d] to-[#38445a]',
  'thunderstorm-night': 'from-[#040609] via-[#0a0e16] to-[#151b28]',
  'snow-day': 'from-[#5c7089] via-[#8a9cb0] to-[#d7e2ea]',
  'snow-night': 'from-[#0c1018] via-[#161d2b] to-[#252f42]',
};

export default function WeatherBackground({ category, isDay }: Props) {
  const key = `${category}-${isDay ? 'day' : 'night'}`;
  const gradient = GRADIENTS[key] ?? GRADIENTS['cloudy-day'];

  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, () => ({
        top: Math.random() * 60,
        left: Math.random() * 100,
        size: Math.random() * 1.6 + 0.5,
        delay: Math.random() * 4,
      })),
    []
  );

  const raindrops = useMemo(
    () =>
      Array.from({ length: 40 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        duration: 0.6 + Math.random() * 0.5,
      })),
    []
  );

  const snowflakes = useMemo(
    () =>
      Array.from({ length: 30 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 6,
        size: 3 + Math.random() * 4,
      })),
    []
  );

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className={`absolute inset-0 bg-gradient-to-b ${gradient} transition-colors duration-1000`} />

      {/* Sun / moon glow */}
      {(category === 'clear' || category === 'partly-cloudy') && (
        <div
          className={`absolute rounded-full blur-3xl motion-safe:animate-glow ${
            isDay ? 'bg-amber-200/40' : 'bg-slate-200/20'
          }`}
          style={{ width: 260, height: 260, top: '8%', right: '12%' }}
        />
      )}

      {/* Stars at night */}
      {!isDay && (category === 'clear' || category === 'partly-cloudy' || category === 'cloudy') && (
        <div className="absolute inset-0">
          {stars.map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white motion-safe:animate-twinkle"
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: s.size,
                height: s.size,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Drifting cloud shapes */}
      {(category === 'partly-cloudy' || category === 'cloudy' || category === 'fog' || category === 'rain' || category === 'thunderstorm') && (
        <>
          <CloudLayer opacity={0.18} top="12%" duration="drift-slow" scale={1.4} />
          <CloudLayer opacity={0.12} top="28%" duration="drift" scale={1} reverse />
          <CloudLayer opacity={0.22} top="45%" duration="drift-slow" scale={1.8} />
        </>
      )}

      {/* Fog haze */}
      {category === 'fog' && (
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
      )}

      {/* Rain */}
      {category === 'rain' && (
        <div className="absolute inset-0">
          {raindrops.map((r, i) => (
            <div
              key={i}
              className="absolute top-0 w-px h-10 bg-gradient-to-b from-transparent via-sky-100/60 to-transparent motion-safe:animate-fall"
              style={{ left: `${r.left}%`, animationDelay: `${r.delay}s`, animationDuration: `${r.duration}s` }}
            />
          ))}
        </div>
      )}

      {/* Thunderstorm: rain + flash */}
      {category === 'thunderstorm' && (
        <>
          <div className="absolute inset-0">
            {raindrops.slice(0, 30).map((r, i) => (
              <div
                key={i}
                className="absolute top-0 w-px h-12 bg-gradient-to-b from-transparent via-slate-200/50 to-transparent motion-safe:animate-fall"
                style={{ left: `${r.left}%`, animationDelay: `${r.delay}s`, animationDuration: `${r.duration * 0.8}s` }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-white motion-safe:animate-flash" />
        </>
      )}

      {/* Snow */}
      {category === 'snow' && (
        <div className="absolute inset-0">
          {snowflakes.map((s, i) => (
            <div
              key={i}
              className="absolute top-0 rounded-full bg-white/80 motion-safe:animate-fall"
              style={{
                left: `${s.left}%`,
                width: s.size,
                height: s.size,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Vignette for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
    </div>
  );
}

function CloudLayer({
  opacity,
  top,
  duration,
  scale,
  reverse,
}: {
  opacity: number;
  top: string;
  duration: 'drift' | 'drift-slow';
  scale: number;
  reverse?: boolean;
}) {
  const animClass = duration === 'drift-slow' ? 'motion-safe:animate-drift-slow' : 'motion-safe:animate-drift';
  return (
    <svg
      className={`absolute ${animClass}`}
      style={{
        top,
        left: reverse ? undefined : '-20%',
        right: reverse ? '-20%' : undefined,
        width: `${60 * scale}%`,
        opacity,
        transform: reverse ? 'scaleX(-1)' : undefined,
      }}
      viewBox="0 0 400 100"
      fill="white"
    >
      <ellipse cx="80" cy="60" rx="70" ry="30" />
      <ellipse cx="160" cy="45" rx="90" ry="38" />
      <ellipse cx="250" cy="60" rx="80" ry="32" />
    </svg>
  );
}
