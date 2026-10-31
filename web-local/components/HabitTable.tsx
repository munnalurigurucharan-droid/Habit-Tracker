"use client";

import React, { useMemo, useState } from "react";
import { Plus, Trash2, Check, Sparkles, Target } from "lucide-react";
import { buildCalendarWeeks, toISODate } from "@/lib/dates";
import { api } from "@/lib/api";
import type { Habit, HabitEntry } from "@/types/habit";
import clsx from "clsx";

interface Props {
  year: number;
  month: number;
  habits: Habit[];
  entries: HabitEntry[];
  onHabitsChange: () => void;
  onEntriesChange: () => void;
}

export function HabitTable({
  year,
  month,
  habits,
  entries,
  onHabitsChange,
  onEntriesChange,
}: Props) {
  const weeks = useMemo(() => buildCalendarWeeks(year, month), [year, month]);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitGoal, setNewHabitGoal] = useState("30");
  const [isAdding, setIsAdding] = useState(false);

  // Today's iso string "YYYY-MM-DD"
  const today = useMemo(() => new Date(), []);
  const todayDateStr = useMemo(() => toISODate(today), [today]);

  const completedSet = useMemo(() => {
    const set = new Set<string>();
    for (const e of entries) {
      if (e.completed) set.add(`${e.habitId}|${e.date.slice(0, 10)}`);
    }
    return set;
  }, [entries]);

  // Map of habitId -> number of completed days in this month
  const completionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of entries) {
      if (e.completed) {
        counts.set(e.habitId, (counts.get(e.habitId) || 0) + 1);
      }
    }
    return counts;
  }, [entries]);

  async function toggleCell(habitId: string, date: string) {
    const key = `${habitId}|${date}`;
    const nowCompleted = !completedSet.has(key);
    // Optimistic UI toggle
    await api.entries.toggle(habitId, date, nowCompleted);
    onEntriesChange();
  }

  async function addHabit() {
    if (!newHabitName.trim()) return;
    setIsAdding(true);
    try {
      const goal = parseInt(newHabitGoal, 10) || 30;
      await api.habits.create({ name: newHabitName.trim(), monthlyGoal: goal });
      setNewHabitName("");
      setNewHabitGoal("30");
      onHabitsChange();
    } finally {
      setIsAdding(false);
    }
  }

  async function removeHabit(id: string) {
    if (!confirm("Archive this habit from your sheet?")) return;
    await api.habits.remove(id);
    onHabitsChange();
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md overflow-hidden">
      {/* Top Sheet Toolbar */}
      <div className="p-4 sm:px-6 bg-gradient-to-r from-stone-50 via-white to-amber-50/40 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span className="font-serif font-bold text-stone-900 text-sm">
            Interactive Spreadsheet Grid
          </span>
          <span className="text-xs text-stone-400 font-sans">
            ({habits.length} habits tracking)
          </span>
        </div>

        {/* Quick Add Habit Bar */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addHabit()}
            placeholder="New habit name (e.g. Read 30m)…"
            className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500 w-full sm:w-64"
          />
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs text-stone-500 font-serif">Goal:</span>
            <input
              type="number"
              value={newHabitGoal}
              onChange={(e) => setNewHabitGoal(e.target.value)}
              className="w-14 px-2 py-1.5 rounded-xl border border-stone-300 text-xs text-center text-stone-900 focus:outline-none focus:border-amber-600"
              title="Target days this month"
            />
          </div>
          <button
            onClick={addHabit}
            disabled={isAdding || !newHabitName.trim()}
            className="px-3 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white font-serif text-xs font-semibold flex items-center gap-1 transition shrink-0"
          >
            <Plus size={14} />
            <span>Add Row</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            {/* Week Headers */}
            <tr>
              <th className="sticky left-0 z-20 bg-stone-100 text-stone-800 text-xs font-serif font-bold uppercase tracking-wider px-4 py-3 text-left border-b border-r border-stone-200 min-w-[220px]">
                Habit Name
              </th>
              <th className="bg-stone-100 text-stone-800 text-xs font-serif font-bold uppercase tracking-wider px-2 py-3 text-center border-b border-r border-stone-200 w-16">
                Goal
              </th>
              <th className="bg-stone-100 text-stone-800 text-xs font-serif font-bold uppercase tracking-wider px-2 py-3 text-center border-b border-r border-stone-200 w-16">
                Done
              </th>
              {weeks.map((w) => (
                <th
                  key={w.label}
                  colSpan={w.days.length}
                  className="bg-stone-100 text-stone-700 text-xs font-serif font-semibold uppercase tracking-wider py-2 text-center border-b border-r border-stone-200"
                >
                  {w.label}
                </th>
              ))}
            </tr>

            {/* Day of Week + Day Number */}
            <tr>
              <th className="sticky left-0 z-20 bg-stone-50 border-b border-r border-stone-200"></th>
              <th className="bg-stone-50 border-b border-r border-stone-200"></th>
              <th className="bg-stone-50 border-b border-r border-stone-200"></th>
              {weeks.map((w) =>
                w.days.map((d) => {
                  const isCurrentDay = d.date === todayDateStr;
                  return (
                    <th
                      key={d.date}
                      className={clsx(
                        "text-[11px] font-sans border-b border-r border-stone-200 w-9 min-w-[36px] py-1 text-center transition-colors",
                        isCurrentDay ? "bg-amber-100/80 text-amber-950 font-bold" : "bg-stone-50 text-stone-600"
                      )}
                    >
                      <div className="text-[10px] uppercase opacity-75">{d.weekday}</div>
                      <div
                        className={clsx(
                          "w-5 h-5 mx-auto rounded-full flex items-center justify-center font-serif text-xs",
                          isCurrentDay ? "bg-amber-600 text-white font-bold" : "text-stone-800"
                        )}
                      >
                        {d.day}
                      </div>
                    </th>
                  );
                })
              )}
            </tr>
          </thead>

          <tbody>
            {habits.length === 0 ? (
              <tr>
                <td
                  colSpan={3 + weeks.reduce((sum, w) => sum + w.days.length, 0)}
                  className="p-12 text-center text-stone-500 font-serif text-sm"
                >
                  <p>Your habit sheet is empty.</p>
                  <p className="text-xs text-stone-400 mt-1">
                    Use the "New habit name" bar above to create your first habit row!
                  </p>
                </td>
              </tr>
            ) : (
              habits.map((habit) => {
                const count = completionCounts.get(habit.id) || 0;
                const percent = Math.min(100, Math.round((count / (habit.monthlyGoal || 30)) * 100));

                return (
                  <tr key={habit.id} className="group hover:bg-amber-50/20 transition-colors">
                    {/* Habit Label (Sticky) */}
                    <td className="sticky left-0 z-10 bg-white group-hover:bg-[#faf7f2] border-b border-r border-stone-200 px-4 py-2 text-left">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="font-serif font-medium text-xs sm:text-sm text-stone-900 block truncate">
                            {habit.name}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-16 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                              <div
                                className="h-full bg-amber-600 rounded-full"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-stone-400">{percent}%</span>
                          </div>
                        </div>

                        <button
                          onClick={() => removeHabit(habit.id)}
                          className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-rose-600 p-1 rounded transition"
                          title="Archive habit"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>

                    {/* Goal */}
                    <td className="border-b border-r border-stone-200 text-center font-serif text-xs font-semibold text-stone-600 bg-stone-50/50">
                      {habit.monthlyGoal}
                    </td>

                    {/* Done */}
                    <td className="border-b border-r border-stone-200 text-center font-serif text-xs font-bold text-amber-900 bg-amber-50/30">
                      {count}
                    </td>

                    {/* Day Checkboxes */}
                    {weeks.map((w) =>
                      w.days.map((d) => {
                        const isChecked = completedSet.has(`${habit.id}|${d.date}`);
                        const isCurrentDay = d.date === todayDateStr;

                        return (
                          <td
                            key={d.date}
                            onClick={() => toggleCell(habit.id, d.date)}
                            className={clsx(
                              "border-b border-r border-stone-200 text-center p-0.5 cursor-pointer transition-colors",
                              isChecked
                                ? "bg-amber-50/70"
                                : isCurrentDay
                                ? "bg-amber-50/30"
                                : "hover:bg-stone-50"
                            )}
                          >
                            <div className="flex items-center justify-center h-8">
                              <div
                                className={clsx(
                                  "w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-150",
                                  isChecked
                                    ? "bg-amber-700 border-amber-800 text-white shadow-sm scale-100"
                                    : "border-stone-300 bg-white hover:border-amber-500 scale-90 opacity-60 hover:opacity-100"
                                )}
                              >
                                {isChecked && <Check size={13} strokeWidth={3} />}
                              </div>
                            </div>
                          </td>
                        );
                      })
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
