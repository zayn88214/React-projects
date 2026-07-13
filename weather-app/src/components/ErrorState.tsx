import { AlertTriangle, WifiOff, Clock, KeyRound, SearchX, CloudOff } from 'lucide-react';
import type { AppStatus } from '../types/weather';

interface Props {
  status: AppStatus;
  message?: string | null;
  onRetry?: () => void;
  citySearched?: string;
}

const CONFIG: Partial<Record<AppStatus, { icon: typeof AlertTriangle; title: string; body: (msg?: string) => string }>> = {
  'network-error': {
    icon: WifiOff,
    title: 'Connection trouble',
    body: () => 'We could not reach the weather service. Check your connection and try again.',
  },
  'rate-limited': {
    icon: Clock,
    title: 'Too many requests',
    body: () => 'The weather service is briefly rate-limiting requests. Please wait a moment and retry.',
  },
  'missing-key': {
    icon: KeyRound,
    title: 'API key missing',
    body: () => 'A required API key is not configured. See the README for setup instructions.',
  },
  'invalid-city': {
    icon: SearchX,
    title: 'City not found',
    body: (msg) => msg ? msg : `We couldn't find that city. Try a different spelling or a nearby larger city.`,
  },
  'no-forecast': {
    icon: CloudOff,
    title: 'No forecast available',
    body: () => 'This location does not have forecast data available right now.',
  },
};

export default function ErrorState({ status, message, onRetry, citySearched }: Props) {
  const cfg = CONFIG[status] ?? CONFIG['network-error']!;
  const Icon = cfg.icon;

  return (
    <div
      role="alert"
      className="glass-light rounded-2xl p-8 flex flex-col items-center text-center gap-3 max-w-md mx-auto"
    >
      <Icon size={32} className="text-brass-400" aria-hidden="true" />
      <h2 className="font-display text-xl text-parchment">{cfg.title}</h2>
      <p className="text-sm text-mist">
        {citySearched ? `"${citySearched}" — ` : ''}
        {cfg.body(message ?? undefined)}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 px-5 py-2 rounded-full bg-brass-500 text-ink-950 text-sm font-semibold hover:bg-brass-400 transition-colors focus-visible:ring-2 focus-visible:ring-brass-300"
        >
          Try again
        </button>
      )}
    </div>
  );
}
