import { Recipe, RecipeFilters, SortOption } from '@/types/recipe';

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function applyFilters(recipes: Recipe[], filters: RecipeFilters): Recipe[] {
  return recipes.filter((r) => {
    if (filters.cuisine?.length && !filters.cuisine.includes(r.cuisine)) return false;
    if (filters.category?.length && !filters.category.includes(r.category)) return false;
    if (filters.mealType?.length && !filters.mealType.includes(r.mealType)) return false;
    if (filters.difficulty?.length && !filters.difficulty.includes(r.difficulty)) return false;
    if (filters.diet?.length && !filters.diet.every((d) => r.dietTags.includes(d))) return false;
    if (filters.maxCookTime && r.cookTimeMinutes > filters.maxCookTime) return false;
    if (filters.maxCalories && r.calories > filters.maxCalories) return false;
    if (filters.maxIngredients && r.ingredients.length > filters.maxIngredients) return false;
    if (filters.minRating && r.rating < filters.minRating) return false;
    if (filters.includeIngredients?.length) {
      const names = r.ingredients.map((i) => i.name.toLowerCase());
      if (!filters.includeIngredients.every((inc) => names.some((n) => n.includes(inc.toLowerCase()))))
        return false;
    }
    if (filters.excludeIngredients?.length) {
      const names = r.ingredients.map((i) => i.name.toLowerCase());
      if (filters.excludeIngredients.some((exc) => names.some((n) => n.includes(exc.toLowerCase()))))
        return false;
    }
    return true;
  });
}

export function sortRecipes(recipes: Recipe[], sort: SortOption): Recipe[] {
  const copy = [...recipes];
  switch (sort) {
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating);
    case 'cookTime':
      return copy.sort((a, b) => a.cookTimeMinutes - b.cookTimeMinutes);
    case 'calories':
      return copy.sort((a, b) => a.calories - b.calories);
    case 'popularity':
      return copy.sort((a, b) => b.reviewCount - a.reviewCount);
    case 'newest':
      return copy.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    default:
      return copy;
  }
}

export function scaleAmount(amount: string, factor: number): string {
  const match = amount.match(/^([\d.\/\s]+)(.*)$/);
  if (!match) return amount;
  const [, qtyRaw, restRaw] = match;
  const qty = parseFraction(qtyRaw.trim());
  if (qty === null) return amount;
  const scaled = qty * factor;
  const rest = restRaw.trim();
  return rest ? `${formatQty(scaled)} ${rest}` : formatQty(scaled);
}

function parseFraction(input: string): number | null {
  if (!input) return null;
  if (input.includes('/')) {
    const parts = input.split(' ');
    let total = 0;
    for (const p of parts) {
      if (p.includes('/')) {
        const [n, d] = p.split('/').map(Number);
        if (!d) return null;
        total += n / d;
      } else {
        total += Number(p) || 0;
      }
    }
    return total;
  }
  const n = Number(input);
  return Number.isNaN(n) ? null : n;
}

function formatQty(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

export function groupBy<T, K extends string | number>(items: T[], keyFn: (item: T) => K): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ||= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}
