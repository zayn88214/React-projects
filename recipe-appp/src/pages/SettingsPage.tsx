import { Sun, Moon, Laptop } from 'lucide-react';
import { useThemeStore } from '@/store/miscStores';
import { cx } from '@/utils/recipeUtils';

export default function SettingsPage() {
  const { mode, setMode } = useThemeStore();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-semibold mb-8">Settings</h1>

      <section className="card-surface p-5 mb-6">
        <h2 className="font-semibold mb-3">Appearance</h2>
        <div className="grid grid-cols-3 gap-3">
          {([
            { key: 'light', label: 'Light', icon: Sun },
            { key: 'dark', label: 'Dark', icon: Moon },
            { key: 'system', label: 'System', icon: Laptop },
          ] as const).map((opt) => (
            <button
              key={opt.key}
              onClick={() => setMode(opt.key)}
              className={cx(
                'flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium',
                mode === opt.key ? 'border-saffron-500 bg-saffron-50 dark:bg-saffron-500/10' : 'border-ink-300/40 dark:border-cream-100/15'
              )}
            >
              <opt.icon size={20} />
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <section className="card-surface p-5">
        <h2 className="font-semibold mb-2">Accessibility</h2>
        <p className="text-sm text-ink-500 dark:text-cream-300">
          Simmer respects your operating system's reduced-motion preference automatically, uses
          semantic landmarks and labelled controls throughout, and maintains visible keyboard
          focus states on every interactive element.
        </p>
      </section>
    </div>
  );
}
