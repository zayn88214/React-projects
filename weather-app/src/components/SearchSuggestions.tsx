import { MapPin } from 'lucide-react';
import type { GeoLocation } from '../types/weather';

interface Props {
  suggestions: GeoLocation[];
  activeIndex: number;
  onSelect: (loc: GeoLocation) => void;
  visible: boolean;
  loading: boolean;
  emptyQuery: boolean;
}

export default function SearchSuggestions({ suggestions, activeIndex, onSelect, visible, loading, emptyQuery }: Props) {
  if (!visible) return null;

  return (
    <ul
      id="search-suggestions"
      role="listbox"
      aria-label="City suggestions"
      className="absolute left-0 right-0 top-full mt-2 glass rounded-2xl overflow-hidden shadow-2xl z-20 max-h-80 overflow-y-auto scrollbar-thin"
    >
      {loading && (
        <li className="px-4 py-3 text-sm text-mist" aria-live="polite">Searching…</li>
      )}
      {!loading && emptyQuery && (
        <li className="px-4 py-3 text-sm text-mist">Type a city name to search.</li>
      )}
      {!loading && !emptyQuery && suggestions.length === 0 && (
        <li className="px-4 py-3 text-sm text-mist">No cities found. Try a different spelling.</li>
      )}
      {!loading &&
        suggestions.map((s, i) => (
          <li key={s.id} role="option" aria-selected={i === activeIndex}>
            <button
              type="button"
              onClick={() => onSelect(s)}
              className={`w-full text-left px-4 py-3 flex items-center gap-2.5 text-sm transition-colors ${
                i === activeIndex ? 'bg-white/10 text-parchment' : 'text-parchment/90 hover:bg-white/5'
              }`}
            >
              <MapPin size={15} className="text-brass-400 shrink-0" aria-hidden="true" />
              <span>
                {s.name}
                {s.admin1 ? `, ${s.admin1}` : ''}
                <span className="text-mist">{s.country ? `, ${s.country}` : ''}</span>
              </span>
            </button>
          </li>
        ))}
    </ul>
  );
}
