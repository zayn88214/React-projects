import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Plus, X, Copy, Trash2, ShoppingCart, CalendarDays } from 'lucide-react';
import { useMealPlannerStore } from '@/store/mealPlannerStore';
import { useShoppingListStore } from '@/store/shoppingListStore';
import { useToastStore } from '@/store/toastStore';
import { recipeApi } from '@/api/recipeApi';
import { Modal } from '@/components/common/Modal';
import { ConfirmDialog } from '@/components/common/States';
import { MealSlot, PlannedMeal } from '@/types/recipe';
import { useDebounce } from '@/hooks/useDebounce';

const SLOTS: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snacks'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function MealPlannerPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const { plan, addMeal, removeMeal, moveMeal, clearWeek, duplicateWeek } = useMealPlannerStore();
  const addIngredients = useShoppingListStore((s) => s.addIngredients);
  const showToast = useToastStore((s) => s.showToast);

  const [pickerSlot, setPickerSlot] = useState<{ date: string; slot: MealSlot } | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [dragging, setDragging] = useState<{ date: string; slot: MealSlot; mealId: string } | null>(null);

  const weekStart = useMemo(() => {
    const base = startOfWeek(new Date());
    base.setDate(base.getDate() + weekOffset * 7);
    return base;
  }, [weekOffset]);

  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return isoDate(d);
    }),
    [weekStart]
  );

  const generateShoppingList = async () => {
    const recipeIds = new Set<string>();
    weekDates.forEach((date) => {
      SLOTS.forEach((slot) => {
        (plan[date]?.[slot] || []).forEach((m) => m.recipeId && recipeIds.add(m.recipeId));
      });
    });
    if (recipeIds.size === 0) {
      showToast('No recipes planned this week yet', 'info');
      return;
    }
    const recipes = await Promise.all([...recipeIds].map((id) => recipeApi.getById(id)));
    recipes.forEach((r) => r && addIngredients(r.ingredients));
    showToast('Shopping list updated from this week\'s plan', 'success');
  };

  const duplicateToNextWeek = () => {
    const nextStart = new Date(weekStart);
    nextStart.setDate(nextStart.getDate() + 7);
    const nextDates = weekDates.map((_, i) => {
      const d = new Date(nextStart);
      d.setDate(d.getDate() + i);
      return isoDate(d);
    });
    duplicateWeek(weekDates, nextDates);
    showToast('Week duplicated to next week', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold flex items-center gap-2">
            <CalendarDays className="text-saffron-600" size={26} /> Meal Planner
          </h1>
          <p className="text-ink-500 dark:text-cream-300">Drag recipes between days, or add a meal to any slot.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline !px-2" onClick={() => setWeekOffset((w) => w - 1)} aria-label="Previous week">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium w-40 text-center">
            {weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} –{' '}
            {new Date(weekDates[6]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
          <button className="btn-outline !px-2" onClick={() => setWeekOffset((w) => w + 1)} aria-label="Next week">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button className="btn-outline" onClick={generateShoppingList}>
          <ShoppingCart size={15} /> Generate shopping list
        </button>
        <button className="btn-outline" onClick={duplicateToNextWeek}>
          <Copy size={15} /> Duplicate to next week
        </button>
        <button className="btn-outline" onClick={() => setConfirmClear(true)}>
          <Trash2 size={15} /> Clear week
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDates.map((date, i) => (
          <div key={date} className="card-surface p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-cream-300 mb-2">
              {DAY_LABELS[i]} · {new Date(date).getDate()}
            </p>
            <div className="space-y-3">
              {SLOTS.map((slot) => (
                <div
                  key={slot}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragging) {
                      moveMeal(dragging.date, dragging.slot, date, slot, dragging.mealId);
                      setDragging(null);
                    }
                  }}
                  className="min-h-16 rounded-xl bg-ink-900/[0.03] dark:bg-cream-100/5 p-2"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-500 dark:text-cream-300">
                      {slot}
                    </span>
                    <button
                      onClick={() => setPickerSlot({ date, slot })}
                      aria-label={`Add ${slot} on ${date}`}
                      className="text-ink-500 hover:text-saffron-600"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {(plan[date]?.[slot] || []).map((meal) => (
                      <div
                        key={meal.id}
                        draggable
                        onDragStart={() => setDragging({ date, slot, mealId: meal.id })}
                        className="flex items-center gap-1.5 bg-cream-50 dark:bg-surface-darkcard rounded-lg px-2 py-1.5 text-xs cursor-grab active:cursor-grabbing shadow-sm"
                      >
                        {meal.recipeImage && (
                          <img src={meal.recipeImage} alt="" className="w-6 h-6 rounded object-cover shrink-0" />
                        )}
                        <span className="flex-1 truncate">{meal.recipeTitle}</span>
                        <button onClick={() => removeMeal(date, slot, meal.id)} aria-label="Remove meal">
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {pickerSlot && (
        <MealPickerModal
          isOpen={!!pickerSlot}
          onClose={() => setPickerSlot(null)}
          onPick={(meal) => {
            addMeal(pickerSlot.date, pickerSlot.slot, meal);
            setPickerSlot(null);
          }}
        />
      )}

      <ConfirmDialog
        isOpen={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={() => clearWeek(weekDates)}
        title="Clear this week's plan?"
        description="All meals scheduled this week will be removed."
        confirmLabel="Clear week"
      />
    </div>
  );
}

function MealPickerModal({
  isOpen,
  onClose,
  onPick,
}: {
  isOpen: boolean;
  onClose: () => void;
  onPick: (meal: Omit<PlannedMeal, 'id' | 'slot'>) => void;
}) {
  const [query, setQuery] = useState('');
  const [customName, setCustomName] = useState('');
  const debounced = useDebounce(query, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['meal-picker', debounced],
    queryFn: () => recipeApi.searchByName(debounced),
    enabled: debounced.length > 1,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add a meal" size="md">
      <input
        className="input mb-3"
        placeholder="Search recipes…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <div className="max-h-64 overflow-y-auto space-y-1 mb-4">
        {isLoading && <p className="text-sm text-ink-500">Searching…</p>}
        {(data || []).map((r) => (
          <button
            key={r.id}
            onClick={() => onPick({ recipeId: r.id, recipeTitle: r.title, recipeImage: r.image })}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-ink-900/5 dark:hover:bg-cream-100/10 text-left"
          >
            <img src={r.image} alt="" className="w-9 h-9 rounded-lg object-cover" />
            <span className="text-sm">{r.title}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-2 border-t border-ink-900/10 dark:border-cream-100/10 pt-3">
        <input
          className="input"
          placeholder="Or add a custom meal…"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
        />
        <button
          className="btn-primary shrink-0"
          onClick={() => {
            if (!customName.trim()) return;
            onPick({ recipeTitle: customName.trim(), isCustom: true });
            setCustomName('');
          }}
        >
          Add
        </button>
      </div>
    </Modal>
  );
}
