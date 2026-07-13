import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Flame, Users } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import { Rating } from '@/components/common/Interactive';
import { FavoriteButton } from '@/components/common/Interactive';
import { formatMinutes, cx } from '@/utils/recipeUtils';

const STAMP_COLOR: Record<string, string> = {
  Easy: 'bg-basil-500',
  Medium: 'bg-saffron-500',
  Hard: 'bg-brick-500',
};

export function RecipeCard({ recipe, index = 0 }: { recipe: Recipe; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index, 6) * 0.04 }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <Link to={`/recipes/${recipe.id}`} className="block card-surface overflow-hidden h-full">
        <div className="relative h-44 overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <FavoriteButton recipeId={recipe.id} className="absolute top-3 right-3" />
          <div
            className={cx(
              'absolute -top-1 -left-1 w-14 h-14 rounded-stamp rotate-[-8deg] shadow-stamp flex items-center justify-center text-[10px] font-bold uppercase tracking-wide text-cream-50 border-2 border-cream-50/60 animate-stamp-in',
              STAMP_COLOR[recipe.difficulty]
            )}
          >
            {recipe.difficulty}
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs font-semibold text-saffron-700 dark:text-saffron-300 uppercase tracking-wide mb-1">
            {recipe.cuisine} · {recipe.category}
          </p>
          <h3 className="font-display font-semibold text-lg leading-snug mb-2 line-clamp-2">
            {recipe.title}
          </h3>
          <Rating value={recipe.rating} count={recipe.reviewCount} />
          <div className="flex items-center gap-3 mt-3 text-xs text-ink-500 dark:text-cream-300">
            <span className="flex items-center gap-1">
              <Clock size={13} /> {formatMinutes(recipe.prepTimeMinutes + recipe.cookTimeMinutes)}
            </span>
            <span className="flex items-center gap-1">
              <Flame size={13} /> {recipe.calories} cal
            </span>
            <span className="flex items-center gap-1">
              <Users size={13} /> {recipe.servings}
            </span>
          </div>
          {recipe.dietTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {recipe.dietTags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-basil-50 text-basil-700 dark:bg-basil-500/15 dark:text-basil-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export function RecipeGrid({ recipes }: { recipes: Recipe[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {recipes.map((r, i) => (
        <RecipeCard key={r.id} recipe={r} index={i} />
      ))}
    </div>
  );
}
