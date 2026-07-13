import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { recipeApi } from '@/api/recipeApi';
import { CATEGORIES } from '@/api/mockData';
import { RecipeGrid } from '@/components/recipe/RecipeCard';
import { SkeletonGrid, EmptyState } from '@/components/common/States';
import { cx } from '@/utils/recipeUtils';

export default function CategoriesPage() {
  const [params, setParams] = useSearchParams();
  const active = params.get('c') || CATEGORIES[0];

  const { data, isLoading } = useQuery({
    queryKey: ['category', active],
    queryFn: () => recipeApi.listByCategory(active),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-semibold mb-2">Categories</h1>
      <p className="text-ink-500 dark:text-cream-300 mb-6">Browse recipes grouped by course.</p>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setParams({ c })}
            className={cx(
              'shrink-0 px-4 py-2 rounded-full text-sm font-medium border',
              active === c
                ? 'bg-saffron-500 border-saffron-500 text-ink-900'
                : 'border-ink-300/50 dark:border-cream-100/20 hover:border-saffron-500'
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <SkeletonGrid />
      ) : data && data.length > 0 ? (
        <RecipeGrid recipes={data} />
      ) : (
        <EmptyState title="No recipes in this category yet" />
      )}
    </div>
  );
}
