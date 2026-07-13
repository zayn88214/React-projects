import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  { color: "#6366f1", label: "Slide One" },
  { color: "#ec4899", label: "Slide Two" },
  { color: "#f59e0b", label: "Slide Three" },
  { color: "#10b981", label: "Slide Four" },
];

export default function ImageSlider() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(next, 2500);
    return () => clearInterval(id);
  }, [playing, next]);

  return (
    <div className="min-h-[500px] w-full bg-stone-50 flex flex-col items-center justify-center p-6">
      <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-2">Project 04</p>
      <h1 className="text-2xl font-semibold text-stone-800 mb-6">Image Slider</h1>

      <div className="relative w-full max-w-xl aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold transition-opacity duration-500"
            style={{ backgroundColor: s.color, opacity: i === index ? 1 : 0 }}
          >
            {s.label}
          </div>
        ))}

        <button
          onClick={() => {
            prev();
            setPlaying(false);
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => {
            next();
            setPlaying(false);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex gap-2 mt-5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIndex(i);
              setPlaying(false);
            }}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-stone-800" : "w-2 bg-stone-300"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() => setPlaying((p) => !p)}
        className="mt-4 text-xs text-stone-400 underline underline-offset-2 hover:text-stone-600"
      >
        {playing ? "Pause autoplay" : "Resume autoplay"}
      </button>
    </div>
  );
}
