import type { DailyPoint, TemperatureUnit } from '../types/weather';
import { formatTemp, convertTemp } from '../utils/units';
import { formatDayLabel } from '../utils/date';
import { weatherIcon } from '../utils/weatherIcon';
import { Droplet } from 'lucide-react';

interface Props {
  daily: DailyPoint[];
  timezone: string;
  unit: TemperatureUnit;
}

export default function DailyForecast({ daily, timezone, unit }: Props) {
  const allTemps = daily.flatMap((d) => [convertTemp(d.tempMin, unit), convertTemp(d.tempMax, unit)]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const range = Math.max(1, globalMax - globalMin);

  return (
    <section aria-label="7-day forecast" className="glass-light rounded-2xl p-6">
      <h2 className="text-xs font-mono uppercase tracking-wider text-mist mb-2 px-1">7-Day Forecast</h2>
      <ul>
        {daily.slice(0, 7).map((d, i) => {
          const Icon = weatherIcon(d.weather.category, true);
          const minPct = ((convertTemp(d.tempMin, unit) - globalMin) / range) * 100;
          const widthPct = ((convertTemp(d.tempMax, unit) - convertTemp(d.tempMin, unit)) / range) * 100;
          return (
            <li
              key={d.date}
              className="grid grid-cols-[64px_28px_1fr_auto] sm:grid-cols-[80px_28px_1fr_120px] items-center gap-3 py-2.5 border-t border-white/5 first:border-t-0"
            >
              <span className="text-sm text-parchment font-medium">{formatDayLabel(d.date, timezone, i)}</span>
              <Icon size={20} strokeWidth={1.5} className="text-brass-300" aria-hidden="true" />
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-mist w-8 text-right">{formatTemp(d.tempMin, unit)}</span>
                <div className="relative h-1.5 flex-1 rounded-full bg-white/10">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-300 to-brass-400"
                    style={{ left: `${minPct}%`, width: `${widthPct}%` }}
                  />
                </div>
                <span className="text-xs text-parchment w-8">{formatTemp(d.tempMax, unit)}</span>
              </div>
              <div className="flex items-center gap-3 justify-end sm:justify-end">
                {d.precipitationProbability > 0 && (
                  <span className="hidden sm:flex items-center gap-0.5 text-[11px] text-sky-300">
                    <Droplet size={10} aria-hidden="true" />
                    {Math.round(d.precipitationProbability)}%
                  </span>
                )}
                <span className="text-sm text-parchment font-medium sm:hidden">
                  {formatTemp(d.tempMin, unit)} / {formatTemp(d.tempMax, unit)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
