import { Sunrise, Sunset } from 'lucide-react';
import { dayProgress, formatLocalTime } from '../utils/date';

interface Props {
  nowIso: string;
  sunriseIso: string;
  sunsetIso: string;
  timezone: string;
}

export default function SunProgress({ nowIso, sunriseIso, sunsetIso, timezone }: Props) {
  const progress = dayProgress(nowIso, sunriseIso, sunsetIso);
  const angle = 180 * progress;
  const rad = (Math.PI / 180) * (180 - angle);
  const cx = 100, cy = 90, r = 74;
  const sunX = cx + r * Math.cos(rad);
  const sunY = cy - r * Math.sin(rad);
  const isDaytime = progress > 0 && progress < 1;

  return (
    <div className="glass-light rounded-2xl p-6" role="group" aria-label="Sunrise and sunset progress">
      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-mist mb-2">
        <span>Sun Path</span>
        <span>{isDaytime ? `${Math.round(progress * 100)}% of daylight` : 'Nighttime'}</span>
      </div>
      <svg viewBox="0 0 200 100" className="w-full h-auto" aria-hidden="true">
        <path d="M 26 90 A 74 74 0 0 1 174 90" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeDasharray="1 6" strokeLinecap="round" />
        {isDaytime && (
          <circle cx={sunX} cy={sunY} r="6" fill="#e6c273" className="motion-safe:animate-glow" />
        )}
        <circle cx="26" cy="90" r="2.5" fill="#9fb3c8" />
        <circle cx="174" cy="90" r="2.5" fill="#9fb3c8" />
      </svg>
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-2 text-parchment">
          <Sunrise size={16} className="text-brass-400" aria-hidden="true" />
          <span className="text-sm font-mono">{formatLocalTime(sunriseIso, timezone)}</span>
        </div>
        <div className="flex items-center gap-2 text-parchment">
          <span className="text-sm font-mono">{formatLocalTime(sunsetIso, timezone)}</span>
          <Sunset size={16} className="text-brass-400" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
