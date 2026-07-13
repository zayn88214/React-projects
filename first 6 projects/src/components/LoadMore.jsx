import React, { useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";

const ALL_ITEMS = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: `Article #${i + 1}`,
  excerpt: "A short teaser line describing this item, standing in for real content.",
}));

const PAGE_SIZE = 6;

export default function LoadMore() {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVisible((v) => Math.min(v + PAGE_SIZE, ALL_ITEMS.length));
      setLoading(false);
    }, 600);
  };

  const items = ALL_ITEMS.slice(0, visible);
  const done = visible >= ALL_ITEMS.length;

  return (
    <div className="min-h-[500px] w-full bg-stone-50 flex flex-col items-center p-6">
      <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-2 mt-2">Project 05</p>
      <h1 className="text-2xl font-semibold text-stone-800 mb-6">Load More Button</h1>

      <div className="w-full max-w-xl grid sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
            <h3 className="font-medium text-stone-800 text-sm">{item.title}</h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">{item.excerpt}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 text-xs text-stone-400">
        Showing {items.length} of {ALL_ITEMS.length}
      </div>

      {!done ? (
        <button
          onClick={loadMore}
          disabled={loading}
          className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-full bg-stone-800 text-white text-sm font-medium hover:bg-stone-700 disabled:opacity-60 transition-colors"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Loading
            </>
          ) : (
            <>
              <ChevronDown size={16} /> Load more
            </>
          )}
        </button>
      ) : (
        <div className="mt-4 text-sm text-stone-400">You've reached the end</div>
      )}
    </div>
  );
}
