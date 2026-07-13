import { useNavigate } from 'react-router-dom';
import { RecipeForm } from '@/components/forms/RecipeForm';
import { RecipeFormValues } from '@/validations/schemas';
import { useUserRecipesStore } from '@/store/miscStores';
import { useToastStore } from '@/store/toastStore';
import { Recipe } from '@/types/recipe';

function toRecipe(values: RecipeFormValues, id: string): Recipe {
  return {
    id,
    title: values.title,
    description: values.description,
    image: values.image || `https://picsum.photos/seed/${id}/640/480`,
    source: 'You',
    cuisine: values.cuisine,
    category: values.category,
    mealType: values.mealType,
    dietTags: values.dietTags as Recipe['dietTags'],
    prepTimeMinutes: values.prepTimeMinutes,
    cookTimeMinutes: values.cookTimeMinutes,
    servings: values.servings,
    difficulty: values.difficulty,
    rating: 0,
    reviewCount: 0,
    calories: values.calories,
    nutrition: {
      calories: values.calories,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
    allergens: values.allergens,
    equipment: values.equipment,
    ingredients: values.ingredients.map((ing, i) => ({ id: `${id}-ing-${i}`, ...ing })),
    instructions: values.instructions.map((step, i) => ({ id: `${id}-step-${i}`, order: i + 1, ...step })),
    isUserCreated: true,
    createdAt: new Date().toISOString(),
  };
}

export default function CreateRecipePage() {
  const navigate = useNavigate();
  const addRecipe = useUserRecipesStore((s) => s.addRecipe);
  const showToast = useToastStore((s) => s.showToast);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-semibold mb-2">Create a recipe</h1>
      <p className="text-ink-500 dark:text-cream-300 mb-8">
        Recipes you create are saved locally in your browser and appear in your profile.
      </p>
      <RecipeForm
        onSubmit={(values) => {
          const id = `user-${crypto.randomUUID()}`;
          addRecipe(toRecipe(values, id));
          showToast('Recipe published', 'success');
          navigate(`/recipes/${id}`);
        }}
        onSaveDraft={(values) => {
          const id = `user-${crypto.randomUUID()}`;
          addRecipe(toRecipe(values, id));
          showToast('Draft saved', 'success');
        }}
      />
    </div>
  );
}
