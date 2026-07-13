import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Clock, Users, Flame, ChefHat, Minus, Plus, Printer, Share2, Copy, ShoppingCart,
  PlayCircle, AlertTriangle, ArrowLeft,
} from 'lucide-react';
import { recipeApi } from '@/api/recipeApi';
import { Rating } from '@/components/common/Interactive';
import { FavoriteButton } from '@/components/common/Interactive';
import { ErrorState, SkeletonGrid } from '@/components/common/States';
import { RecipeGrid } from '@/components/recipe/RecipeCard';
import { CookingMode } from '@/components/recipe/CookingMode';
import { AddToCollectionModal } from '@/features/collections/AddToCollectionModal';
import { ReviewForm, ReviewList } from '@/features/reviews/ReviewComponents';
import { useRecentlyViewedStore } from '@/store/miscStores';
import { useShoppingListStore } from '@/store/shoppingListStore';
import { useToastStore } from '@/store/toastStore';
import { formatMinutes, scaleAmount, cx } from '@/utils/recipeUtils';

export default function RecipeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addViewed = useRecentlyViewedStore((s) => s.addViewed);
  const addIngredients = useShoppingListStore((s) => s.addIngredients);
  const showToast = useToastStore((s) => s.showToast);

  const { data: recipe, isLoading, isError, refetch } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => recipeApi.getById(id!),
    enabled: !!id,
  });

  const { data: similar } = useQuery({
    queryKey: ['similar', recipe?.cuisine],
    queryFn: () => recipeApi.listByArea(recipe!.cuisine),
    enabled: !!recipe,
  });

  const [servings, setServings] = useState(4);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set());
  const [cookingMode, setCookingMode] = useState(false);
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);

  useEffect(() => {
    if (recipe) {
      setServings(recipe.servings);
      addViewed(recipe.id);
    }
  }, [recipe, addViewed]);

  const factor = recipe ? servings / recipe.servings : 1;

  const toggleSet = (set: Set<string>, setter: (s: Set<string>) => void, id: string) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    setter(next);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="h-80 bg-ink-900/10 dark:bg-cream-100/10 rounded-card animate-pulse mb-6" />
        <SkeletonGrid count={4} />
      </div>
    );
  }

  if (isError || !recipe) {
    return <ErrorState message="We couldn't find that recipe." onRetry={() => refetch()} />;
  }

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <button onClick={() => navigate(-1)} className="btn-ghost !px-2 mb-2">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-card overflow-hidden shadow-card"
        >
          <img src={recipe.image} alt={recipe.title} className="w-full h-80 object-cover" />
          <FavoriteButton recipeId={recipe.id} className="absolute top-4 right-4" />
        </motion.div>

        <div>
          <p className="text-xs font-semibold text-saffron-700 dark:text-saffron-300 uppercase tracking-wide mb-2">
            {recipe.cuisine} · {recipe.category} · {recipe.mealType}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-2">{recipe.title}</h1>
          <p className="text-ink-500 dark:text-cream-300 mb-3">{recipe.description}</p>
          <p className="text-xs text-ink-500 dark:text-cream-300 mb-4">By {recipe.source}</p>
          <Rating value={recipe.rating} count={recipe.reviewCount} size={17} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            <Stat icon={<Clock size={16} />} label="Prep" value={formatMinutes(recipe.prepTimeMinutes)} />
            <Stat icon={<Clock size={16} />} label="Cook" value={formatMinutes(recipe.cookTimeMinutes)} />
            <Stat icon={<ChefHat size={16} />} label="Difficulty" value={recipe.difficulty} />
            <Stat icon={<Flame size={16} />} label="Calories" value={`${recipe.calories}`} />
          </div>

          {recipe.dietTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {recipe.dietTags.map((tag) => (
                <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-basil-50 text-basil-700 dark:bg-basil-500/15 dark:text-basil-300">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-6">
            <button className="btn-primary" onClick={() => setCookingMode(true)}>
              <PlayCircle size={17} /> Start cooking
            </button>
            <button className="btn-outline" onClick={() => setCollectionModalOpen(true)}>
              Save to collection
            </button>
            <button
              className="btn-outline"
              onClick={() => {
                addIngredients(recipe.ingredients);
                showToast('Ingredients added to shopping list', 'success');
              }}
            >
              <ShoppingCart size={16} /> Add to list
            </button>
            <button className="btn-ghost !px-3" onClick={() => window.print()} aria-label="Print recipe">
              <Printer size={17} />
            </button>
            <button
              className="btn-ghost !px-3"
              aria-label="Share recipe"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                showToast('Link copied to clipboard', 'success');
              }}
            >
              <Share2 size={17} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-[1fr_1.4fr] gap-10 mt-12">
        {/* Ingredients */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-xl font-semibold">Ingredients</h2>
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 rounded-full border border-ink-300/50 dark:border-cream-100/20 flex items-center justify-center"
                onClick={() => setServings((s) => Math.max(1, s - 1))}
                aria-label="Decrease servings"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-medium w-20 text-center flex items-center justify-center gap-1">
                <Users size={14} /> {servings}
              </span>
              <button
                className="w-8 h-8 rounded-full border border-ink-300/50 dark:border-cream-100/20 flex items-center justify-center"
                onClick={() => setServings((s) => Math.min(50, s + 1))}
                aria-label="Increase servings"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
          <ul className="space-y-2 mb-4">
            {recipe.ingredients.map((ing) => (
              <li key={ing.id}>
                <label className="flex items-center gap-3 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedIngredients.has(ing.id)}
                    onChange={() => toggleSet(checkedIngredients, setCheckedIngredients, ing.id)}
                    className="w-4 h-4 accent-saffron-500"
                  />
                  <span className={cx(checkedIngredients.has(ing.id) && 'line-through text-ink-300 dark:text-cream-300/40')}>
                    <span className="font-mono text-xs text-ink-500 dark:text-cream-300 mr-1">
                      {scaleAmount(ing.amount, factor)}
                    </span>
                    {ing.name}
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <button
              className="btn-outline !py-1.5 text-xs"
              onClick={() => {
                const text = recipe.ingredients.map((i) => `${scaleAmount(i.amount, factor)} ${i.name}`).join('\n');
                navigator.clipboard?.writeText(text);
                showToast('Ingredients copied', 'success');
              }}
            >
              <Copy size={13} /> Copy ingredients
            </button>
          </div>

          {recipe.equipment.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-sm mb-2">Equipment</h3>
              <ul className="text-sm text-ink-500 dark:text-cream-300 space-y-1">
                {recipe.equipment.map((e) => <li key={e}>• {e}</li>)}
              </ul>
            </div>
          )}

          {recipe.allergens.length > 0 && (
            <div className="mt-6 flex items-start gap-2 bg-brick-100 dark:bg-brick-500/15 text-brick-600 dark:text-brick-300 rounded-xl p-3 text-sm">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>Contains: {recipe.allergens.join(', ')}</span>
            </div>
          )}

          <div className="mt-6 card-surface p-4">
            <h3 className="font-semibold text-sm mb-3">Nutrition facts</h3>
            <dl className="grid grid-cols-2 gap-y-1.5 text-sm">
              {Object.entries(recipe.nutrition).map(([k, v]) => (
                <div key={k} className="flex justify-between pr-4">
                  <dt className="capitalize text-ink-500 dark:text-cream-300">{k}</dt>
                  <dd className="font-mono">{v}{k === 'calories' ? '' : 'g'}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <h2 className="font-display text-xl font-semibold mb-3">Instructions</h2>
          <ol className="space-y-4">
            {recipe.instructions.map((step) => (
              <li key={step.id} className="flex gap-3">
                <button
                  onClick={() => toggleSet(checkedSteps, setCheckedSteps, step.id)}
                  className={cx(
                    'w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5',
                    checkedSteps.has(step.id) ? 'bg-basil-500 text-cream-50' : 'bg-ink-900/10 dark:bg-cream-100/10'
                  )}
                  aria-label={`Mark step ${step.order} complete`}
                >
                  {checkedSteps.has(step.id) ? '✓' : step.order}
                </button>
                <p className={cx('text-sm leading-relaxed pt-0.5', checkedSteps.has(step.id) && 'text-ink-300 dark:text-cream-300/40 line-through')}>
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-14 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display text-xl font-semibold mb-4">Reviews</h2>
          <ReviewList recipeId={recipe.id} />
        </div>
        <ReviewForm recipeId={recipe.id} />
      </div>

      {/* Similar recipes */}
      {similar && similar.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 mb-10">
          <h2 className="font-display text-2xl font-semibold mb-5">You might also like</h2>
          <RecipeGrid recipes={similar.filter((r) => r.id !== recipe.id).slice(0, 4)} />
        </div>
      )}

      {cookingMode && <CookingMode recipe={recipe} onClose={() => setCookingMode(false)} />}
      <AddToCollectionModal isOpen={collectionModalOpen} onClose={() => setCollectionModalOpen(false)} recipeId={recipe.id} />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card-surface p-3 flex flex-col items-center text-center gap-1">
      <span className="text-saffron-600">{icon}</span>
      <span className="text-sm font-semibold">{value}</span>
      <span className="text-[10px] uppercase tracking-wide text-ink-500 dark:text-cream-300">{label}</span>
    </div>
  );
}
