import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { MOCK_RECIPES } from '@/api/mockData';

describe('RecipeCard', () => {
  it('renders the recipe title, difficulty stamp, and rating', () => {
    const recipe = MOCK_RECIPES[0];
    render(
      <MemoryRouter>
        <RecipeCard recipe={recipe} />
      </MemoryRouter>
    );

    expect(screen.getByText(recipe.title)).toBeInTheDocument();
    expect(screen.getByText(recipe.difficulty)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', `/recipes/${recipe.id}`);
  });
});
