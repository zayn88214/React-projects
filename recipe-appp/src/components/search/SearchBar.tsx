import { useEffect, useRef, useState } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchHistoryStore } from '@/store/miscStores';
import { recipeApi } from '@/api/recipeApi';
import { Recipe } from '@/types/recipe';

const TRENDING = ['Pasta', 'Tacos', 'Curry', 'Salad', 'Ramen', 'Pancakes'];

export function SearchBar({
  initialValue = '',
  onSearch,
  autoFocus = false,
}: {
  initialValue?: string;
  onSearch: (query: string) => void;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Recipe[]>([]);
  const debounced = useDebounce(value, 300);
  const { queries, addQuery, removeQuery, clear } = useSearchHistoryStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    if (debounced.trim().length > 1) {
      recipeApi.searchByName(debounced.trim()).then((res) => {
        if (active) setSuggestions(res.slice(0, 6));
      });
    } else {
      setSuggestions([]);
    }
    return () => {
      active = false;
    };
  }, [debounced]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const runSearch = (q: string) => {
    if (!q.trim()) return;
    addQuery(q.trim());
    setFocused(false);
    onSearch(q.trim());
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(value);
        }}
        className="relative"
      >
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" />
        <input
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search by name, ingredient, or cuisine…"
          aria-label="Search recipes"
          className="input !pl-12 !pr-12 !py-4 !rounded-full text-base shadow-card"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue('');
              setSuggestions([]);
            }}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-900"
          >
            <X size={18} />
          </button>
        )}
      </form>

      {focused && (
        <div className="absolute mt-2 w-full card-surface p-3 z-30 max-h-96 overflow-y-auto">
          {suggestions.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide px-2 mb-1">Suggestions</p>
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => runSearch(s.title)}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-ink-900/5 dark:hover:bg-cream-100/10 text-left"
                >
                  <img src={s.image} alt="" className="w-9 h-9 rounded-lg object-cover" />
                  <span className="text-sm">{s.title}</span>
                </button>
              ))}
            </div>
          )}

          {queries.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between px-2 mb-1">
                <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Recent searches</p>
                <button onClick={clear} className="text-xs text-saffron-600 hover:underline">
                  Clear
                </button>
              </div>
              {queries.map((q) => (
                <div
                  key={q}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-ink-900/5 dark:hover:bg-cream-100/10"
                >
                  <Clock size={14} className="text-ink-500 shrink-0" />
                  <button onClick={() => runSearch(q)} className="text-sm flex-1 text-left">
                    {q}
                  </button>
                  <button onClick={() => removeQuery(q)} aria-label={`Remove ${q}`}>
                    <X size={13} className="text-ink-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide px-2 mb-1">Trending</p>
            <div className="flex flex-wrap gap-2 px-2">
              {TRENDING.map((t) => (
                <button
                  key={t}
                  onClick={() => runSearch(t)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-saffron-50 text-saffron-700 dark:bg-saffron-500/15 dark:text-saffron-300 hover:bg-saffron-100"
                >
                  <TrendingUp size={12} /> {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
