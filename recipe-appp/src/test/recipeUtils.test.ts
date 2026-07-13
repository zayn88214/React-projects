import { describe, it, expect } from 'vitest';
import { applyFilters, sortRecipes, scaleAmount, formatMinutes, groupBy } from '@/utils/recipeUtils';
import { MOCK_RECIPES } from '@/api/mockData';

describe('formatMinutes', () => {
  it('formats minutes under an hour', () => {
    expect(formatMinutes(25)).toBe('25 min');
  });
  it('formats hours and minutes', () => {
    expect(formatMinutes(90)).toBe('1h 30m');
  });
  it('formats exact hours without minutes', () => {
    expect(formatMinutes(120)).toBe('2h');
  });
});

describe('scaleAmount', () => {
  it('scales a whole number amount', () => {
    expect(scaleAmount('2 tbsp', 2)).toBe('4 tbsp');
  });
  it('scales a fractional amount', () => {
    expect(scaleAmount('1/2 cup', 2)).toBe('1 cup');
  });
  it('returns original string when it cannot parse a quantity', () => {
    expect(scaleAmount('to taste', 2)).toBe('to taste');
  });
});

describe('applyFilters', () => {
  it('filters by cuisine', () => {
    const cuisine = MOCK_RECIPES[0].cuisine;
    const result = applyFilters(MOCK_RECIPES, { cuisine: [cuisine] });
    expect(result.every((r) => r.cuisine === cuisine)).toBe(true);
  });

  it('filters by max cook time', () => {
    const result = applyFilters(MOCK_RECIPES, { maxCookTime: 20 });
    expect(result.every((r) => r.cookTimeMinutes <= 20)).toBe(true);
  });

  it('filters by minimum rating', () => {
    const result = applyFilters(MOCK_RECIPES, { minRating: 4.5 });
    expect(result.every((r) => r.rating >= 4.5)).toBe(true);
  });
});

describe('sortRecipes', () => {
  it('sorts by rating descending', () => {
    const sorted = sortRecipes(MOCK_RECIPES, 'rating');
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].rating).toBeGreaterThanOrEqual(sorted[i].rating);
    }
  });

  it('sorts by cook time ascending', () => {
    const sorted = sortRecipes(MOCK_RECIPES, 'cookTime');
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].cookTimeMinutes).toBeLessThanOrEqual(sorted[i].cookTimeMinutes);
    }
  });
});

describe('groupBy', () => {
  it('groups items by a derived key', () => {
    const grouped = groupBy(MOCK_RECIPES, (r) => r.difficulty);
    Object.entries(grouped).forEach(([key, items]) => {
      expect(items.every((i) => i.difficulty === key)).toBe(true);
    });
  });
});
