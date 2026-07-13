import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const DATA = [
  {
    q: "What makes this accordion different from a plain dropdown?",
    a: "Each panel animates its height and only one section stays open at a time, so the list never turns into a wall of text.",
  },
  {
    q: "How is the open/closed state tracked?",
    a: "A single piece of state holds the index of the currently open item. Clicking a header compares its own index against that state to decide whether to expand or collapse.",
  },
  {
    q: "Can more than one panel be open at once?",
    a: "Not in this version — selecting a new question closes the previous one. That constraint is what keeps a long FAQ list scannable.",
  },
  {
    q: "Is this accessible to keyboard and screen reader users?",
    a: "The header is a real <button>, so it's focusable and triggerable with Enter or Space, and aria-expanded reflects the current state.",
  },
];

export default function Accordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="min-h-[500px] w-full bg-stone-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-2">Project 01</p>
        <h1 className="text-2xl font-semibold text-stone-800 mb-6">Accordion</h1>
        <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-sm divide-y divide-stone-200">
          {DATA.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 hover:bg-stone-50 transition-colors"
                >
                  <span className="font-medium text-stone-800">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-stone-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className="grid transition-all duration-300 ease-in-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm leading-relaxed text-stone-500">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
