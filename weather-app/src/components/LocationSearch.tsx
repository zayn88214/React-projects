import { useEffect, useRef, useState } from 'react';
import { Search, X, LocateFixed, Clock } from 'lucide-react';
import type { GeoLocation } from '../types/weather';
import { searchCities, GeocodingError } from '../services/geocoding';
import { useDebounce } from '../hooks/useDebounce';
import SearchSuggestions from './SearchSuggestions';

interface Props {
  onSelect: (loc: GeoLocation) => void;
  recents?: GeoLocation[];
  onUseCurrentLocation?: () => void;
  locatingCurrent?: boolean;
}

export default function LocationSearch({ onSelect, recents = [], onUseCurrentLocation, locatingCurrent }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 350);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    searchCities(debouncedQuery, controller.signal)
      .then((results) => {
        setSuggestions(results);
        setActiveIndex(-1);
      })
      .catch((err) => {
        if (err instanceof GeocodingError || (err instanceof DOMException && err.name !== 'AbortError')) {
          setSuggestions([]);
        }
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(loc: GeoLocation) {
    onSelect(loc);
    setQuery('');
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-mist" aria-hidden="true" />
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
          aria-label="Search for a city"
          placeholder="Search for a city…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full glass rounded-full pl-11 pr-10 py-3 text-sm text-parchment placeholder:text-mist focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-400"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setSuggestions([]); }}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-mist hover:text-parchment p-2.5 rounded-full focus-visible:text-parchment"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {open && query.trim().length === 0 && (onUseCurrentLocation || recents.length > 0) && (
        <ul
          role="listbox"
          aria-label="Quick location actions"
          className="absolute left-0 right-0 top-full mt-2 glass rounded-2xl overflow-hidden shadow-2xl z-20 max-h-80 overflow-y-auto scrollbar-thin"
        >
          {onUseCurrentLocation && (
            <li role="option" aria-selected="false">
              <button
                type="button"
                onClick={() => {
                  onUseCurrentLocation();
                  setOpen(false);
                }}
                disabled={locatingCurrent}
                className="w-full text-left px-4 py-3 flex items-center gap-2.5 text-sm text-parchment/90 hover:bg-white/5 transition-colors disabled:opacity-60"
              >
                <LocateFixed size={15} className={`text-brass-400 shrink-0 ${locatingCurrent ? 'motion-safe:animate-glow' : ''}`} aria-hidden="true" />
                <span>{locatingCurrent ? 'Locating…' : 'Use current location'}</span>
              </button>
            </li>
          )}
          {recents.slice(0, 5).map((r) => (
            <li key={r.id} role="option" aria-selected="false">
              <button
                type="button"
                onClick={() => handleSelect(r)}
                className="w-full text-left px-4 py-3 flex items-center gap-2.5 text-sm text-parchment/90 hover:bg-white/5 transition-colors"
              >
                <Clock size={15} className="text-mist shrink-0" aria-hidden="true" />
                <span>
                  {r.name}
                  <span className="text-mist">{r.country ? `, ${r.country}` : ''}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <SearchSuggestions
        suggestions={suggestions}
        activeIndex={activeIndex}
        onSelect={handleSelect}
        visible={open && query.trim().length > 0}
        loading={loading}
        emptyQuery={false}
      />
    </div>
  );
}
