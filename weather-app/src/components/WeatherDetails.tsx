import { Droplets, Wind, Gauge, Eye, SunMedium, CloudRain } from 'lucide-react';
import type { WeatherData, SpeedUnit } from '../types/weather';
import { formatSpeed, formatVisibility, formatPressure, uvLabel, windDirectionLabel } from '../utils/units';

interface Props {
  data: WeatherData;
  speedUnit: SpeedUnit;
}

export default function WeatherDetails({ data, speedUnit }: Props) {
  const { current } = data;

  const items = [
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${Math.round(current.humidity)}%`,
      sub: current.humidity > 70 ? 'Feels muggy' : 'Comfortable',
    },
    {
      icon: Wind,
      label: 'Wind',
      value: formatSpeed(current.windSpeed, speedUnit),
      sub: `${windDirectionLabel(current.windDirection)} · gusts ${formatSpeed(current.windGusts, speedUnit)}`,
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: formatPressure(current.pressure),
      sub: current.pressure < 1013 ? 'Below average' : 'Above average',
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: formatVisibility(current.visibility, speedUnit),
      sub: (current.visibility ?? 0) > 8000 ? 'Clear conditions' : 'Reduced range',
    },
    {
      icon: SunMedium,
      label: 'UV Index',
      value: current.uvIndex !== null ? String(Math.round(current.uvIndex)) : 'N/A',
      sub: uvLabel(current.uvIndex),
    },
    {
      icon: CloudRain,
      label: 'Precipitation',
      value: `${Math.round(current.precipitationProbability)}%`,
      sub: 'Chance in next hour',
    },
  ];

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
      role="list"
      aria-label="Weather details"
    >
      {items.map(({ icon: Icon, label, value, sub }) => (
        <div key={label} role="listitem" className="glass-light rounded-2xl p-6 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-mist text-xs font-mono uppercase tracking-wider">
            <Icon size={14} aria-hidden="true" />
            <span>{label}</span>
          </div>
          <div className="text-2xl font-display text-parchment">{value}</div>
          <div className="text-xs text-mist">{sub}</div>
        </div>
      ))}
    </div>
  );
}
