"use client";

import { useState } from "react";
import useSWR from "swr";
import { HabitTable } from "@/components/HabitTable";
import { MonthSelector } from "@/components/MonthSelector";
import { api } from "@/lib/api";

export default function TrackerPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const { data: habits, mutate: mutateHabits } = useSWR("habits", api.habits.list);
  const { data: entries, mutate: mutateEntries } = useSWR(
    ["entries", year, month],
    () => api.entries.listForMonth(year, month)
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <MonthSelector year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />
        <div>
          <h1 className="text-2xl font-bold">Daily Habits.</h1>
          <p className="text-sm text-brand-600">
            Check off each habit as you complete it. Your goal is the target number of
            days this month — progress rolls up automatically into the Overview tab.
          </p>
        </div>
      </div>

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
        <div className="card p-8 text-center text-brand-500">Loading…</div>
      )}
    </div>
  );
}
