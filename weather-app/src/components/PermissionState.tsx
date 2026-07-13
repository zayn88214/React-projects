import { LocateFixed, MapPinOff } from 'lucide-react';

interface Props {
  variant: 'requesting' | 'denied';
  onRequest: () => void;
  onUseDefault: () => void;
}

export default function PermissionState({ variant, onRequest, onUseDefault }: Props) {
  return (
    <div className="glass-light rounded-2xl p-8 flex flex-col items-center text-center gap-3 max-w-md mx-auto" role="status">
      {variant === 'requesting' ? (
        <>
          <LocateFixed size={32} className="text-brass-400 motion-safe:animate-glow" aria-hidden="true" />
          <h2 className="font-display text-xl text-parchment">Finding your location</h2>
          <p className="text-sm text-mist">Allow location access in your browser to see weather for where you are.</p>
          <button
            type="button"
            onClick={onUseDefault}
            className="mt-2 px-5 py-2 rounded-full glass text-sm text-parchment hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-brass-300"
          >
            Use a default city instead
          </button>
        </>
      ) : (
        <>
          <MapPinOff size={32} className="text-brass-400" aria-hidden="true" />
          <h2 className="font-display text-xl text-parchment">Location access denied</h2>
          <p className="text-sm text-mist">
            No problem — search for a city above, or we can show weather for a default location.
          </p>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={onRequest}
              className="px-5 py-2 rounded-full bg-brass-500 text-ink-950 text-sm font-semibold hover:bg-brass-400 transition-colors focus-visible:ring-2 focus-visible:ring-brass-300"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={onUseDefault}
              className="px-5 py-2 rounded-full glass text-sm text-parchment hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-brass-300"
            >
              Use default city
            </button>
          </div>
        </>
      )}
    </div>
  );
}
