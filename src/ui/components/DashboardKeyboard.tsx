/**
 * [LAYER: UI]
 * DashboardKeyboard — A client-side visual typewriter keyboard that highlights a student's
 * weak keys (misses) and expected placement regions to reinforce tactile memory.
 */

"use client";

import { useMemo } from "react";
import { WeakKeyAdvice } from "@/src/domain/types";

interface DashboardKeyboardProps {
  weakKeys: WeakKeyAdvice[];
}

export default function DashboardKeyboard({ weakKeys }: DashboardKeyboardProps) {
  // Map of keys to their miss counts
  const missedKeysMap = useMemo(() => {
    const map = new Map<string, number>();
    weakKeys.forEach((item) => {
      // Normalize to single lower character if possible
      const keyName = item.key.toLowerCase().trim();
      map.set(keyName, item.count);
    });
    return map;
  }, [weakKeys]);

  const rows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
    ["space"],
  ];

  return (
    <div className="kb-layout shadow-inner select-none bg-stone-50/50 dark:bg-stone-900/30 p-4 rounded-xl border border-stone-200/40">
      <p className="text-[10px] text-center font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-3">
        Academy Typewriter Diagnostic Layout
      </p>
      <div className="flex flex-col gap-1.5">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="kb-row">
            {row.map((key) => {
              const isSpace = key === "space";
              const isMissed = missedKeysMap.has(key);
              const missCount = missedKeysMap.get(key) || 0;

              // Home row anchor indicators
              const isAnchor = key === "f" || key === "j";

              return (
                <div
                  key={key}
                  className={`kb-key relative ${isSpace ? "kb-key-space" : ""} ${
                    isMissed ? "kb-key-missed" : ""
                  } ${isAnchor ? "border-amber-300 bg-amber-50/20" : ""}`}
                  title={isMissed ? `${key}: ${missCount} misses` : key}
                >
                  <span className="font-semibold">{isSpace ? "Spacebar" : key}</span>
                  {/* Anchor bump line */}
                  {isAnchor && (
                    <div className="absolute bottom-1 w-2.5 h-[1.5px] bg-amber-400 rounded-full" />
                  )}
                  {/* Miss Count Notification Badge */}
                  {isMissed && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[8px] font-extrabold text-white animate-bounce shadow">
                      {missCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-6 mt-4 text-[10px] text-stone-500 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-red-100 border border-red-400 inline-block" />
          <span>Intended key frequently missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-amber-50 border border-amber-300 inline-block" />
          <span>Home-row anchor bumps</span>
        </div>
      </div>
    </div>
  );
}
