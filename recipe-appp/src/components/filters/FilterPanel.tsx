import { RecipeFilters, Difficulty, DietTag } from '@/types/recipe';
import { CUISINES, CATEGORIES, MEAL_TYPES } from '@/api/mockData';
import { cx } from '@/utils/recipeUtils';

const DIET_OPTIONS: DietTag[] = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb', 'High-Protein',
];
const DIFFICULTY_OPTIONS: Difficulty[] = ['Easy', 'Medium', 'Hard'];

interface Props {
  filters: RecipeFilters;
  onChange: (filters: RecipeFilters) => void;
}

function toggleInArray<T>(arr: T[] | undefined, value: T): T[] {
  const list = arr || [];
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-4 border-b border-ink-900/5 dark:border-cream-100/10 last:border-0">
      <h4 className="text-sm font-semibold mb-3">{title}</h4>
      {children}
    </div>
  );
}

function ChipToggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        'text-xs font-medium px-3 py-1.5 rounded-full border transition-colors',
        active
          ? 'bg-saffron-500 border-saffron-500 text-ink-900'
          : 'border-ink-300/50 dark:border-cream-100/20 text-ink-700 dark:text-cream-200 hover:border-saffron-500'
      )}
    >
      {label}
    </button>
  );
}

export function FilterPanel({ filters, onChange }: Props) {
  return (
    <div className="text-sm">
      <Section title="Cuisine">
        <div className="flex flex-wrap gap-2">
          {CUISINES.map((c) => (
            <ChipToggle
              key={c}
              label={c}
              active={!!filters.cuisine?.includes(c)}
              onClick={() => onChange({ ...filters, cuisine: toggleInArray(filters.cuisine, c) })}
            />
          ))}
        </div>
      </Section>

      <Section title="Category">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <ChipToggle
              key={c}
              label={c}
              active={!!filters.category?.includes(c)}
              onClick={() => onChange({ ...filters, category: toggleInArray(filters.category, c) })}
            />
          ))}
        </div>
      </Section>

      <Section title="Meal type">
        <div className="flex flex-wrap gap-2">
          {MEAL_TYPES.map((m) => (
            <ChipToggle
              key={m}
              label={m}
              active={!!filters.mealType?.includes(m)}
              onClick={() => onChange({ ...filters, mealType: toggleInArray(filters.mealType, m) })}
            />
          ))}
        </div>
      </Section>

      <Section title="Dietary preference">
        <div className="flex flex-wrap gap-2">
          {DIET_OPTIONS.map((d) => (
            <ChipToggle
              key={d}
              label={d}
              active={!!filters.diet?.includes(d)}
              onClick={() => onChange({ ...filters, diet: toggleInArray(filters.diet, d) })}
            />
          ))}
        </div>
      </Section>

      <Section title="Difficulty">
        <div className="flex flex-wrap gap-2">
          {DIFFICULTY_OPTIONS.map((d) => (
            <ChipToggle
              key={d}
              label={d}
              active={!!filters.difficulty?.includes(d)}
              onClick={() => onChange({ ...filters, difficulty: toggleInArray(filters.difficulty, d) })}
            />
          ))}
        </div>
      </Section>

      <Section title={`Max cooking time: ${filters.maxCookTime ?? 120} min`}>
        <input
          type="range"
          min={10}
          max={120}
          step={5}
          value={filters.maxCookTime ?? 120}
          onChange={(e) => onChange({ ...filters, maxCookTime: Number(e.target.value) })}
          className="w-full accent-saffron-500"
        />
      </Section>

      <Section title={`Max calories: ${filters.maxCalories ?? 1000}`}>
        <input
          type="range"
          min={100}
          max={1000}
          step={50}
          value={filters.maxCalories ?? 1000}
          onChange={(e) => onChange({ ...filters, maxCalories: Number(e.target.value) })}
          className="w-full accent-saffron-500"
        />
      </Section>

      <Section title={`Max ingredients: ${filters.maxIngredients ?? 20}`}>
        <input
          type="range"
          min={3}
          max={20}
          value={filters.maxIngredients ?? 20}
          onChange={(e) => onChange({ ...filters, maxIngredients: Number(e.target.value) })}
          className="w-full accent-saffron-500"
        />
      </Section>

      <Section title={`Minimum rating: ${filters.minRating ?? 0}+`}>
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={filters.minRating ?? 0}
          onChange={(e) => onChange({ ...filters, minRating: Number(e.target.value) })}
          className="w-full accent-saffron-500"
        />
      </Section>

      <Section title="Included ingredients">
        <IngredientTagInput
          values={filters.includeIngredients || []}
          onChange={(v) => onChange({ ...filters, includeIngredients: v })}
          placeholder="e.g. basil, chicken"
        />
      </Section>

      <Section title="Excluded ingredients">
        <IngredientTagInput
          values={filters.excludeIngredients || []}
          onChange={(v) => onChange({ ...filters, excludeIngredients: v })}
          placeholder="e.g. peanuts, shellfish"
        />
      </Section>

      <button
        className="btn-outline w-full mt-4"
        onClick={() => onChange({})}
      >
        Clear all filters
      </button>
    </div>
  );
}

function IngredientTagInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}) {
  return (
    <div>
      <input
        className="input"
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const v = (e.target as HTMLInputElement).value.trim();
            if (v && !values.includes(v)) onChange([...values, v]);
            (e.target as HTMLInputElement).value = '';
          }
        }}
      />
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {values.map((v) => (
            <span
              key={v}
              className="text-xs bg-ink-900/5 dark:bg-cream-100/10 px-2 py-1 rounded-full flex items-center gap-1"
            >
              {v}
              <button onClick={() => onChange(values.filter((x) => x !== v))} aria-label={`Remove ${v}`}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
