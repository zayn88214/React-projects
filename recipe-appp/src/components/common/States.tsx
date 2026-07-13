import { ReactNode } from 'react';
import { Modal } from './Modal';
import { AlertTriangle, ChefHat, RefreshCcw } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  danger = true,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex gap-3 items-start mb-5">
        <AlertTriangle className="text-brick-500 shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-ink-700 dark:text-cream-200">{description}</p>
      </div>
      <div className="flex justify-end gap-2">
        <button className="btn-outline" onClick={onClose}>Cancel</button>
        <button
          className={danger ? 'btn bg-brick-500 text-cream-50 hover:bg-brick-600' : 'btn-primary'}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export function SkeletonCard() {
  return (
    <div className="card-surface overflow-hidden animate-pulse">
      <div className="h-44 bg-ink-900/10 dark:bg-cream-100/10" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-ink-900/10 dark:bg-cream-100/10 rounded w-3/4" />
        <div className="h-3 bg-ink-900/10 dark:bg-cream-100/10 rounded w-1/2" />
        <div className="h-3 bg-ink-900/10 dark:bg-cream-100/10 rounded w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-4">
      <div className="w-14 h-14 rounded-full bg-saffron-100 flex items-center justify-center mb-4 text-saffron-600">
        {icon || <ChefHat size={26} />}
      </div>
      <h3 className="font-display text-xl font-semibold mb-1">{title}</h3>
      {description && <p className="text-ink-500 dark:text-cream-300 max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-4">
      <div className="w-14 h-14 rounded-full bg-brick-100 flex items-center justify-center mb-4 text-brick-500">
        <AlertTriangle size={26} />
      </div>
      <h3 className="font-display text-xl font-semibold mb-1">Something went wrong</h3>
      <p className="text-ink-500 dark:text-cream-300 max-w-sm mb-4">
        {message || "We couldn't load recipes right now."}
      </p>
      {onRetry && (
        <button className="btn-primary" onClick={onRetry}>
          <RefreshCcw size={16} /> Try again
        </button>
      )}
    </div>
  );
}
