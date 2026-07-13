import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { HourlyPoint, TemperatureUnit } from '../types/weather';
import { convertTemp } from '../utils/units';
import { formatHourLabel } from '../utils/date';

interface Props {
  hourly: HourlyPoint[];
  timezone: string;
  unit: TemperatureUnit;
}

export default function ForecastChart({ hourly, timezone, unit }: Props) {
  const chartData = hourly.slice(0, 24).map((h) => ({
    time: formatHourLabel(h.time, timezone),
    temp: Math.round(convertTemp(h.temperature, unit)),
    precip: h.precipitationProbability,
  }));

  return (
    <section aria-label="Temperature trend chart" className="glass-light rounded-2xl p-6">
      <h2 className="text-xs font-mono uppercase tracking-wider text-mist mb-3 px-1">Temperature Trend</h2>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e6c273" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#e6c273" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="time"
              interval={2}
              tick={{ fill: '#9fb3c8', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#9fb3c8', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
              axisLine={false}
              tickLine={false}
              width={36}
              unit="°"
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(14,21,36,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                fontSize: 12,
                fontFamily: 'Inter',
              }}
              labelStyle={{ color: '#f2ede1' }}
              formatter={(value, name) =>
                name === 'temp' ? [`${value}°`, 'Temperature'] : [`${value}%`, 'Precip.']
              }
            />
            <Area type="monotone" dataKey="temp" stroke="#e6c273" strokeWidth={2} fill="url(#tempGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
