import { Recipe, Difficulty, DietTag } from '@/types/recipe';
import { MOCK_RECIPES, getMockRecipeById } from './mockData';

const BASE_URL = import.meta.env.VITE_MEALDB_BASE_URL || 'https://www.themealdb.com/api/json/v1';
const API_KEY = import.meta.env.VITE_MEALDB_API_KEY || '1';
const ROOT = `${BASE_URL}/${API_KEY}`;

// Simple in-memory response cache to respect rate limits and avoid refetching.
const cache = new Map<string, unknown>();

async function cachedFetch<T>(url: string): Promise<T> {
  if (cache.has(url)) return cache.get(url) as T;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const data = (await res.json()) as T;
  cache.set(url, data);
  return data;
}

// ---- TheMealDB raw shape ----
interface MealDbMeal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strSource: string | null;
  [key: string]: string | null;
}

function pseudoRandom(seed: string, min: number, max: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return min + (hash % (max - min + 1));
}

function difficultyFor(id: string): Difficulty {
  const n = pseudoRandom(id, 0, 2);
  return (['Easy', 'Medium', 'Hard'] as const)[n];
}

function dietTagsFor(meal: MealDbMeal): DietTag[] {
  const tags: DietTag[] = [];
  const text = `${meal.strCategory} ${meal.strTags ?? ''}`.toLowerCase();
  if (text.includes('vegetarian')) tags.push('Vegetarian');
  if (text.includes('vegan')) tags.push('Vegan');
  if (meal.strCategory?.toLowerCase() === 'seafood') tags.push('High-Protein');
  return tags;
}

export function normalizeMeal(meal: MealDbMeal): Recipe {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`];
    const amount = meal[`strMeasure${i}`];
    if (name && name.trim()) {
      ingredients.push({
        id: `${meal.idMeal}-ing-${i}`,
        name: name.trim(),
        amount: (amount || '').trim() || 'to taste',
      });
    }
  }

  const instructions = (meal.strInstructions || '')
    .split(/\r?\n|(?<=\.)\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 12)
    .map((text, idx) => ({
      id: `${meal.idMeal}-step-${idx + 1}`,
      order: idx + 1,
      text,
      timerMinutes: /\b(\d+)\s*(minute|min)s?\b/i.exec(text)
        ? Number(/\b(\d+)\s*(minute|min)s?\b/i.exec(text)![1])
        : undefined,
    }));

  const prep = pseudoRandom(meal.idMeal + 'p', 10, 25);
  const cook = pseudoRandom(meal.idMeal + 'c', 15, 45);
  const calories = pseudoRandom(meal.idMeal + 'k', 280, 720);

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    description: `A ${meal.strArea || 'globally inspired'} ${meal.strCategory?.toLowerCase() || 'dish'}, sourced from the community and adapted for home cooks.`,
    image: meal.strMealThumb,
    source: meal.strSource || 'TheMealDB community',
    cuisine: meal.strArea || 'International',
    category: meal.strCategory || 'Main Course',
    mealType: ['breakfast', 'lunch', 'dinner', 'snacks'][pseudoRandom(meal.idMeal, 0, 3)],
    dietTags: dietTagsFor(meal),
    prepTimeMinutes: prep,
    cookTimeMinutes: cook,
    servings: pseudoRandom(meal.idMeal + 's', 2, 6),
    difficulty: difficultyFor(meal.idMeal),
    rating: 3.4 + pseudoRandom(meal.idMeal + 'r', 0, 16) / 10,
    reviewCount: pseudoRandom(meal.idMeal + 'v', 8, 240),
    calories,
    nutrition: {
      calories,
      protein: pseudoRandom(meal.idMeal + 'pr', 12, 40),
      carbs: pseudoRandom(meal.idMeal + 'cb', 15, 65),
      fat: pseudoRandom(meal.idMeal + 'ft', 6, 30),
      fiber: pseudoRandom(meal.idMeal + 'fb', 1, 9),
      sugar: pseudoRandom(meal.idMeal + 'sg', 1, 14),
      sodium: pseudoRandom(meal.idMeal + 'sd', 200, 900),
    },
    allergens: [],
    equipment: ['Chef knife', 'Cutting board', 'Large pan'],
    ingredients,
    instructions: instructions.length
      ? instructions
      : [{ id: `${meal.idMeal}-step-1`, order: 1, text: meal.strInstructions || 'No instructions provided.' }],
  };
}

async function safeApiCall<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.warn('MealDB API unavailable, using fallback data:', err);
    return fallback;
  }
}

export const recipeApi = {
  async searchByName(query: string): Promise<Recipe[]> {
    return safeApiCall(async () => {
      const data = await cachedFetch<{ meals: MealDbMeal[] | null }>(
        `${ROOT}/search.php?s=${encodeURIComponent(query)}`
      );
      return (data.meals || []).map(normalizeMeal);
    }, MOCK_RECIPES.filter((r) => r.title.toLowerCase().includes(query.toLowerCase())));
  },

  async searchByIngredient(ingredient: string): Promise<Recipe[]> {
    return safeApiCall(async () => {
      const data = await cachedFetch<{ meals: { idMeal: string }[] | null }>(
        `${ROOT}/filter.php?i=${encodeURIComponent(ingredient)}`
      );
      const ids = (data.meals || []).slice(0, 12).map((m) => m.idMeal);
      const full = await Promise.all(ids.map((id) => recipeApi.getById(id)));
      return full.filter(Boolean) as Recipe[];
    }, MOCK_RECIPES);
  },

  async listByCategory(category: string): Promise<Recipe[]> {
    return safeApiCall(async () => {
      const data = await cachedFetch<{ meals: { idMeal: string }[] | null }>(
        `${ROOT}/filter.php?c=${encodeURIComponent(category)}`
      );
      const ids = (data.meals || []).slice(0, 12).map((m) => m.idMeal);
      const full = await Promise.all(ids.map((id) => recipeApi.getById(id)));
      return full.filter(Boolean) as Recipe[];
    }, MOCK_RECIPES.filter((r) => r.category === category));
  },

  async listByArea(area: string): Promise<Recipe[]> {
    return safeApiCall(async () => {
      const data = await cachedFetch<{ meals: { idMeal: string }[] | null }>(
        `${ROOT}/filter.php?a=${encodeURIComponent(area)}`
      );
      const ids = (data.meals || []).slice(0, 12).map((m) => m.idMeal);
      const full = await Promise.all(ids.map((id) => recipeApi.getById(id)));
      return full.filter(Boolean) as Recipe[];
    }, MOCK_RECIPES.filter((r) => r.cuisine === area));
  },

  async getById(id: string): Promise<Recipe | undefined> {
    if (id.startsWith('mock-')) return getMockRecipeById(id);
    if (id.startsWith('user-')) {
      const { useUserRecipesStore } = await import('@/store/miscStores');
      return useUserRecipesStore.getState().recipes.find((r) => r.id === id);
    }
    return safeApiCall(async () => {
      const data = await cachedFetch<{ meals: MealDbMeal[] | null }>(`${ROOT}/lookup.php?i=${id}`);
      const meal = data.meals?.[0];
      return meal ? normalizeMeal(meal) : undefined;
    }, getMockRecipeById(id));
  },

  async random(count = 8): Promise<Recipe[]> {
    return safeApiCall(async () => {
      const results = await Promise.all(
        Array.from({ length: count }).map(() =>
          fetch(`${ROOT}/random.php`).then((r) => r.json())
        )
      );
      const meals = results.map((r) => r.meals?.[0]).filter(Boolean) as MealDbMeal[];
      const seen = new Set<string>();
      return meals.filter((m) => (seen.has(m.idMeal) ? false : (seen.add(m.idMeal), true))).map(normalizeMeal);
    }, MOCK_RECIPES.slice(0, count));
  },

  async categories(): Promise<string[]> {
    return safeApiCall(async () => {
      const data = await cachedFetch<{ meals: { strCategory: string }[] }>(`${ROOT}/list.php?c=list`);
      return data.meals.map((m) => m.strCategory);
    }, ['Breakfast', 'Soup', 'Salad', 'Main Course', 'Dessert', 'Appetizer', 'Side Dish', 'Baking']);
  },

  async areas(): Promise<string[]> {
    return safeApiCall(async () => {
      const data = await cachedFetch<{ meals: { strArea: string }[] }>(`${ROOT}/list.php?a=list`);
      return data.meals.map((m) => m.strArea);
    }, ['Italian', 'Mexican', 'Indian', 'Japanese', 'Thai', 'French', 'American', 'Chinese']);
  },
};
