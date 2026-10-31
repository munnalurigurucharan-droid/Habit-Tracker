"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { MonthlySummary } from "@/types/habit";

export function MonthlyDonut({ summary }: { summary: MonthlySummary }) {
  const left = Math.max(summary.total - summary.completed, 0);
  const data = [
    { name: "Completed", value: summary.completed },
    { name: "Left", value: left },
  ];
  const colors = ["#d97706", "#f3ece0"]; // Amber-600 & warm parchment

  return (
    <div>
      <div className="mb-2 text-xs font-serif font-bold uppercase tracking-wider text-amber-950">
        Monthly Progress Donut
      </div>
      <div className="relative h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={48}
              outerRadius={68}
              startAngle={90}
              endAngle={-270}
              stroke="transparent"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold font-serif text-amber-950">{summary.percent}%</span>
          <span className="text-[10px] text-stone-500 font-sans uppercase tracking-wider">Completed</span>
        </div>
      </div>
      <div className="mt-3 flex justify-between text-xs font-serif text-stone-600 px-2 pt-2 border-t border-stone-100">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
          <span>Done: {summary.completed}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f3ece0] border border-stone-300"></span>
          <span>Left: {left}</span>
        </span>
      </div>
    </div>
  );
}
