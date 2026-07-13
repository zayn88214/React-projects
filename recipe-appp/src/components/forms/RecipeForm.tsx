import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { recipeFormSchema, RecipeFormValues } from '@/validations/schemas';
import { CUISINES, CATEGORIES, MEAL_TYPES } from '@/api/mockData';
import { DietTag } from '@/types/recipe';

const DIET_OPTIONS: DietTag[] = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb', 'High-Protein',
];

interface Props {
  defaultValues?: Partial<RecipeFormValues>;
  onSubmit: (values: RecipeFormValues) => void;
  submitLabel?: string;
  onSaveDraft?: (values: RecipeFormValues) => void;
}

export function RecipeForm({ defaultValues, onSubmit, submitLabel = 'Publish recipe', onSaveDraft }: Props) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: '',
      description: '',
      cuisine: CUISINES[0],
      category: CATEGORIES[0],
      mealType: MEAL_TYPES[0],
      dietTags: [],
      prepTimeMinutes: 15,
      cookTimeMinutes: 20,
      difficulty: 'Easy',
      servings: 4,
      calories: 400,
      equipment: [],
      allergens: [],
      ingredients: [{ name: '', amount: '' }],
      instructions: [{ text: '' }],
      ...defaultValues,
    },
  });

  const ingredientArray = useFieldArray({ control, name: 'ingredients' });
  const stepArray = useFieldArray({ control, name: 'instructions' });
  const dietTags = watch('dietTags');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="card-surface p-5 space-y-4">
        <h2 className="font-display text-lg font-semibold">Basics</h2>
        <Field label="Title" error={errors.title?.message}>
          <input className="input" {...register('title')} />
        </Field>
        <Field label="Description" error={errors.description?.message}>
          <textarea className="input min-h-24" {...register('description')} />
        </Field>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Field label="Cuisine" error={errors.cuisine?.message}>
            <select className="input" {...register('cuisine')}>
              {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Category" error={errors.category?.message}>
            <select className="input" {...register('category')}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Meal type" error={errors.mealType?.message}>
            <select className="input" {...register('mealType')}>
              {MEAL_TYPES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Dietary tags">
          <div className="flex flex-wrap gap-2">
            {DIET_OPTIONS.map((tag) => {
              const active = dietTags?.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() =>
                    setValue(
                      'dietTags',
                      active ? dietTags.filter((t) => t !== tag) : [...(dietTags || []), tag]
                    )
                  }
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border ${
                    active ? 'bg-saffron-500 border-saffron-500 text-ink-900' : 'border-ink-300/50 dark:border-cream-100/20'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </Field>
      </section>

      <section className="card-surface p-5 space-y-4">
        <h2 className="font-display text-lg font-semibold">Details</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <Field label="Prep (min)" error={errors.prepTimeMinutes?.message}>
            <input type="number" className="input" {...register('prepTimeMinutes')} />
          </Field>
          <Field label="Cook (min)" error={errors.cookTimeMinutes?.message}>
            <input type="number" className="input" {...register('cookTimeMinutes')} />
          </Field>
          <Field label="Servings" error={errors.servings?.message}>
            <input type="number" className="input" {...register('servings')} />
          </Field>
          <Field label="Calories" error={errors.calories?.message}>
            <input type="number" className="input" {...register('calories')} />
          </Field>
          <Field label="Difficulty" error={errors.difficulty?.message}>
            <select className="input" {...register('difficulty')}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </Field>
        </div>
      </section>

      <section className="card-surface p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Ingredients</h2>
          <button type="button" className="btn-outline !py-1.5" onClick={() => ingredientArray.append({ name: '', amount: '' })}>
            <Plus size={14} /> Add ingredient
          </button>
        </div>
        {errors.ingredients?.message && <p className="text-xs text-brick-500">{errors.ingredients.message}</p>}
        <div className="space-y-2">
          {ingredientArray.fields.map((field, idx) => (
            <div key={field.id} className="flex gap-2 items-start">
              <GripVertical size={16} className="text-ink-300 mt-2.5 shrink-0" />
              <input className="input flex-1" placeholder="Ingredient" {...register(`ingredients.${idx}.name` as const)} />
              <input className="input w-32" placeholder="Amount" {...register(`ingredients.${idx}.amount` as const)} />
              <button type="button" onClick={() => ingredientArray.remove(idx)} aria-label="Remove ingredient" className="btn-ghost !px-2 mt-1">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="card-surface p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Instructions</h2>
          <button type="button" className="btn-outline !py-1.5" onClick={() => stepArray.append({ text: '' })}>
            <Plus size={14} /> Add step
          </button>
        </div>
        {errors.instructions?.message && <p className="text-xs text-brick-500">{errors.instructions.message}</p>}
        <div className="space-y-2">
          {stepArray.fields.map((field, idx) => (
            <div key={field.id} className="flex gap-2 items-start">
              <span className="w-7 h-7 rounded-full bg-ink-900/10 dark:bg-cream-100/10 text-xs font-semibold flex items-center justify-center shrink-0 mt-1">
                {idx + 1}
              </span>
              <textarea className="input flex-1 min-h-16" placeholder={`Step ${idx + 1}`} {...register(`instructions.${idx}.text` as const)} />
              <button type="button" onClick={() => stepArray.remove(idx)} aria-label="Remove step" className="btn-ghost !px-2 mt-1">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {submitLabel}
        </button>
        {onSaveDraft && (
          <button type="button" className="btn-outline" onClick={() => onSaveDraft(getValues())}>
            Save draft
          </button>
        )}
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium block mb-1">{label}</span>
      {children}
      {error && <span className="text-xs text-brick-500 mt-1 block">{error}</span>}
    </label>
  );
}
