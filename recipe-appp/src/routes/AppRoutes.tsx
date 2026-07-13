import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { SkeletonGrid } from '@/components/common/States';

const HomePage = lazy(() => import('@/pages/HomePage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'));
const CuisinesPage = lazy(() => import('@/pages/CuisinesPage'));
const RecipeDetailsPage = lazy(() => import('@/pages/RecipeDetailsPage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const CollectionsPage = lazy(() => import('@/pages/CollectionsPage'));
const ShoppingListPage = lazy(() => import('@/pages/ShoppingListPage'));
const MealPlannerPage = lazy(() => import('@/pages/MealPlannerPage'));
const CreateRecipePage = lazy(() => import('@/pages/CreateRecipePage'));
const EditRecipePage = lazy(() => import('@/pages/EditRecipePage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
import * as StaticPagesModule from '@/pages/StaticPages';

function withSuspense(node: React.ReactNode) {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 py-10"><SkeletonGrid /></div>}>
      <ErrorBoundary>{node}</ErrorBoundary>
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: 'search', element: withSuspense(<SearchPage />) },
      { path: 'categories', element: withSuspense(<CategoriesPage />) },
      { path: 'cuisines', element: withSuspense(<CuisinesPage />) },
      { path: 'recipes/:id', element: withSuspense(<RecipeDetailsPage />) },
      { path: 'favorites', element: withSuspense(<FavoritesPage />) },
      { path: 'collections', element: withSuspense(<CollectionsPage />) },
      { path: 'shopping-list', element: withSuspense(<ShoppingListPage />) },
      { path: 'meal-planner', element: withSuspense(<MealPlannerPage />) },
      { path: 'create-recipe', element: withSuspense(<CreateRecipePage />) },
      { path: 'edit-recipe/:id', element: withSuspense(<EditRecipePage />) },
      { path: 'profile', element: withSuspense(<ProfilePage />) },
      { path: 'settings', element: withSuspense(<SettingsPage />) },
      {
        path: 'about',
        element: withSuspense(
          <LazyStatic component="AboutPage" />
        ),
      },
      { path: 'contact', element: withSuspense(<LazyStatic component="ContactPage" />) },
      { path: 'privacy', element: withSuspense(<LazyStatic component="PrivacyPage" />) },
      { path: 'terms', element: withSuspense(<LazyStatic component="TermsPage" />) },
      { path: '*', element: withSuspense(<LazyStatic component="NotFoundPage" />) },
    ],
  },
]);

function LazyStatic({ component }: { component: 'AboutPage' | 'ContactPage' | 'PrivacyPage' | 'TermsPage' | 'NotFoundPage' }) {
  const Comp = (StaticPagesModule as any)[component];
  return <Comp />;
}

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
