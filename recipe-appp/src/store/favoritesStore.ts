import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  removeFavorite: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (id) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds.filter((f) => f !== id)
            : [...state.favoriteIds, id],
        })),
      isFavorite: (id) => get().favoriteIds.includes(id),
      removeFavorite: (id) =>
        set((state) => ({ favoriteIds: state.favoriteIds.filter((f) => f !== id) })),
    }),
    { name: 'simmer-favorites' }
  )
);
