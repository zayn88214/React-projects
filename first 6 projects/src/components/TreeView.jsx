import React, { useState } from "react";
import { ChevronRight, Folder, FileText } from "lucide-react";

const TREE = {
  name: "src",
  children: [
    {
      name: "components",
      children: [
        { name: "Accordion.jsx" },
        { name: "StarRating.jsx" },
        {
          name: "slider",
          children: [{ name: "Slider.jsx" }, { name: "Dots.jsx" }],
        },
      ],
    },
    {
      name: "hooks",
      children: [{ name: "useFetch.js" }, { name: "useOnClickOutside.js" }],
    },
    { name: "App.jsx" },
    { name: "index.css" },
  ],
};

function Node({ node, depth }) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = !!node.children;

  return (
    <div>
      <div
        onClick={() => hasChildren && setOpen((o) => !o)}
        style={{ paddingLeft: depth * 18 }}
        className={`flex items-center gap-1.5 py-1.5 rounded-md text-sm select-none ${
          hasChildren ? "cursor-pointer hover:bg-stone-100" : "text-stone-500"
        }`}
      >
        {hasChildren ? (
          <ChevronRight
            size={14}
            className={`text-stone-400 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          />
        ) : (
          <span className="w-[14px]" />
        )}
        {hasChildren ? (
          <Folder size={15} className="text-indigo-400" />
        ) : (
          <FileText size={15} className="text-stone-400" />
        )}
        <span className={hasChildren ? "text-stone-800 font-medium" : ""}>{node.name}</span>
      </div>

      {hasChildren && (
        <div
          className="grid transition-all duration-200 ease-in-out"
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            {node.children.map((child, i) => (
              <Node key={i} node={child} depth={depth + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TreeView() {
  return (
    <div className="min-h-[500px] w-full bg-stone-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-2">Project 06</p>
        <h1 className="text-2xl font-semibold text-stone-800 mb-6">Tree View / Recursive Menu</h1>
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
          <Node node={TREE} depth={0} />
        </div>
      </div>
    </div>
  );
}
