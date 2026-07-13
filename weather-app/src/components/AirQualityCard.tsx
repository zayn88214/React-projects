import { Wind } from 'lucide-react';
import type { AirQuality } from '../types/weather';
import { aqiCategory } from '../utils/units';

interface Props {
  airQuality: AirQuality | null;
}

export default function AirQualityCard({ airQuality }: Props) {
  if (!airQuality || airQuality.usAqi === null) return null;

  const { label, tone } = aqiCategory(airQuality.usAqi);
  const pct = Math.min(100, (airQuality.usAqi / 300) * 100);

  return (
    <div className="glass-light rounded-2xl p-6">
      <div className="flex items-center gap-1.5 text-mist text-xs font-mono uppercase tracking-wider mb-3">
        <Wind size={14} aria-hidden="true" />
        <span>Air Quality</span>
      </div>
      <div className="flex items-end justify-between mb-2">
        <span className="text-3xl font-display text-parchment">{airQuality.usAqi}</span>
        <span className={`text-sm font-medium ${tone}`}>{label}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden" role="img" aria-label={`US AQI ${airQuality.usAqi}, ${label}`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {airQuality.pm25 !== null && (
        <div className="text-xs text-mist mt-2">PM2.5: {airQuality.pm25.toFixed(1)} µg/m³</div>
      )}
    </div>
  );
}
