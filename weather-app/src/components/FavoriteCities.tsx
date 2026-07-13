import { Star, Clock, X } from 'lucide-react';
import type { GeoLocation } from '../types/weather';

interface Props {
  favorites: GeoLocation[];
  recents: GeoLocation[];
  currentId: number | undefined;
  onSelect: (loc: GeoLocation) => void;
  onToggleFavorite: (loc: GeoLocation) => void;
  onRemoveRecent: (loc: GeoLocation) => void;
  isFavorite: (loc: GeoLocation) => boolean;
}

export default function FavoriteCities({ favorites, recents, currentId, onSelect, onToggleFavorite, onRemoveRecent, isFavorite }: Props) {
  const recentsFiltered = recents.filter((r) => !favorites.some((f) => f.id === r.id)).slice(0, 5);

  if (favorites.length === 0 && recentsFiltered.length === 0) return null;

  return (
    <div className="space-y-4">
      {favorites.length > 0 && (
        <div>
          <h2 className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-mist mb-2 px-1">
            <Star size={13} aria-hidden="true" /> Favorites
          </h2>
          <ul className="space-y-1.5">
            {favorites.map((f) => (
              <CityRow
                key={f.id}
                loc={f}
                active={f.id === currentId}
                onSelect={onSelect}
                onToggleFavorite={onToggleFavorite}
                favorited
              />
            ))}
          </ul>
        </div>
      )}
      {recentsFiltered.length > 0 && (
        <div>
          <h2 className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-mist mb-2 px-1">
            <Clock size={13} aria-hidden="true" /> Recent
          </h2>
          <ul className="space-y-1.5">
            {recentsFiltered.map((r) => (
              <CityRow
                key={r.id}
                loc={r}
                active={r.id === currentId}
                onSelect={onSelect}
                onToggleFavorite={onToggleFavorite}
                onRemove={() => onRemoveRecent(r)}
                favorited={isFavorite(r)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function CityRow({
  loc, active, onSelect, onToggleFavorite, onRemove, favorited,
}: {
  loc: GeoLocation;
  active: boolean;
  onSelect: (loc: GeoLocation) => void;
  onToggleFavorite: (loc: GeoLocation) => void;
  onRemove?: () => void;
  favorited: boolean;
}) {
  return (
    <li>
      <div className={`group flex items-center gap-1 rounded-xl px-3 py-2 transition-colors ${active ? 'bg-white/12' : 'hover:bg-white/6'}`}>
        <button
          type="button"
          onClick={() => onSelect(loc)}
          className="flex-1 text-left text-sm text-parchment truncate"
        >
          {loc.name}
          <span className="text-mist">{loc.country ? `, ${loc.country}` : ''}</span>
        </button>
        <button
          type="button"
          onClick={() => onToggleFavorite(loc)}
          aria-label={favorited ? `Remove ${loc.name} from favorites` : `Add ${loc.name} to favorites`}
          aria-pressed={favorited}
          className="p-2.5 -m-1 rounded-full text-mist hover:text-brass-400 opacity-70 group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Star size={15} fill={favorited ? 'currentColor' : 'none'} className={favorited ? 'text-brass-400' : ''} />
        </button>
        {onRemove && (
          <RemoveFavoriteButton onRemove={onRemove} label={`Remove ${loc.name} from recent searches`} />
        )}
      </div>
    </li>
  );
}

function RemoveFavoriteButton({ onRemove, label }: { onRemove: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={label}
      className="p-2.5 -m-1 rounded-full text-mist hover:text-parchment opacity-70 group-hover:opacity-100 focus-visible:opacity-100"
    >
      <X size={14} />
    </button>
  );
}
