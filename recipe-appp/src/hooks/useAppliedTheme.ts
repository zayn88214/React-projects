import { useEffect } from 'react';
import { useThemeStore } from '@/store/miscStores';

export function useAppliedTheme() {
  const mode = useThemeStore((s) => s.mode);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const apply = (dark: boolean) => {
      root.classList.toggle('dark', dark);
      body.classList.toggle('dark', dark);
    };

    if (mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      apply(mq.matches);
      const listener = (e: MediaQueryListEvent) => apply(e.matches);
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
    apply(mode === 'dark');
  }, [mode]);
}
