import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { User, Pencil, ImagePlus } from 'lucide-react';
import { profileFormSchema, ProfileFormValues } from '@/validations/schemas';
import { useProfileStore, useUserRecipesStore, useRecentlyViewedStore } from '@/store/miscStores';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useMealPlannerStore } from '@/store/mealPlannerStore';
import { useShoppingListStore } from '@/store/shoppingListStore';
import { useToastStore } from '@/store/toastStore';
import { CUISINES } from '@/api/mockData';
import { DietTag } from '@/types/recipe';
import { RecipeGrid } from '@/components/recipe/RecipeCard';
import { EmptyState } from '@/components/common/States';

const DIET_OPTIONS: DietTag[] = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb', 'High-Protein'];

export default function ProfilePage() {
  const { profile, updateProfile } = useProfileStore();
  const userRecipes = useUserRecipesStore((s) => s.recipes);
  const favoriteCount = useFavoritesStore((s) => s.favoriteIds.length);
  const plan = useMealPlannerStore((s) => s.plan);
  const shoppingItems = useShoppingListStore((s) => s.items);
  const showToast = useToastStore((s) => s.showToast);
  const [editing, setEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(profile.avatar);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: profile,
  });

  const dietaryPreferences = watch('dietaryPreferences');
  const favoriteCuisines = watch('favoriteCuisines');

  const plannedMealCount = Object.values(plan).reduce(
    (sum, day) => sum + Object.values(day).reduce((s, meals) => s + (meals?.length || 0), 0),
    0
  );

  if (!editing) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-start justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-saffron-100 dark:bg-saffron-500/15 flex items-center justify-center overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-saffron-600" />
              )}
            </div>
            <div>
              <h1 className="font-display text-3xl font-semibold">{profile.name}</h1>
              <p className="text-ink-500 dark:text-cream-300 max-w-md">{profile.bio}</p>
            </div>
          </div>
          <button className="btn-outline" onClick={() => setEditing(true)}>
            <Pencil size={15} /> Edit profile
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <StatCard label="Favorites" value={favoriteCount} to="/favorites" />
          <StatCard label="Your recipes" value={userRecipes.length} to="/create-recipe" />
          <StatCard label="Planned meals" value={plannedMealCount} to="/meal-planner" />
          <StatCard label="Shopping items" value={shoppingItems.length} to="/shopping-list" />
        </div>

        {(profile.dietaryPreferences.length > 0 || profile.allergies.length > 0 || profile.favoriteCuisines.length > 0) && (
          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            <PreferenceList title="Dietary preferences" items={profile.dietaryPreferences} />
            <PreferenceList title="Allergies" items={profile.allergies} />
            <PreferenceList title="Favorite cuisines" items={profile.favoriteCuisines} />
          </div>
        )}

        <h2 className="font-display text-2xl font-semibold mb-4">Your recipes</h2>
        {userRecipes.length === 0 ? (
          <EmptyState
            title="You haven't created any recipes yet"
            description="Share your own recipe and it'll show up here."
            action={<Link to="/create-recipe" className="btn-primary">Create a recipe</Link>}
          />
        ) : (
          <RecipeGrid recipes={userRecipes} />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-semibold mb-8">Edit profile</h1>
      <form
        className="space-y-6"
        onSubmit={handleSubmit((values) => {
          updateProfile({ ...values, avatar: avatarPreview } as Partial<import('@/types/recipe').UserProfile>);
          showToast('Profile updated', 'success');
          setEditing(false);
        })}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-saffron-100 dark:bg-saffron-500/15 flex items-center justify-center overflow-hidden">
            {avatarPreview ? <img src={avatarPreview} alt="" className="w-full h-full object-cover" /> : <User size={26} className="text-saffron-600" />}
          </div>
          <label className="btn-outline cursor-pointer">
            <ImagePlus size={15} /> Upload photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => setAvatarPreview(reader.result as string);
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-xs font-medium block mb-1">Name</span>
          <input className="input" {...register('name')} />
          {errors.name && <span className="text-xs text-brick-500">{errors.name.message}</span>}
        </label>

        <label className="block">
          <span className="text-xs font-medium block mb-1">Bio</span>
          <textarea className="input min-h-20" {...register('bio')} />
        </label>

        <div>
          <span className="text-xs font-medium block mb-1">Dietary preferences</span>
          <div className="flex flex-wrap gap-2">
            {DIET_OPTIONS.map((tag) => {
              const active = dietaryPreferences?.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() =>
                    setValue('dietaryPreferences', active ? dietaryPreferences.filter((t) => t !== tag) : [...(dietaryPreferences || []), tag])
                  }
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border ${active ? 'bg-saffron-500 border-saffron-500 text-ink-900' : 'border-ink-300/50 dark:border-cream-100/20'}`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="text-xs font-medium block mb-1">Favorite cuisines</span>
          <div className="flex flex-wrap gap-2">
            {CUISINES.map((c) => {
              const active = favoriteCuisines?.includes(c);
              return (
                <button
                  type="button"
                  key={c}
                  onClick={() =>
                    setValue('favoriteCuisines', active ? favoriteCuisines.filter((t) => t !== c) : [...(favoriteCuisines || []), c])
                  }
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border ${active ? 'bg-basil-500 border-basil-500 text-cream-50' : 'border-ink-300/50 dark:border-cream-100/20'}`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <label className="block">
          <span className="text-xs font-medium block mb-1">Allergies (comma separated)</span>
          <input
            className="input"
            defaultValue={profile.allergies.join(', ')}
            onChange={(e) => setValue('allergies', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
          />
        </label>

        <div className="flex gap-2">
          <button type="submit" className="btn-primary">Save changes</button>
          <button type="button" className="btn-outline" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function StatCard({ label, value, to }: { label: string; value: number; to: string }) {
  return (
    <Link to={to} className="card-surface p-4 text-center hover:-translate-y-1 transition-transform">
      <p className="font-display text-2xl font-semibold">{value}</p>
      <p className="text-xs text-ink-500 dark:text-cream-300 mt-1">{label}</p>
    </Link>
  );
}

function PreferenceList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-cream-300 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <span key={i} className="text-xs bg-ink-900/5 dark:bg-cream-100/10 px-2.5 py-1 rounded-full">{i}</span>
        ))}
      </div>
    </div>
  );
}
