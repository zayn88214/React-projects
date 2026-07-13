import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Heart, BookMarked, ShoppingCart, CalendarDays, User, Menu, X, Soup, Sun, Moon, Laptop,
} from 'lucide-react';
import { Dropdown } from '@/components/common/Interactive';
import { useThemeStore } from '@/store/miscStores';
import { cx } from '@/utils/recipeUtils';

const NAV_LINKS = [
  { to: '/search', label: 'Search', icon: Search },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/collections', label: 'Collections', icon: BookMarked },
  { to: '/shopping-list', label: 'Shopping List', icon: ShoppingCart },
  { to: '/meal-planner', label: 'Meal Planner', icon: CalendarDays },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { mode, setMode } = useThemeStore();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-cream-100/85 dark:bg-surface-dark/85 backdrop-blur border-b border-ink-900/5 dark:border-cream-100/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0 font-display text-xl font-semibold">
          <span className="w-8 h-8 rounded-full bg-saffron-500 flex items-center justify-center text-ink-900">
            <Soup size={18} />
          </span>
          Simmer
        </Link>

        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-ink-700 dark:text-cream-200 hover:bg-ink-900/5 dark:hover:bg-cream-100/10"
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-sm relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes, ingredients…"
            aria-label="Search recipes"
            className="input !pl-9"
          />
        </form>

        <div className="flex items-center gap-2 ml-auto">
          <Dropdown
            label="Theme"
            trigger={mode === 'dark' ? <Moon size={16} /> : mode === 'light' ? <Sun size={16} /> : <Laptop size={16} />}
          >
            {(['light', 'dark', 'system'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cx(
                  'w-full text-left px-3 py-2 rounded-lg text-sm capitalize hover:bg-ink-900/5 dark:hover:bg-cream-100/10',
                  mode === m && 'bg-saffron-100 text-saffron-700 dark:text-saffron-300'
                )}
              >
                {m}
              </button>
            ))}
          </Dropdown>
          <Link to="/profile" className="btn-ghost !px-2 hidden sm:inline-flex" aria-label="Profile">
            <User size={18} />
          </Link>
          <button
            className="lg:hidden btn-ghost !px-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-cream-100 dark:bg-surface-dark lg:hidden"
        >
          <div className="flex items-center justify-between px-4 h-16 border-b border-ink-900/5">
            <span className="font-display text-lg font-semibold">Menu</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="btn-ghost !px-2">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={submitSearch} className="p-4 relative">
            <Search size={16} className="absolute left-7 top-1/2 -translate-y-1/2 text-ink-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search recipes…"
              className="input !pl-9"
              autoFocus
            />
          </form>
          <nav className="flex flex-col p-4 gap-1">
            {[...NAV_LINKS, { to: '/profile', label: 'Profile', icon: User }].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium hover:bg-ink-900/5 dark:hover:bg-cream-100/10"
              >
                <link.icon size={20} />
                {link.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
