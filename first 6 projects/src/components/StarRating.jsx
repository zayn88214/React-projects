import React, { useState } from "react";
import { Star } from "lucide-react";

const LABELS = ["Terrible", "Poor", "Okay", "Good", "Excellent"];

export default function StarRating() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const active = hover || rating;

  return (
    <div className="min-h-[500px] w-full bg-stone-50 flex flex-col items-center justify-center p-6">
      <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-2">Project 03</p>
      <h1 className="text-2xl font-semibold text-stone-800 mb-8">Star Rating</h1>

      <div className="flex gap-2" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onMouseEnter={() => setHover(n)}
            onClick={() => setRating(n)}
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
            className="transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              size={40}
              strokeWidth={1.5}
              className={active >= n ? "fill-amber-400 text-amber-400" : "fill-none text-stone-300"}
            />
          </button>
        ))}
      </div>

      <div className="h-8 mt-4 text-sm font-medium text-stone-500">
        {active > 0 ? `${LABELS[active - 1]} · ${active}/5` : "Hover or click to rate"}
      </div>

      {rating > 0 && (
        <button
          onClick={() => {
            setRating(0);
            setHover(0);
          }}
          className="mt-4 text-xs text-stone-400 underline underline-offset-2 hover:text-stone-600"
        >
          Reset
        </button>
      )}
    </div>
  );
}
