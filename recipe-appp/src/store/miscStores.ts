import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types/recipe';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode: (mode) => set({ mode }),
    }),
    { name: 'simmer-theme' }
  )
);

interface RecentlyViewedState {
  ids: string[];
  addViewed: (id: string) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      ids: [],
      addViewed: (id) =>
        set((state) => ({ ids: [id, ...state.ids.filter((x) => x !== id)].slice(0, 12) })),
      clear: () => set({ ids: [] }),
    }),
    { name: 'simmer-recently-viewed' }
  )
);

interface SearchHistoryState {
  queries: string[];
  addQuery: (q: string) => void;
  removeQuery: (q: string) => void;
  clear: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      queries: [],
      addQuery: (q) =>
        set((state) => ({
          queries: [q, ...state.queries.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 10),
        })),
      removeQuery: (q) => set((state) => ({ queries: state.queries.filter((x) => x !== q) })),
      clear: () => set({ queries: [] }),
    }),
    { name: 'simmer-search-history' }
  )
);

const defaultProfile: UserProfile = {
  name: 'Guest Cook',
  bio: 'Home cook exploring new cuisines one weeknight at a time.',
  dietaryPreferences: [],
  allergies: [],
  favoriteCuisines: [],
};

interface ProfileState {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      updateProfile: (updates) =>
        set((state) => ({ profile: { ...state.profile, ...updates } })),
    }),
    { name: 'simmer-profile' }
  )
);

interface UserRecipesState {
  recipes: import('@/types/recipe').Recipe[];
  addRecipe: (recipe: import('@/types/recipe').Recipe) => void;
  updateRecipe: (id: string, updates: Partial<import('@/types/recipe').Recipe>) => void;
  deleteRecipe: (id: string) => void;
}

export const useUserRecipesStore = create<UserRecipesState>()(
  persist(
    (set) => ({
      recipes: [],
      addRecipe: (recipe) => set((state) => ({ recipes: [recipe, ...state.recipes] })),
      updateRecipe: (id, updates) =>
        set((state) => ({
          recipes: state.recipes.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),
      deleteRecipe: (id) => set((state) => ({ recipes: state.recipes.filter((r) => r.id !== id) })),
    }),
    { name: 'simmer-user-recipes' }
  )
);

interface ReviewsState {
  reviews: import('@/types/recipe').Review[];
  addReview: (review: import('@/types/recipe').Review) => void;
  updateReview: (id: string, updates: Partial<import('@/types/recipe').Review>) => void;
  deleteReview: (id: string) => void;
}

export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set) => ({
      reviews: [],
      addReview: (review) => set((state) => ({ reviews: [review, ...state.reviews] })),
      updateReview: (id, updates) =>
        set((state) => ({
          reviews: state.reviews.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),
      deleteReview: (id) => set((state) => ({ reviews: state.reviews.filter((r) => r.id !== id) })),
    }),
    { name: 'simmer-reviews' }
  )
);
