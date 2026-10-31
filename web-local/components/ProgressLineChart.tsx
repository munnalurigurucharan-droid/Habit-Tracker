"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { DailyProgressPoint } from "@/types/habit";

export function ProgressLineChart({ data }: { data: DailyProgressPoint[] }) {
  const chartData = data.map((d) => ({
    day: Number(d.date.slice(-2)),
    percent: d.percent,
  }));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-serif font-bold uppercase tracking-wider text-amber-950">
          Daily Completion Trajectory (%)
        </span>
        <span className="text-xs text-stone-400 font-sans">1 Month Trend</span>
      </div>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="amberFillPercent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d97706" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#d97706" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ebe1" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#78716c" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
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
              formatter={(v: number) => [`${v}%`, "Completed"]}
              labelFormatter={(l) => `Day ${l}`}
            />
            <Area
              type="monotone"
              dataKey="percent"
              stroke="#b45309"
              strokeWidth={2.5}
              fill="url(#amberFillPercent)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
