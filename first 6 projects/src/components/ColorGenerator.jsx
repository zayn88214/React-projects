import React, { useState, useCallback } from "react";
import { Shuffle, Copy, Check } from "lucide-react";

function randomHex() {
  const n = Math.floor(Math.random() * 0xffffff);
  return "#" + n.toString(16).padStart(6, "0");
}

function hexToRgb(hex) {
  const v = parseInt(hex.slice(1), 16);
  return `rgb(${(v >> 16) & 255}, ${(v >> 8) & 255}, ${v & 255})`;
}

function isLight(hex) {
  const v = parseInt(hex.slice(1), 16);
  const r = (v >> 16) & 255, g = (v >> 8) & 255, b = v & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

export default function ColorGenerator() {
  const [history, setHistory] = useState([randomHex()]);
  const [copied, setCopied] = useState(false);
  const color = history[history.length - 1];

  const generate = useCallback(() => {
    setCopied(false);
    setHistory((h) => [...h.slice(-6), randomHex()]);
  }, []);

  const copy = () => {
    navigator.clipboard?.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const light = isLight(color);

  return (
    <div
      className="min-h-[500px] w-full flex flex-col items-center justify-center p-6 transition-colors duration-500"
      style={{ backgroundColor: color }}
    >
      <p className={`text-xs tracking-[0.2em] uppercase mb-2 ${light ? "text-black/40" : "text-white/50"}`}>
        Project 02
      </p>
      <h1 className={`text-2xl font-semibold mb-8 ${light ? "text-black/80" : "text-white"}`}>
        Random Color Generator
      </h1>

      <div className={`text-5xl font-mono font-bold mb-1 ${light ? "text-black" : "text-white"}`}>
        {color.toUpperCase()}
      </div>
      <div className={`font-mono text-sm mb-8 ${light ? "text-black/50" : "text-white/60"}`}>
        {hexToRgb(color)}
      </div>

      <div className="flex gap-3">
        <button
          onClick={generate}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium shadow-sm transition-transform active:scale-95 ${
            light ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          <Shuffle size={16} /> Generate
        </button>
        <button
          onClick={copy}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium border transition-transform active:scale-95 ${
            light ? "border-black/20 text-black" : "border-white/30 text-white"
          }`}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="flex gap-2 mt-10">
        {history.map((c, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full border-2"
            style={{ backgroundColor: c, borderColor: light ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.3)" }}
          />
        ))}
      </div>
    </div>
  );
}
