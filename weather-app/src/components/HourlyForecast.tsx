import type { HourlyPoint, TemperatureUnit } from '../types/weather';
import { formatTemp } from '../utils/units';
import { formatHourLabel } from '../utils/date';
import { weatherIcon } from '../utils/weatherIcon';
import { Droplet } from 'lucide-react';

interface Props {
  hourly: HourlyPoint[];
  timezone: string;
  unit: TemperatureUnit;
}

export default function HourlyForecast({ hourly, timezone, unit }: Props) {
  return (
    <section aria-label="Hourly forecast" className="glass-light rounded-2xl p-6 min-w-0">
      <h2 className="text-xs font-mono uppercase tracking-wider text-mist mb-4 px-1">24-Hour Forecast</h2>
      <div className="relative -mx-1">
        <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-2 px-1" role="list">
          {hourly.map((h, i) => {
            const Icon = weatherIcon(h.weather.category, h.weather.isDay);
            return (
              <div
                key={h.time}
                role="listitem"
                className="flex flex-col items-center gap-1.5 shrink-0 w-16 text-center"
              >
                <span className="text-xs text-mist font-mono">{i === 0 ? 'Now' : formatHourLabel(h.time, timezone)}</span>
                <Icon size={26} strokeWidth={1.5} className="text-brass-300" aria-hidden="true" />
                <span className="text-sm font-medium text-parchment">{formatTemp(h.temperature, unit)}</span>
                {h.precipitationProbability > 0 && (
                  <span className="flex items-center gap-0.5 text-[11px] text-sky-300">
                    <Droplet size={10} aria-hidden="true" />
                    {Math.round(h.precipitationProbability)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-ink-900/40 to-transparent rounded-r-2xl" aria-hidden="true" />
      </div>
    </section>
  );
}
