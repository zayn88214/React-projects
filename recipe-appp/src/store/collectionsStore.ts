import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Collection } from '@/types/recipe';

interface CollectionsState {
  collections: Collection[];
  createCollection: (name: string) => string;
  renameCollection: (id: string, name: string) => void;
  deleteCollection: (id: string) => void;
  addRecipeToCollection: (collectionId: string, recipeId: string) => void;
  removeRecipeFromCollection: (collectionId: string, recipeId: string) => void;
}

export const useCollectionsStore = create<CollectionsState>()(
  persist(
    (set) => ({
      collections: [],
      createCollection: (name) => {
        const id = crypto.randomUUID();
        set((state) => ({
          collections: [
            ...state.collections,
            { id, name, recipeIds: [], createdAt: new Date().toISOString() },
          ],
        }));
        return id;
      },
      renameCollection: (id, name) =>
        set((state) => ({
          collections: state.collections.map((c) => (c.id === id ? { ...c, name } : c)),
        })),
      deleteCollection: (id) =>
        set((state) => ({ collections: state.collections.filter((c) => c.id !== id) })),
      addRecipeToCollection: (collectionId, recipeId) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId && !c.recipeIds.includes(recipeId)
              ? { ...c, recipeIds: [...c.recipeIds, recipeId] }
              : c
          ),
        })),
      removeRecipeFromCollection: (collectionId, recipeId) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId
              ? { ...c, recipeIds: c.recipeIds.filter((r) => r !== recipeId) }
              : c
          ),
        })),
    }),
    { name: 'simmer-collections' }
  )
);
