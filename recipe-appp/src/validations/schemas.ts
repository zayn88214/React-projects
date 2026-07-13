import { z } from 'zod';

export const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required'),
  amount: z.string().min(1, 'Amount is required'),
});

export const stepSchema = z.object({
  text: z.string().min(3, 'Step needs at least 3 characters'),
  timerMinutes: z.number().optional(),
});

export const recipeFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().min(10, 'Description must be at least 10 characters').max(600),
  image: z.string().optional(),
  cuisine: z.string().min(1, 'Select a cuisine'),
  category: z.string().min(1, 'Select a category'),
  mealType: z.string().min(1, 'Select a meal type'),
  dietTags: z.array(z.string()).default([]),
  prepTimeMinutes: z.coerce.number().min(1, 'Must be at least 1 minute').max(600),
  cookTimeMinutes: z.coerce.number().min(0).max(600),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  servings: z.coerce.number().min(1).max(50),
  calories: z.coerce.number().min(0).max(5000),
  equipment: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  ingredients: z.array(ingredientSchema).min(1, 'Add at least one ingredient'),
  instructions: z.array(stepSchema).min(1, 'Add at least one instruction step'),
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;

export const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(80),
  bio: z.string().max(280).optional().default(''),
  avatar: z.string().optional(),
  dietaryPreferences: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  favoriteCuisines: z.array(z.string()).default([]),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const reviewFormSchema = z.object({
  author: z.string().min(1, 'Name is required').max(60),
  rating: z.coerce.number().min(1, 'Pick a rating').max(5),
  comment: z.string().min(5, 'Review must be at least 5 characters').max(500),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
