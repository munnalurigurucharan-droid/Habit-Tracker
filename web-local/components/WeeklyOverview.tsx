"use client";

import React from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { WeeklyBucket } from "@/types/habit";

export function WeeklyOverview({ weekly }: { weekly: WeeklyBucket[] }) {
  return (
    <div>
      <div className="mb-3 text-xs font-serif font-bold uppercase tracking-wider text-amber-950">
        Weekly Habit Volume & Blocks
      </div>

      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weekly} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
            <XAxis
              dataKey="weekLabel"
              tick={{ fontSize: 11, fill: "#78716c" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1c1917",
                borderRadius: "12px",
                border: "1px solid #78350f",
                color: "#fef3c7",
                fontSize: "12px",
              }}
              formatter={(v: number) => [v, "Check-ins Completed"]}
            />
            <Bar dataKey="completed" fill="#b45309" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-xs font-serif">
          <thead>
            <tr className="text-stone-400 border-b border-stone-100">
              <th className="text-left font-medium py-1">Metric</th>
              {weekly.map((w) => (
                <th key={w.weekLabel} className="px-2 py-1 text-center font-bold text-amber-950">
                  {w.weekLabel}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center divide-y divide-stone-50">
            <tr>
              <td className="text-left text-emerald-800 font-semibold py-1.5">Completed</td>
              {weekly.map((w) => (
                <td key={w.weekLabel} className="font-bold text-emerald-900 py-1.5">
                  {w.completed}
                </td>
              ))}
            </tr>
            <tr>
              <td className="text-left text-stone-500 py-1.5">Goal</td>
              {weekly.map((w) => (
                <td key={w.weekLabel} className="text-stone-600 py-1.5">
                  {w.goal}
                </td>
              ))}
            </tr>
            <tr>
              <td className="text-left text-amber-800 py-1.5">Remaining</td>
              {weekly.map((w) => (
                <td key={w.weekLabel} className="text-amber-900 py-1.5">
                  {w.left}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-1.5">
        {weekly.map((w) => (
          <div key={w.weekLabel} className="flex-1">
            <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-700 transition-all duration-300"
                style={{ width: `${Math.min(w.percent, 100)}%` }}
              />
            </div>
            <div className="mt-1 text-center text-[10px] font-bold text-stone-600">
              {w.percent}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
