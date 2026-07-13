import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MealSlot, PlannedMeal } from '@/types/recipe';

interface MealPlannerState {
  // key: ISO date (yyyy-mm-dd) -> slot -> meals
  plan: Record<string, Partial<Record<MealSlot, PlannedMeal[]>>>;
  addMeal: (date: string, slot: MealSlot, meal: Omit<PlannedMeal, 'id' | 'slot'>) => void;
  removeMeal: (date: string, slot: MealSlot, mealId: string) => void;
  moveMeal: (fromDate: string, fromSlot: MealSlot, toDate: string, toSlot: MealSlot, mealId: string) => void;
  clearWeek: (dates: string[]) => void;
  duplicateWeek: (sourceDates: string[], targetDates: string[]) => void;
}

export const useMealPlannerStore = create<MealPlannerState>()(
  persist(
    (set, get) => ({
      plan: {},
      addMeal: (date, slot, meal) =>
        set((state) => {
          const day = state.plan[date] || {};
          const slotMeals = day[slot] || [];
          return {
            plan: {
              ...state.plan,
              [date]: { ...day, [slot]: [...slotMeals, { ...meal, id: crypto.randomUUID(), slot }] },
            },
          };
        }),
      removeMeal: (date, slot, mealId) =>
        set((state) => {
          const day = state.plan[date] || {};
          const slotMeals = (day[slot] || []).filter((m) => m.id !== mealId);
          return { plan: { ...state.plan, [date]: { ...day, [slot]: slotMeals } } };
        }),
      moveMeal: (fromDate, fromSlot, toDate, toSlot, mealId) =>
        set((state) => {
          const fromDay = state.plan[fromDate] || {};
          const meal = (fromDay[fromSlot] || []).find((m) => m.id === mealId);
          if (!meal) return state;
          const newFromSlotMeals = (fromDay[fromSlot] || []).filter((m) => m.id !== mealId);
          const toDay = fromDate === toDate ? { ...fromDay, [fromSlot]: newFromSlotMeals } : state.plan[toDate] || {};
          const toSlotMeals = toDay[toSlot] || [];
          return {
            plan: {
              ...state.plan,
              [fromDate]: { ...fromDay, [fromSlot]: newFromSlotMeals },
              [toDate]: { ...toDay, [toSlot]: [...toSlotMeals, { ...meal, slot: toSlot }] },
            },
          };
        }),
      clearWeek: (dates) =>
        set((state) => {
          const plan = { ...state.plan };
          dates.forEach((d) => delete plan[d]);
          return { plan };
        }),
      duplicateWeek: (sourceDates, targetDates) => {
        const state = get();
        const plan = { ...state.plan };
        sourceDates.forEach((src, idx) => {
          const target = targetDates[idx];
          if (target && plan[src]) {
            plan[target] = JSON.parse(JSON.stringify(plan[src]));
          }
        });
        set({ plan });
      },
    }),
    { name: 'simmer-meal-planner' }
  )
);
