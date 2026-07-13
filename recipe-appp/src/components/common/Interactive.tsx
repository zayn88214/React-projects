import { useState, useRef, useEffect, ReactNode } from 'react';
import { Star, Heart, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useToastStore } from '@/store/toastStore';
import { cx } from '@/utils/recipeUtils';

export function Rating({ value, count, size = 15 }: { value: number; count?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < Math.round(value) ? 'fill-saffron-500 text-saffron-500' : 'text-ink-300 dark:text-cream-300/30'}
          />
        ))}
      </div>
      <span className="text-xs text-ink-500 dark:text-cream-300 font-mono">
        {value.toFixed(1)}{count !== undefined ? ` (${count})` : ''}
      </span>
    </div>
  );
}

export function InteractiveRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        return (
          <button
            key={i}
            type="button"
            aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}
          >
            <Star
              size={24}
              className={n <= (hover || value) ? 'fill-saffron-500 text-saffron-500' : 'text-ink-300'}
            />
          </button>
        );
      })}
    </div>
  );
}

export function FavoriteButton({ recipeId, className }: { recipeId: string; className?: string }) {
  const isFavorite = useFavoritesStore((s) => s.isFavorite(recipeId));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const showToast = useToastStore((s) => s.showToast);

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
      aria-pressed={isFavorite}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(recipeId);
        showToast(isFavorite ? 'Removed from favorites' : 'Saved to favorites', 'success');
      }}
      className={cx(
        'w-9 h-9 rounded-full flex items-center justify-center bg-cream-50/90 dark:bg-surface-darkcard/90 shadow-card backdrop-blur',
        className
      )}
    >
      <Heart size={17} className={isFavorite ? 'fill-brick-500 text-brick-500' : 'text-ink-700 dark:text-cream-100'} />
    </motion.button>
  );
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
      <button
        className="btn-ghost !px-2"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>
      {pages.map((p, idx) => (
        <span key={p} className="flex items-center">
          {idx > 0 && pages[idx - 1] !== p - 1 && <span className="px-1 text-ink-300">…</span>}
          <button
            className={cx(
              'w-9 h-9 rounded-full text-sm font-medium',
              p === page ? 'bg-saffron-500 text-ink-900' : 'hover:bg-ink-900/5 dark:hover:bg-cream-100/10'
            )}
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        </span>
      ))}
      <button
        className="btn-ghost !px-2"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}

export function Dropdown({
  label,
  children,
  trigger,
}: {
  label: string;
  children: ReactNode;
  trigger?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="btn-outline"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {trigger || label} <ChevronDown size={16} />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 mt-2 w-52 card-surface p-2 z-20"
          role="listbox"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
