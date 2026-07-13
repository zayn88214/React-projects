import { useMemo, useState } from 'react';
import { ShoppingCart, Plus, Trash2, Printer, Copy, Check } from 'lucide-react';
import { useShoppingListStore } from '@/store/shoppingListStore';
import { useToastStore } from '@/store/toastStore';
import { groupBy, cx } from '@/utils/recipeUtils';
import { EmptyState, ConfirmDialog } from '@/components/common/States';

export default function ShoppingListPage() {
  const { items, addCustomItem, updateAmount, togglePurchased, removeItem, clearPurchased, clearAll } = useShoppingListStore();
  const showToast = useToastStore((s) => s.showToast);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const grouped = useMemo(() => groupBy(items, (i) => i.category), [items]);
  const purchasedCount = items.filter((i) => i.purchased).length;

  const printableText = useMemo(
    () => items.map((i) => `${i.purchased ? '[x]' : '[ ]'} ${i.amount} ${i.name}`).join('\n'),
    [items]
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-3xl font-semibold flex items-center gap-2">
          <ShoppingCart className="text-saffron-600" size={26} /> Shopping List
        </h1>
      </div>
      <p className="text-ink-500 dark:text-cream-300 mb-6">
        {items.length} item{items.length === 1 ? '' : 's'} · {purchasedCount} purchased
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          addCustomItem(name.trim(), amount.trim() || '1');
          setName('');
          setAmount('');
        }}
        className="flex gap-2 mb-6"
      >
        <input className="input flex-1" placeholder="Add item…" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input w-28" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button className="btn-primary shrink-0" type="submit">
          <Plus size={16} />
        </button>
      </form>

      {items.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart size={24} />}
          title="Your shopping list is empty"
          description="Add ingredients from any recipe, or add custom items above."
        />
      ) : (
        <>
          <div className="space-y-6 mb-6">
            {Object.entries(grouped).map(([category, catItems]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-cream-300 mb-2">
                  {category}
                </h3>
                <ul className="space-y-1.5">
                  {catItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 card-surface px-3 py-2.5"
                    >
                      <button
                        onClick={() => togglePurchased(item.id)}
                        aria-label={item.purchased ? 'Mark as not purchased' : 'Mark as purchased'}
                        className={cx(
                          'w-6 h-6 rounded-full flex items-center justify-center shrink-0 border',
                          item.purchased ? 'bg-basil-500 border-basil-500 text-cream-50' : 'border-ink-300/50 dark:border-cream-100/20'
                        )}
                      >
                        {item.purchased && <Check size={13} />}
                      </button>
                      <span className={cx('flex-1 text-sm', item.purchased && 'line-through text-ink-300 dark:text-cream-300/40')}>
                        {item.name}
                      </span>
                      <input
                        value={item.amount}
                        onChange={(e) => updateAmount(item.id, e.target.value)}
                        className="w-24 text-xs bg-transparent border-b border-ink-300/40 dark:border-cream-100/20 text-right font-mono focus:outline-none focus:border-saffron-500"
                        aria-label={`Amount for ${item.name}`}
                      />
                      <button onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}>
                        <Trash2 size={15} className="text-ink-500 hover:text-brick-500" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="btn-outline" onClick={clearPurchased}>Clear purchased</button>
            <button className="btn-outline" onClick={() => setConfirmClear(true)}>Clear all</button>
            <button className="btn-outline" onClick={() => window.print()}>
              <Printer size={15} /> Print
            </button>
            <button
              className="btn-outline"
              onClick={() => {
                navigator.clipboard?.writeText(printableText);
                showToast('Shopping list copied', 'success');
              }}
            >
              <Copy size={15} /> Copy
            </button>
          </div>
        </>
      )}

      <ConfirmDialog
        isOpen={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={clearAll}
        title="Clear entire list?"
        description="This removes every item from your shopping list."
        confirmLabel="Clear all"
      />
    </div>
  );
}
