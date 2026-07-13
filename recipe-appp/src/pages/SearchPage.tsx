import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal } from 'lucide-react';
import { recipeApi } from '@/api/recipeApi';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { FilterChips } from '@/components/filters/FilterChips';
import { Drawer } from '@/components/common/Drawer';
import { RecipeGrid } from '@/components/recipe/RecipeCard';
import { Pagination } from '@/components/common/Interactive';
import { SkeletonGrid, EmptyState, ErrorState } from '@/components/common/States';
import { RecipeFilters, SortOption } from '@/types/recipe';
import { applyFilters, sortRecipes } from '@/utils/recipeUtils';
import { Search as SearchIcon } from 'lucide-react';

const PAGE_SIZE = 12;

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const query = params.get('q') || '';
  const page = Number(params.get('page') || '1');
  const sort = (params.get('sort') as SortOption) || 'relevance';

  const filters: RecipeFilters = useMemo(() => {
    const raw = params.get('filters');
    return raw ? JSON.parse(raw) : {};
  }, [params]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['search', query],
    queryFn: () => (query ? recipeApi.searchByName(query) : recipeApi.random(16)),
  });

  const setQueryParam = (updates: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '') next.delete(key);
      else next.set(key, value);
    });
    setParams(next, { replace: true });
  };

  const setFilters = (f: RecipeFilters) => {
    const isEmpty = Object.keys(f).every((k) => {
      const v = (f as any)[k];
      return v === undefined || (Array.isArray(v) && v.length === 0);
    });
    setQueryParam({ filters: isEmpty ? undefined : JSON.stringify(f), page: '1' });
  };

  const filtered = useMemo(() => {
    const base = data || [];
    return sortRecipes(applyFilters(base, filters), sort);
  }, [data, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRecipes = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setQueryParam({ page: '1' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <SearchBar
          initialValue={query}
          onSearch={(q) => setQueryParam({ q, page: '1' })}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="card-surface p-5 sticky top-24">
            <h3 className="font-display font-semibold text-lg mb-2 flex items-center gap-2">
              <SlidersHorizontal size={17} /> Filters
            </h3>
            <FilterPanel filters={filters} onChange={setFilters} />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <button
                className="btn-outline lg:hidden"
                onClick={() => setDrawerOpen(true)}
              >
                <SlidersHorizontal size={16} /> Filters
              </button>
              <p className="text-sm text-ink-500 dark:text-cream-300">
                {isLoading ? 'Searching…' : `${filtered.length} recipe${filtered.length === 1 ? '' : 's'} found`}
                {query && <> for "<strong className="text-ink-800 dark:text-cream-100">{query}</strong>"</>}
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              Sort by
              <select
                value={sort}
                onChange={(e) => setQueryParam({ sort: e.target.value, page: '1' })}
                className="input !py-1.5 !w-auto"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Rating</option>
                <option value="cookTime">Cooking time</option>
                <option value="calories">Calories</option>
                <option value="newest">Newest</option>
                <option value="popularity">Popularity</option>
              </select>
            </label>
          </div>

          <div className="mb-4">
            <FilterChips filters={filters} onChange={setFilters} />
          </div>

          {isLoading && <SkeletonGrid count={12} />}
          {isError && <ErrorState onRetry={() => refetch()} />}
          {!isLoading && !isError && filtered.length === 0 && (
            <EmptyState
              icon={<SearchIcon size={24} />}
              title="No recipes match your search"
              description="Try a different keyword or clear a few filters to see more results."
              action={
                <button className="btn-primary" onClick={() => setFilters({})}>
                  Clear filters
                </button>
              }
            />
          )}
          {!isLoading && !isError && filtered.length > 0 && (
            <>
              <RecipeGrid recipes={pageRecipes} />
              <Pagination page={page} totalPages={totalPages} onChange={(p) => setQueryParam({ page: String(p) })} />
            </>
          )}
        </div>
      </div>

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Filters" side="right">
        <FilterPanel filters={filters} onChange={setFilters} />
      </Drawer>
    </div>
  );
}
