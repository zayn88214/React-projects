import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useToastStore } from '@/store/toastStore';

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const COLORS = {
  success: 'bg-basil-600 text-cream-50',
  error: 'bg-brick-500 text-cream-50',
  info: 'bg-ink-900 text-cream-50',
};

export function ToastViewport() {
  const { toasts, dismissToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)] sm:w-auto">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.variant];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
              className={`flex items-center gap-2 rounded-xl px-4 py-3 shadow-card text-sm font-medium ${COLORS[toast.variant]}`}
              role="status"
            >
              <Icon size={18} className="shrink-0" />
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="opacity-70 hover:opacity-100"
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
