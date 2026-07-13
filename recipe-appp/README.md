# Simmer — Recipe Discovery App

A frontend-only recipe discovery platform: search, filter, save, plan, and cook — built with
React, TypeScript, Tailwind CSS, and Framer Motion. Recipe data comes from the free
[TheMealDB](https://www.themealdb.com/api.php) API, with local mock data as an automatic fallback
when the API is unreachable or rate-limited.

## Tech stack

- React 18 + Vite + TypeScript
- React Router v6 (client-side routing, URL-synced search/filter state)
- TanStack Query (data fetching, caching, retries)
- Zustand + `persist` middleware (favorites, collections, shopping list, meal planner, theme,
  profile, recently viewed, search history — all in `localStorage`)
- React Hook Form + Zod (recipe creation/editing, profile, reviews)
- Tailwind CSS (custom design tokens — see `tailwind.config.js`)
- Framer Motion (page/element transitions, cooking-mode step animation)
- Lucide React (icons)
- Vitest + React Testing Library (unit + component tests)

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173`. No API key or backend is required — `.env.example`
documents the (keyless) TheMealDB test endpoint.

### Other commands

```bash
npm run build      # type-check and produce a production build in dist/
npm run preview    # preview the production build locally
npm run test        # run the Vitest suite once
npm run test:watch  # run tests in watch mode
```

## Design direction

Palette, type, and the recipe-card "stamp" badge are documented as design tokens in
`tailwind.config.js` (colors: cream/ink neutrals with saffron, basil, and brick accents; display
face Fraunces, body face Inter, data face JetBrains Mono). The difficulty badge on each recipe
card is the app's signature visual element — a hand-stamped index-card mark rather than a generic
pill or icon.

## Feature coverage

Implemented in full:

- Home page (hero search, trending/quick/healthy sections, categories, cuisines, recently viewed,
  newsletter UI, footer)
- Search with suggestions, debounce, recent searches, trending chips, loading/empty/error states,
  pagination
- Advanced filter panel (cuisine, category, meal type, diet, difficulty, cook time, calories,
  ingredient count, rating, include/exclude ingredients) with chips, mobile slide-over drawer, and
  full URL query-param sync (search, filters, sort, page)
- Recipe listing grid with skeleton loaders, hover animation, lazy images, favorite button
- Recipe details: serving-size scaler, ingredient/step checklists, nutrition table, allergens,
  equipment, similar recipes, mock reviews (add/edit/delete), share/copy/print, save-to-collection
- Distraction-free cooking mode: one step at a time, progress bar, per-step timers, ingredient
  reference panel, exit confirmation, keyboard arrow navigation
- Favorites, custom collections (create/rename/delete, add/remove recipes, search within)
- Shopping list (from recipes or custom items, grouped by category, quantity merge, purchased
  toggle, clear/print/copy)
- Weekly meal planner (drag-and-drop between day/slot, custom meals, generate shopping list,
  duplicate week, clear week, week navigation)
- Recipe creation & editing (dynamic ingredient/step fields, Zod validation, drafts, delete)
- Local user profile (avatar preview, bio, dietary preferences, allergies, favorite cuisines)
- Light/dark/system theme, keyboard-navigable UI, visible focus states, semantic landmarks,
  reduced-motion support
- Route-based code splitting, TanStack Query caching, debounced search, error boundaries

Intentionally scoped down for a frontend-only demo (documented here rather than silently omitted):

- Reviews, ratings, and user-created recipes are stored locally per browser rather than shared
  across users, since there's no backend.
- Personalization ("recommended for you") uses simple heuristics (recently viewed cuisine/search
  history) rather than a trained model.
- The Vitest suite covers core utilities (filtering/sorting/scaling) and one representative
  component; it's a starting harness rather than full coverage of every screen.

## Project structure

```
src/
  api/            TheMealDB client, response normalizer, mock data
  components/     common/ layout/ recipe/ search/ filters/ forms/
  features/       collections/ reviews/ (feature-scoped UI tied to a store)
  hooks/          useDebounce, useAppliedTheme
  pages/          one file per route
  routes/         AppRoutes.tsx (lazy-loaded route tree)
  store/          Zustand stores, one per domain
  types/          shared TypeScript models
  utils/          filtering, sorting, formatting helpers
  validations/    Zod schemas for forms
```
