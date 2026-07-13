import { Recipe, DietTag } from '@/types/recipe';

const stamp = (n: number) => `mock-${n}`;

export const CUISINES = [
  'Italian', 'Mexican', 'Indian', 'Japanese', 'Thai', 'French',
  'Mediterranean', 'American', 'Chinese', 'Korean', 'Middle Eastern', 'Vietnamese',
];

export const CATEGORIES = [
  'Breakfast', 'Soup', 'Salad', 'Main Course', 'Dessert', 'Appetizer', 'Side Dish', 'Baking',
];

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snacks'] as const;

const DIET_COMBOS: DietTag[][] = [
  ['Vegetarian'],
  ['Vegan'],
  ['Gluten-Free'],
  ['Dairy-Free'],
  ['Keto'],
  ['Low-Carb'],
  ['High-Protein'],
  ['Vegetarian', 'Gluten-Free'],
  ['High-Protein', 'Low-Carb'],
  [],
];

const HEADLINE_WORDS: Record<string, string[]> = {
  Breakfast: ['Morning Bowl', 'Sunrise Skillet', 'Griddle Cakes', 'Breakfast Hash'],
  Soup: ['Comfort Soup', 'Simmered Broth', 'Bowl of Warmth', 'Hearty Stew'],
  Salad: ['Bright Salad', 'Crunch Bowl', 'Garden Toss', 'Chopped Salad'],
  'Main Course': ['Weeknight Dinner', 'One-Pan Feast', 'Family Platter', 'Signature Dish'],
  Dessert: ['Sweet Finish', 'After-Dinner Treat', 'Indulgent Bake', 'Sweet Bite'],
  Appetizer: ['Starter Plate', 'Small Bite', 'Party Snack', 'Opening Course'],
  'Side Dish': ['Table Side', 'Companion Plate', 'Supporting Dish', 'Second Plate'],
  Baking: ['Fresh Bake', 'Oven Classic', 'Golden Bake', 'Baker\u2019s Batch'],
};

const CUISINE_AROMATICS: Record<string, string[]> = {
  Italian: ['basil', 'garlic', 'parmesan', 'olive oil'],
  Mexican: ['lime', 'cilantro', 'chili', 'cumin'],
  Indian: ['turmeric', 'ginger', 'garam masala', 'coriander'],
  Japanese: ['soy sauce', 'mirin', 'scallion', 'sesame'],
  Thai: ['lemongrass', 'fish sauce', 'chili', 'lime leaf'],
  French: ['butter', 'thyme', 'shallot', 'white wine'],
  Mediterranean: ['lemon', 'oregano', 'olive oil', 'feta'],
  American: ['smoked paprika', 'brown sugar', 'black pepper', 'butter'],
  Chinese: ['ginger', 'scallion', 'soy sauce', 'sesame oil'],
  Korean: ['gochujang', 'sesame oil', 'garlic', 'scallion'],
  'Middle Eastern': ['sumac', 'cumin', 'tahini', 'parsley'],
  Vietnamese: ['fish sauce', 'mint', 'lime', 'chili'],
};

function pseudoRandom(seed: string, min: number, max: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return min + (hash % (max - min + 1));
}

// Every cuisine is paired with 4 of the 8 categories (offset per cuisine index),
// giving 48 recipes total with an even ~6-recipe spread across every category
// and a consistent 4-recipe spread across every cuisine.
function buildRecipes(): Recipe[] {
  const recipes: Recipe[] = [];
  let i = 0;
  CUISINES.forEach((cuisine, cuisineIdx) => {
    for (let offset = 0; offset < 4; offset++) {
      const category = CATEGORIES[(cuisineIdx + offset * 3) % CATEGORIES.length];
      const id = stamp(i);
      const headline = HEADLINE_WORDS[category][cuisineIdx % HEADLINE_WORDS[category].length];
      const aromatics = CUISINE_AROMATICS[cuisine];
      const diet = DIET_COMBOS[i % DIET_COMBOS.length];

      recipes.push({
        id,
        title: `${cuisine} ${headline}`,
        description: `A ${cuisine.toLowerCase()} ${category.toLowerCase()} built around ${aromatics[0]} and ${aromatics[1]}, balanced for a realistic weeknight prep time.`,
        image: `https://picsum.photos/seed/simmer-${i}/640/480`,
        source: 'Simmer Kitchen',
        cuisine,
        category,
        mealType: MEAL_TYPES[i % MEAL_TYPES.length],
        dietTags: diet,
        prepTimeMinutes: 10 + pseudoRandom(id + 'p', 0, 20),
        cookTimeMinutes: 10 + pseudoRandom(id + 'c', 0, 45),
        servings: 2 + pseudoRandom(id + 's', 0, 4),
        difficulty: (['Easy', 'Medium', 'Hard'] as const)[pseudoRandom(id + 'd', 0, 2)],
        rating: 3.4 + pseudoRandom(id + 'r', 0, 16) / 10,
        reviewCount: 10 + pseudoRandom(id + 'v', 0, 260),
        calories: 260 + pseudoRandom(id + 'k', 0, 520),
        nutrition: {
          calories: 260 + pseudoRandom(id + 'k', 0, 520),
          protein: 12 + pseudoRandom(id + 'pr', 0, 30),
          carbs: 14 + pseudoRandom(id + 'cb', 0, 55),
          fat: 6 + pseudoRandom(id + 'ft', 0, 26),
          fiber: 1 + pseudoRandom(id + 'fb', 0, 9),
          sugar: 1 + pseudoRandom(id + 'sg', 0, 14),
          sodium: 180 + pseudoRandom(id + 'sd', 0, 700),
        },
        allergens: pseudoRandom(id + 'al', 0, 3) === 0 ? ['Nuts'] : pseudoRandom(id + 'al2', 0, 3) === 1 ? ['Dairy', 'Gluten'] : [],
        equipment: ['Chef knife', 'Cutting board', pseudoRandom(id + 'eq', 0, 1) ? 'Large skillet' : 'Sauce pot'],
        ingredients: [
          { id: `${id}-ing-1`, name: 'Olive oil', amount: '2 tbsp' },
          { id: `${id}-ing-2`, name: `Fresh ${aromatics[1]}`, amount: '3 cloves' },
          { id: `${id}-ing-3`, name: 'Yellow onion, diced', amount: '1 medium' },
          { id: `${id}-ing-4`, name: `${aromatics[0]}, chopped`, amount: '1/4 cup' },
          { id: `${id}-ing-5`, name: `${aromatics[2]}`, amount: '1 tbsp' },
          { id: `${id}-ing-6`, name: 'Kosher salt', amount: '1 tsp' },
          { id: `${id}-ing-7`, name: `${aromatics[3]}`, amount: 'to taste' },
        ],
        instructions: [
          { id: `${id}-step-1`, order: 1, text: `Prep all ingredients, mincing the ${aromatics[1]} and chopping the ${aromatics[0]}.`, timerMinutes: 5 },
          { id: `${id}-step-2`, order: 2, text: 'Heat the oil in a large skillet over medium heat until shimmering.', timerMinutes: 2 },
          { id: `${id}-step-3`, order: 3, text: 'Add onion and aromatics, cooking until fragrant and softened.', timerMinutes: 5 },
          { id: `${id}-step-4`, order: 4, text: 'Stir in the remaining ingredients and season to taste.', timerMinutes: 8 },
          { id: `${id}-step-5`, order: 5, text: `Simmer until cooked through, finishing with a touch of ${aromatics[3]}.`, timerMinutes: 10 },
        ],
      });
      i++;
    }
  });
  return recipes;
}

export const MOCK_RECIPES: Recipe[] = buildRecipes();

export function getMockRecipeById(id: string) {
  return MOCK_RECIPES.find((r) => r.id === id);
}
