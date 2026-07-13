import { useMemo, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { Heart, Search as SearchIcon } from 'lucide-react';
import { recipeApi } from '@/api/recipeApi';
import { useFavoritesStore } from '@/store/favoritesStore';
import { RecipeGrid } from '@/components/recipe/RecipeCard';
import { SkeletonGrid, EmptyState } from '@/components/common/States';
import { RecipeFilters } from '@/types/recipe';
import { applyFilters } from '@/utils/recipeUtils';

export default function FavoritesPage() {
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds);
  const [search, setSearch] = useState('');

  const results = useQueries({
    queries: favoriteIds.map((id) => ({ queryKey: ['recipe', id], queryFn: () => recipeApi.getById(id) })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const recipes = useMemo(
    () => results.map((r) => r.data).filter(Boolean) as import('@/types/recipe').Recipe[],
    [results]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return recipes;
    return recipes.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));
  }, [recipes, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2">
        <Heart className="text-brick-500 fill-brick-500" size={26} /> Favorites
      </h1>
      <p className="text-ink-500 dark:text-cream-300 mb-6">Recipes you've saved for later.</p>

      {favoriteIds.length > 0 && (
        <div className="relative max-w-sm mb-6">
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your favorites…"
            className="input !pl-9"
          />
        </div>
      )}

      {favoriteIds.length === 0 ? (
        <EmptyState
          icon={<Heart size={24} />}
          title="No favorites yet"
          description="Tap the heart icon on any recipe to save it here."
        />
      ) : isLoading ? (
        <SkeletonGrid count={favoriteIds.length} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No favorites match your search" />
      ) : (
        <RecipeGrid recipes={filtered} />
      )}
    </div>
  );
}
