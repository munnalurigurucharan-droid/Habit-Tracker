"use client";

import React from "react";
import { MONTH_NAMES } from "@/lib/dates";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  year: number;
  month: number; // 1-12
  onChange: (year: number, month: number) => void;
}

export function MonthSelector({ year, month, onChange }: Props) {
  const prevMonth = () => {
    if (month === 1) {
      onChange(year - 1, 12);
    } else {
      onChange(year, month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      onChange(year + 1, 1);
    } else {
      onChange(year, month + 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-3 sm:p-4 min-w-[260px]">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-100">
        <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-amber-900 uppercase tracking-wider">
          <Calendar size={13} className="text-amber-700" />
          <span>Calendar Period</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            title="Previous Month"
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-600 transition"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={nextMonth}
            title="Next Month"
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-600 transition"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
            Month
          </span>
          <select
            value={month}
            onChange={(e) => onChange(year, Number(e.target.value))}
            className="w-full text-xs font-serif font-medium bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-amber-600"
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={name} value={i + 1}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-[10px] uppercase font-bold text-stone-500 mb-1">
            Year
          </span>
          <input
            type="number"
            value={year}
            onChange={(e) => onChange(Number(e.target.value), month)}
            className="w-full text-xs font-serif font-medium bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-amber-600"
          />
        </label>
      </div>
    </div>
  );
}
