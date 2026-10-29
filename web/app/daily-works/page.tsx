"use client";

import React, { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { HabitTable } from "@/components/HabitTable";
import { MonthSelector } from "@/components/MonthSelector";
import { api } from "@/lib/api";
import { CalendarCheck2, FolderOpen, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

export default function DailyWorksPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const { data: habits, mutate: mutateHabits } = useSWR("habits", api.habits.list);
  const { data: entries, mutate: mutateEntries } = useSWR(
    ["entries", year, month],
    () => api.entries.listForMonth(year, month)
  );

  return (
    <div className="space-y-6">
      {/* Header and Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-serif text-stone-500">
            <Link href="/" className="hover:text-amber-800 transition flex items-center gap-1">
              <ArrowLeft size={13} />
              <span>Study Desk</span>
            </Link>
            <span>/</span>
            <span className="flex items-center gap-1 text-amber-900 font-semibold">
              <FolderOpen size={13} className="text-amber-700" />
              <span>Shelves: Daily Works</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <CalendarCheck2 size={22} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
                Daily Works Checklist
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-serif">
                Check off each habit as you complete it. Progress syncs automatically with your monthly goals.
              </p>
            </div>
          </div>
        </div>

        {/* Month Selector Component */}
        <div className="shrink-0">
          <MonthSelector
            year={year}
            month={month}
            onChange={(y, m) => {
              setYear(y);
              setMonth(m);
            }}
          />
        </div>
      </div>

      {/* Main Habit Grid Table */}
      {habits && entries ? (
        <HabitTable
          year={year}
          month={month}
          habits={habits}
          entries={entries}
          onHabitsChange={() => mutateHabits()}
          onEntriesChange={() => mutateEntries()}
        />
      ) : (
        <div className="p-16 rounded-3xl bg-white border border-stone-200 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-600/20 border-t-amber-700 rounded-full animate-spin mx-auto"></div>
          <p className="text-stone-600 font-serif text-sm">Opening your Daily Works sheet…</p>
        </div>
      )}
    </div>
  );
}
