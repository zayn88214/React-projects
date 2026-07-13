import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ToastViewport } from '@/components/common/Toast';
import { useAppliedTheme } from '@/hooks/useAppliedTheme';

export function AppLayout() {
  useAppliedTheme();
  return (
    <div className="min-h-screen flex flex-col dark:bg-surface-dark">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[999] focus:bg-saffron-500 focus:text-ink-900 focus:px-4 focus:py-2 focus:rounded-full"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastViewport />
    </div>
  );
}
