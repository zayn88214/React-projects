import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Clock3, Sparkles } from 'lucide-react';
import { recipeApi } from '@/api/recipeApi';
import { CUISINES, CATEGORIES } from '@/api/mockData';
import { SearchBar } from '@/components/search/SearchBar';
import { RecipeGrid } from '@/components/recipe/RecipeCard';
import { SkeletonGrid } from '@/components/common/States';
import { useRecentlyViewedStore } from '@/store/miscStores';
import { useEffect, useState } from 'react';
import { Recipe } from '@/types/recipe';

export default function HomePage() {
  const navigate = useNavigate();
  const { ids: recentIds } = useRecentlyViewedStore();

  const trending = useQuery({ queryKey: ['trending'], queryFn: () => recipeApi.random(8) });
  const quick = useQuery({ queryKey: ['quick'], queryFn: () => recipeApi.searchByName('chicken') });
  const healthy = useQuery({ queryKey: ['healthy'], queryFn: () => recipeApi.searchByIngredient('salmon') });

  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  useEffect(() => {
    if (!recentIds.length) return;
    Promise.all(recentIds.slice(0, 4).map((id) => recipeApi.getById(id))).then((res) =>
      setRecentRecipes(res.filter(Boolean) as Recipe[])
    );
  }, [recentIds]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-saffron-100/60 via-cream-100 to-cream-100 dark:from-saffron-500/10 dark:via-surface-dark dark:to-surface-dark" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide bg-saffron-100 text-saffron-700 dark:bg-saffron-500/15 dark:text-saffron-300 px-3 py-1.5 rounded-full mb-5"
          >
            <Sparkles size={13} /> Tonight's dinner, solved
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] mb-5"
          >
            What are you<br className="hidden sm:block" /> in the mood to <span className="italic text-saffron-600">cook</span>?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-ink-500 dark:text-cream-300 max-w-lg mx-auto mb-8"
          >
            Search thousands of recipes by ingredient, cuisine, or craving — then save,
            plan, and cook with a distraction-free mode built for your stovetop.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="max-w-xl mx-auto"
          >
            <SearchBar onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)} />
          </motion.div>
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {['Weeknight pasta', 'Air fryer', '30-minute meals', 'Meal prep'].map((t) => (
              <button
                key={t}
                onClick={() => navigate(`/search?q=${encodeURIComponent(t)}`)}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-cream-50 dark:bg-surface-darkcard border border-ink-900/10 dark:border-cream-100/10 hover:border-saffron-500"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <Section title="Popular categories" subtitle="Jump straight to what sounds good">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.slice(0, 8).map((c, i) => (
            <motion.button
              key={c}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              onClick={() => navigate(`/categories?c=${encodeURIComponent(c)}`)}
              className="card-surface p-5 text-left hover:-translate-y-1 transition-transform"
            >
              <p className="font-display text-lg font-semibold">{c}</p>
              <span className="text-xs text-ink-500 dark:text-cream-300 flex items-center gap-1 mt-1">
                Explore <ArrowRight size={12} />
              </span>
            </motion.button>
          ))}
        </div>
      </Section>

      {/* Cuisines */}
      <Section title="Featured cuisines" subtitle="Cook your way around the world">
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CUISINES.map((c) => (
            <button
              key={c}
              onClick={() => navigate(`/cuisines?a=${encodeURIComponent(c)}`)}
              className="shrink-0 w-40 card-surface p-4 text-center hover:-translate-y-1 transition-transform"
            >
              <p className="font-display font-semibold">{c}</p>
            </button>
          ))}
        </div>
      </Section>

      {/* Trending */}
      <Section title="Trending recipes" subtitle="What everyone's cooking this week" icon={<Sparkles size={18} />}>
        {trending.isLoading ? <SkeletonGrid count={8} /> : <RecipeGrid recipes={trending.data || []} />}
      </Section>

      {/* Quick meals */}
      <Section title="Quick meal suggestions" subtitle="On the table in 30 minutes or less" icon={<Clock3 size={18} />}>
        {quick.isLoading ? <SkeletonGrid count={4} /> : <RecipeGrid recipes={(quick.data || []).slice(0, 4)} />}
      </Section>

      {/* Healthy */}
      <Section title="Healthy picks" subtitle="Nutrient-dense recipes worth repeating" icon={<Leaf size={18} />}>
        {healthy.isLoading ? <SkeletonGrid count={4} /> : <RecipeGrid recipes={(healthy.data || []).slice(0, 4)} />}
      </Section>

      {/* Recently viewed */}
      {recentRecipes.length > 0 && (
        <Section title="Recently viewed" subtitle="Pick up where you left off">
          <RecipeGrid recipes={recentRecipes} />
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold flex items-center gap-2">
            {icon}
            {title}
          </h2>
          {subtitle && <p className="text-ink-500 dark:text-cream-300 mt-1">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}
