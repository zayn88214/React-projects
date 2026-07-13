import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { RecipeForm } from '@/components/forms/RecipeForm';
import { RecipeFormValues } from '@/validations/schemas';
import { useUserRecipesStore } from '@/store/miscStores';
import { useToastStore } from '@/store/toastStore';
import { recipeApi } from '@/api/recipeApi';
import { EmptyState } from '@/components/common/States';

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const updateRecipe = useUserRecipesStore((s) => s.updateRecipe);
  const deleteRecipe = useUserRecipesStore((s) => s.deleteRecipe);
  const showToast = useToastStore((s) => s.showToast);

  const { data: recipe, isLoading } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => recipeApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) return null;
  if (!recipe || !recipe.isUserCreated) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <EmptyState title="This recipe can't be edited" description="Only recipes you created can be edited here." />
      </div>
    );
  }

  const defaultValues: Partial<RecipeFormValues> = {
    title: recipe.title,
    description: recipe.description,
    image: recipe.image,
    cuisine: recipe.cuisine,
    category: recipe.category,
    mealType: recipe.mealType,
    dietTags: recipe.dietTags,
    prepTimeMinutes: recipe.prepTimeMinutes,
    cookTimeMinutes: recipe.cookTimeMinutes,
    difficulty: recipe.difficulty,
    servings: recipe.servings,
    calories: recipe.calories,
    equipment: recipe.equipment,
    allergens: recipe.allergens,
    ingredients: recipe.ingredients.map(({ name, amount }) => ({ name, amount })),
    instructions: recipe.instructions.map(({ text, timerMinutes }) => ({ text, timerMinutes })),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-semibold">Edit recipe</h1>
        <button
          className="btn-outline !text-brick-500 !border-brick-300"
          onClick={() => {
            deleteRecipe(recipe.id);
            showToast('Recipe deleted', 'success');
            navigate('/profile');
          }}
        >
          Delete recipe
        </button>
      </div>
      <RecipeForm
        submitLabel="Save changes"
        defaultValues={defaultValues}
        onSubmit={(values) => {
          updateRecipe(recipe.id, {
            ...values,
            dietTags: values.dietTags as any,
            ingredients: values.ingredients.map((ing, i) => ({ id: `${recipe.id}-ing-${i}`, ...ing })),
            instructions: values.instructions.map((step, i) => ({ id: `${recipe.id}-step-${i}`, order: i + 1, ...step })),
          });
          showToast('Recipe updated', 'success');
          navigate(`/recipes/${recipe.id}`);
        }}
      />
    </div>
  );
}
