"use client";

import React from "react";
import type { TopHabit } from "@/types/habit";
import { Trophy, Award } from "lucide-react";

export function TopHabitsList({ habits }: { habits: TopHabit[] }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-serif font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
          <Trophy size={14} className="text-amber-600" />
          <span>Top Habits Leaderboard</span>
        </span>
        <span className="text-[11px] text-stone-400 font-sans">Most consistent</span>
      </div>

      <ol className="flex flex-col gap-2 text-xs font-serif">
        {habits.length === 0 ? (
          <li className="text-stone-400 py-4 text-center text-xs">No habit check-ins yet.</li>
        ) : (
          habits.map((h, i) => (
            <li
              key={h.name}
              className="flex items-center justify-between p-2 rounded-xl bg-stone-50/70 border border-stone-200/50 hover:bg-amber-50/40 transition"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    i === 0
                      ? "bg-amber-500 text-stone-950 shadow-xs"
                      : i === 1
                      ? "bg-stone-300 text-stone-900"
                      : i === 2
                      ? "bg-amber-700 text-amber-100"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="font-medium text-stone-900 truncate">{h.name}</span>
              </div>
              <span className="text-xs font-bold text-amber-900 bg-amber-100/60 px-2 py-0.5 rounded-md font-mono shrink-0 ml-2">
                {h.completions} checks
              </span>
            </li>
          ))
        )}
      </ol>
    </div>
  );
}
