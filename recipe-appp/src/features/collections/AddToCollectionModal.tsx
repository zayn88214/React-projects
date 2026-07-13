import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { useCollectionsStore } from '@/store/collectionsStore';
import { useToastStore } from '@/store/toastStore';

export function AddToCollectionModal({
  isOpen,
  onClose,
  recipeId,
}: {
  isOpen: boolean;
  onClose: () => void;
  recipeId: string;
}) {
  const { collections, createCollection, addRecipeToCollection, removeRecipeFromCollection } = useCollectionsStore();
  const showToast = useToastStore((s) => s.showToast);
  const [newName, setNewName] = useState('');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save to collection" size="sm">
      <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
        {collections.length === 0 && (
          <p className="text-sm text-ink-500 dark:text-cream-300">You don't have any collections yet.</p>
        )}
        {collections.map((c) => {
          const included = c.recipeIds.includes(recipeId);
          return (
            <button
              key={c.id}
              onClick={() => {
                if (included) {
                  removeRecipeFromCollection(c.id, recipeId);
                } else {
                  addRecipeToCollection(c.id, recipeId);
                  showToast(`Added to ${c.name}`, 'success');
                }
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-ink-900/10 dark:border-cream-100/10 hover:border-saffron-500"
            >
              <span className="text-sm font-medium">{c.name}</span>
              {included && <Check size={16} className="text-basil-600" />}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <input
          className="input"
          placeholder="New collection name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          className="btn-primary shrink-0"
          onClick={() => {
            if (!newName.trim()) return;
            const id = createCollection(newName.trim());
            addRecipeToCollection(id, recipeId);
            setNewName('');
            showToast('Collection created', 'success');
          }}
        >
          <Plus size={16} />
        </button>
      </div>
    </Modal>
  );
}
