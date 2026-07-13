import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewFormSchema, ReviewFormValues } from '@/validations/schemas';
import { InteractiveRating, Rating } from '@/components/common/Interactive';
import { Review } from '@/types/recipe';
import { useReviewsStore } from '@/store/miscStores';
import { useToastStore } from '@/store/toastStore';
import { Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';

export function ReviewForm({ recipeId }: { recipeId: string }) {
  const addReview = useReviewsStore((s) => s.addReview);
  const showToast = useToastStore((s) => s.showToast);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { author: '', rating: 5, comment: '' },
  });

  const onSubmit = (values: ReviewFormValues) => {
    const review: Review = {
      id: crypto.randomUUID(),
      recipeId,
      author: values.author,
      rating: values.rating,
      comment: values.comment,
      createdAt: new Date().toISOString(),
    };
    addReview(review);
    showToast('Review posted', 'success');
    reset({ author: '', rating: 5, comment: '' });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card-surface p-5 space-y-3">
      <h3 className="font-display font-semibold text-lg">Write a review</h3>
      <div>
        <label className="text-xs font-medium block mb-1">Your name</label>
        <input className="input" {...register('author')} aria-invalid={!!errors.author} />
        {errors.author && <p className="text-xs text-brick-500 mt-1">{errors.author.message}</p>}
      </div>
      <div>
        <label className="text-xs font-medium block mb-1">Rating</label>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => <InteractiveRating value={field.value} onChange={field.onChange} />}
        />
      </div>
      <div>
        <label className="text-xs font-medium block mb-1">Review</label>
        <textarea className="input min-h-24" {...register('comment')} aria-invalid={!!errors.comment} />
        {errors.comment && <p className="text-xs text-brick-500 mt-1">{errors.comment.message}</p>}
      </div>
      <button className="btn-primary" type="submit" disabled={isSubmitting}>
        Post review
      </button>
    </form>
  );
}

export function ReviewList({ recipeId }: { recipeId: string }) {
  const reviews = useReviewsStore((s) => s.reviews.filter((r) => r.recipeId === recipeId));
  const deleteReview = useReviewsStore((s) => s.deleteReview);
  const updateReview = useReviewsStore((s) => s.updateReview);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  if (reviews.length === 0) {
    return <p className="text-sm text-ink-500 dark:text-cream-300">No reviews yet — be the first to share your notes.</p>;
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li key={review.id} className="card-surface p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-sm">{review.author}</p>
              <Rating value={review.rating} />
            </div>
            <div className="flex gap-1">
              <button
                aria-label="Edit review"
                onClick={() => {
                  setEditingId(review.id);
                  setDraft(review.comment);
                }}
                className="btn-ghost !px-2 !py-1"
              >
                <Pencil size={14} />
              </button>
              <button aria-label="Delete review" onClick={() => deleteReview(review.id)} className="btn-ghost !px-2 !py-1">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          {editingId === review.id ? (
            <div className="mt-2 space-y-2">
              <textarea className="input min-h-20" value={draft} onChange={(e) => setDraft(e.target.value)} />
              <div className="flex gap-2">
                <button
                  className="btn-primary !py-1.5"
                  onClick={() => {
                    updateReview(review.id, { comment: draft });
                    setEditingId(null);
                  }}
                >
                  Save
                </button>
                <button className="btn-outline !py-1.5" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-700 dark:text-cream-200 mt-2">{review.comment}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
