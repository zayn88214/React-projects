import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { WeatherData, TemperatureUnit } from '../types/weather';
import { formatTemp } from '../utils/units';
import { formatLocalDateLong, formatLocalTime } from '../utils/date';
import { weatherIcon } from '../utils/weatherIcon';

interface Props {
  data: WeatherData;
  unit: TemperatureUnit;
}

export default function CurrentWeather({ data, unit }: Props) {
  const { location, current, timezone, localTimeIso, daily } = data;
  const Icon = weatherIcon(current.weather.category, current.weather.isDay);
  const today = daily[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-parchment"
      aria-label="Current weather"
    >
      <div className="flex items-center gap-1.5 text-mist text-sm font-mono uppercase tracking-wider mb-1">
        <MapPin size={14} aria-hidden="true" />
        <span>
          {location.name}
          {location.admin1 ? `, ${location.admin1}` : ''}
          {location.country ? `, ${location.country}` : ''}
        </span>
      </div>
      <div className="text-sm text-mist mb-6">
        {formatLocalDateLong(localTimeIso, timezone)} · {formatLocalTime(localTimeIso, timezone)} local time
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        <div className="flex items-center gap-4">
          <Icon size={92} strokeWidth={1.25} className="text-brass-300 shrink-0" aria-hidden="true" />
          <div>
            <div className="font-display font-semibold leading-none text-[6rem] sm:text-[7rem] tracking-tight">
              {formatTemp(current.temperature, unit)}
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-display">{current.weather.description}</div>
          <div className="text-mist text-sm">
            Feels like {formatTemp(current.feelsLike, unit)} · H:{formatTemp(today.tempMax, unit)} L:{formatTemp(today.tempMin, unit)}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
