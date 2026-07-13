import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { BookMarked, Plus, Pencil, Trash2 } from 'lucide-react';
import { useCollectionsStore } from '@/store/collectionsStore';
import { recipeApi } from '@/api/recipeApi';
import { RecipeGrid } from '@/components/recipe/RecipeCard';
import { EmptyState, SkeletonGrid, ConfirmDialog } from '@/components/common/States';
import { Modal } from '@/components/common/Modal';

export default function CollectionsPage() {
  const { collections, createCollection, renameCollection, deleteCollection } = useCollectionsStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const active = collections.find((c) => c.id === activeId);

  const results = useQueries({
    queries: (active?.recipeIds || []).map((id) => ({ queryKey: ['recipe', id], queryFn: () => recipeApi.getById(id) })),
  });
  const recipes = results.map((r) => r.data).filter(Boolean) as import('@/types/recipe').Recipe[];
  const isLoading = results.some((r) => r.isLoading);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-2 flex items-center gap-2">
            <BookMarked className="text-saffron-600" size={26} /> Collections
          </h1>
          <p className="text-ink-500 dark:text-cream-300">Organize saved recipes into custom groups.</p>
        </div>
        <button className="btn-primary" onClick={() => setNewModalOpen(true)}>
          <Plus size={16} /> New collection
        </button>
      </div>

      {collections.length === 0 ? (
        <EmptyState
          icon={<BookMarked size={24} />}
          title="No collections yet"
          description="Create a collection to group recipes for meal prep, holidays, or your favorite cuisine."
          action={<button className="btn-primary" onClick={() => setNewModalOpen(true)}>Create collection</button>}
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-8">
            {collections.map((c) => (
              <div key={c.id} className="flex items-center gap-1">
                <button
                  onClick={() => setActiveId(c.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border ${
                    activeId === c.id
                      ? 'bg-saffron-500 border-saffron-500 text-ink-900'
                      : 'border-ink-300/50 dark:border-cream-100/20 hover:border-saffron-500'
                  }`}
                >
                  {c.name} <span className="opacity-60">({c.recipeIds.length})</span>
                </button>
                <button className="btn-ghost !px-2 !py-2" aria-label={`Rename ${c.name}`} onClick={() => { setRenamingId(c.id); setName(c.name); }}>
                  <Pencil size={14} />
                </button>
                <button className="btn-ghost !px-2 !py-2" aria-label={`Delete ${c.name}`} onClick={() => setDeletingId(c.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {!active && <EmptyState title="Select a collection to view its recipes" />}
          {active && isLoading && <SkeletonGrid count={active.recipeIds.length || 4} />}
          {active && !isLoading && recipes.length === 0 && <EmptyState title="This collection is empty" description="Save recipes here from any recipe page." />}
          {active && !isLoading && recipes.length > 0 && <RecipeGrid recipes={recipes} />}
        </>
      )}

      <Modal isOpen={newModalOpen} onClose={() => setNewModalOpen(false)} title="New collection" size="sm">
        <div className="flex gap-2">
          <input className="input" placeholder="Collection name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          <button
            className="btn-primary shrink-0"
            onClick={() => {
              if (!name.trim()) return;
              createCollection(name.trim());
              setName('');
              setNewModalOpen(false);
            }}
          >
            Create
          </button>
        </div>
      </Modal>

      <Modal isOpen={!!renamingId} onClose={() => setRenamingId(null)} title="Rename collection" size="sm">
        <div className="flex gap-2">
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          <button
            className="btn-primary shrink-0"
            onClick={() => {
              if (renamingId && name.trim()) renameCollection(renamingId, name.trim());
              setRenamingId(null);
            }}
          >
            Save
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) {
            deleteCollection(deletingId);
            if (activeId === deletingId) setActiveId(null);
          }
        }}
        title="Delete collection?"
        description="This removes the collection but not the recipes themselves."
        confirmLabel="Delete"
      />
    </div>
  );
}
