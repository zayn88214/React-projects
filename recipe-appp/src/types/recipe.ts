export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type DietTag =
  | 'Vegetarian'
  | 'Vegan'
  | 'Gluten-Free'
  | 'Dairy-Free'
  | 'Keto'
  | 'Low-Carb'
  | 'High-Protein';

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  category?: string;
}

export interface InstructionStep {
  id: string;
  order: number;
  text: string;
  timerMinutes?: number;
}

export interface Review {
  id: string;
  recipeId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  source?: string;
  cuisine: string;
  category: string;
  mealType: string;
  dietTags: DietTag[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  rating: number;
  reviewCount: number;
  calories: number;
  nutrition: NutritionInfo;
  allergens: string[];
  equipment: string[];
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  isUserCreated?: boolean;
  createdAt?: string;
}

export interface RecipeFilters {
  cuisine?: string[];
  category?: string[];
  mealType?: string[];
  diet?: DietTag[];
  maxCookTime?: number;
  difficulty?: Difficulty[];
  maxCalories?: number;
  maxIngredients?: number;
  minRating?: number;
  includeIngredients?: string[];
  excludeIngredients?: string[];
}

export type SortOption =
  | 'relevance'
  | 'rating'
  | 'cookTime'
  | 'calories'
  | 'newest'
  | 'popularity';

export interface Collection {
  id: string;
  name: string;
  recipeIds: string[];
  createdAt: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  amount: string;
  category: string;
  purchased: boolean;
  isCustom?: boolean;
}

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface PlannedMeal {
  id: string;
  slot: MealSlot;
  recipeId?: string;
  recipeTitle: string;
  recipeImage?: string;
  isCustom?: boolean;
}

export interface WeekPlan {
  weekStart: string; // ISO date, Monday
  days: Record<string, Partial<Record<MealSlot, PlannedMeal[]>>>; // key = ISO date
}

export interface UserProfile {
  name: string;
  bio: string;
  avatar?: string;
  dietaryPreferences: DietTag[];
  allergies: string[];
  favoriteCuisines: string[];
}
