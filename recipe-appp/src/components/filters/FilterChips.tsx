import { X } from 'lucide-react';
import { RecipeFilters } from '@/types/recipe';

export function FilterChips({
  filters,
  onChange,
}: {
  filters: RecipeFilters;
  onChange: (filters: RecipeFilters) => void;
}) {
  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  filters.cuisine?.forEach((c) =>
    chips.push({ key: `cuisine-${c}`, label: c, onRemove: () => onChange({ ...filters, cuisine: filters.cuisine!.filter((x) => x !== c) }) })
  );
  filters.category?.forEach((c) =>
    chips.push({ key: `category-${c}`, label: c, onRemove: () => onChange({ ...filters, category: filters.category!.filter((x) => x !== c) }) })
  );
  filters.mealType?.forEach((c) =>
    chips.push({ key: `meal-${c}`, label: c, onRemove: () => onChange({ ...filters, mealType: filters.mealType!.filter((x) => x !== c) }) })
  );
  filters.diet?.forEach((c) =>
    chips.push({ key: `diet-${c}`, label: c, onRemove: () => onChange({ ...filters, diet: filters.diet!.filter((x) => x !== c) }) })
  );
  filters.difficulty?.forEach((c) =>
    chips.push({ key: `diff-${c}`, label: c, onRemove: () => onChange({ ...filters, difficulty: filters.difficulty!.filter((x) => x !== c) }) })
  );
  if (filters.maxCookTime) chips.push({ key: 'cook', label: `≤ ${filters.maxCookTime} min`, onRemove: () => onChange({ ...filters, maxCookTime: undefined }) });
  if (filters.maxCalories) chips.push({ key: 'cal', label: `≤ ${filters.maxCalories} cal`, onRemove: () => onChange({ ...filters, maxCalories: undefined }) });
  if (filters.minRating) chips.push({ key: 'rating', label: `${filters.minRating}+ stars`, onRemove: () => onChange({ ...filters, minRating: undefined }) });
  filters.includeIngredients?.forEach((i) =>
    chips.push({ key: `inc-${i}`, label: `+ ${i}`, onRemove: () => onChange({ ...filters, includeIngredients: filters.includeIngredients!.filter((x) => x !== i) }) })
  );
  filters.excludeIngredients?.forEach((i) =>
    chips.push({ key: `exc-${i}`, label: `– ${i}`, onRemove: () => onChange({ ...filters, excludeIngredients: filters.excludeIngredients!.filter((x) => x !== i) }) })
  );

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="flex items-center gap-1.5 text-xs font-medium bg-saffron-50 text-saffron-700 dark:bg-saffron-500/15 dark:text-saffron-300 px-3 py-1.5 rounded-full"
        >
          {chip.label}
          <button onClick={chip.onRemove} aria-label={`Remove ${chip.label} filter`}>
            <X size={12} />
          </button>
        </span>
      ))}
      <button onClick={() => onChange({})} className="text-xs font-medium text-brick-500 hover:underline ml-1">
        Clear all
      </button>
    </div>
  );
}
