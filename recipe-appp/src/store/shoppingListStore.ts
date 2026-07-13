import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ShoppingListItem, Ingredient } from '@/types/recipe';

function guessCategory(name: string): string {
  const n = name.toLowerCase();
  if (/chicken|beef|pork|fish|shrimp|tofu|turkey|lamb/.test(n)) return 'Protein';
  if (/milk|cheese|yogurt|butter|cream/.test(n)) return 'Dairy';
  if (/flour|sugar|baking|yeast|vanilla/.test(n)) return 'Baking';
  if (/onion|garlic|tomato|pepper|carrot|potato|lettuce|herb|lemon|lime/.test(n)) return 'Produce';
  if (/salt|pepper|spice|cumin|paprika|oregano/.test(n)) return 'Spices';
  return 'Pantry';
}

interface ShoppingListState {
  items: ShoppingListItem[];
  addIngredients: (ingredients: Ingredient[]) => void;
  addCustomItem: (name: string, amount: string) => void;
  updateAmount: (id: string, amount: string) => void;
  togglePurchased: (id: string) => void;
  removeItem: (id: string) => void;
  clearPurchased: () => void;
  clearAll: () => void;
}

export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    (set) => ({
      items: [],
      addIngredients: (ingredients) =>
        set((state) => {
          const items = [...state.items];
          ingredients.forEach((ing) => {
            const existing = items.find(
              (i) => i.name.toLowerCase() === ing.name.toLowerCase() && !i.purchased
            );
            if (existing) {
              existing.amount = `${existing.amount} + ${ing.amount}`;
            } else {
              items.push({
                id: crypto.randomUUID(),
                name: ing.name,
                amount: ing.amount,
                category: guessCategory(ing.name),
                purchased: false,
              });
            }
          });
          return { items };
        }),
      addCustomItem: (name, amount) =>
        set((state) => ({
          items: [
            ...state.items,
            {
              id: crypto.randomUUID(),
              name,
              amount,
              category: guessCategory(name),
              purchased: false,
              isCustom: true,
            },
          ],
        })),
      updateAmount: (id, amount) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, amount } : i)),
        })),
      togglePurchased: (id) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, purchased: !i.purchased } : i)),
        })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clearPurchased: () => set((state) => ({ items: state.items.filter((i) => !i.purchased) })),
      clearAll: () => set({ items: [] }),
    }),
    { name: 'simmer-shopping-list' }
  )
);
