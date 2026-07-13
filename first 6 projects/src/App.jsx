import React, { useState } from "react";
import Accordion from "./components/Accordion";
import ColorGenerator from "./components/ColorGenerator";
import StarRating from "./components/StarRating";
import EnhancedImageSlider from "./components/EnhancedImageSlider";
import LoadMore from "./components/LoadMore";
import TreeView from "./components/TreeView";

const PROJECTS = [
  { id: "accordion", label: "01 · Accordion", Component: Accordion },
  { id: "color", label: "02 · Color Generator", Component: ColorGenerator },
  { id: "rating", label: "03 · Star Rating", Component: StarRating },
  { id: "slider", label: "04 · Enhanced Car Showcase", Component: EnhancedImageSlider },
  { id: "loadmore", label: "05 · Load More Button", Component: LoadMore },
  { id: "tree", label: "06 · Tree View", Component: TreeView },
];

export default function App() {
  const [activeId, setActiveId] = useState(PROJECTS[0].id);
  const active = PROJECTS.find((p) => p.id === activeId);
  const ActiveComponent = active.Component;

  return (
    <div className="min-h-screen flex bg-stone-100">
      <aside className="w-64 shrink-0 bg-white border-r border-stone-200 p-5">
        <h2 className="text-sm font-semibold text-stone-800 mb-1">React Projects</h2>
        <p className="text-xs text-stone-400 mb-5">First 6 of 25</p>
        <nav className="flex flex-col gap-1">
          {PROJECTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                activeId === p.id
                  ? "bg-stone-800 text-white font-medium"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {p.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1">
        <ActiveComponent />
      </main>
    </div>
  );
}
