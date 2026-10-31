"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { BackupButtons } from "@/components/BackupButtons";
import { toISODate } from "@/lib/dates";
import {
  CalendarCheck2,
  CheckCircle2,
  Flame,
  Sparkles,
  ArrowRight,
  Clock,
  BookOpen,
  Coffee,
  FolderOpen,
  Target,
  Trophy,
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const today = useMemo(() => new Date(), []);
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const todayStr = useMemo(() => toISODate(today), [today]);

  const { data: habits, mutate: mutateHabits } = useSWR("habits", api.habits.list);
  const { data: entries, mutate: mutateEntries } = useSWR(
    ["entries", year, month],
    () => api.entries.listForMonth(year, month)
  );
  const { data: overview } = useSWR(["overview", year, month], () =>
    api.overview.get(year, month)
  );

  // Completed set for today
  const todayCompletedSet = useMemo(() => {
    const set = new Set<string>();
    if (!entries) return set;
    for (const e of entries) {
      if (e.completed && e.date.slice(0, 10) === todayStr) {
        set.add(e.habitId);
      }
    }
    return set;
  }, [entries, todayStr]);

  const toggleTodayHabit = async (habitId: string) => {
    const isCompleted = todayCompletedSet.has(habitId);
    await api.entries.toggle(habitId, todayStr, !isCompleted);
    mutateEntries();
  };

  const totalHabits = habits?.length ?? 0;
  const completedTodayCount = habits?.filter((h) => todayCompletedSet.has(h.id)).length ?? 0;
  const todayPercent = totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0;

  const monthPercent = overview?.monthly?.percent ?? 0;

  return (
    <div className="w-full space-y-6">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-serif font-semibold border border-amber-200">
              Autumn Semester 2026
            </span>
            <span className="text-xs text-stone-500">
              {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Welcome to Your Study Lounge, {user?.displayName || "Scholar"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/daily-works"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-serif text-sm font-medium shadow-sm transition"
          >
            <CalendarCheck2 size={16} />
            <span>Open Daily Works Sheet</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Main Home Split: Dashboard in Left Corner + Nostalgic Front Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* 1. LEFT CORNER DASHBOARD                                 */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-5">
          {/* Student Profile & Quick Status Card */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 text-white font-serif font-bold text-lg flex items-center justify-center shadow-md">
                  {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : "ST"}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    {user?.displayName || "Dedicated Student"}
                  </h3>
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Student Desk Active
                  </span>
                </div>
              </div>

              <BackupButtons />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-stone-100">
              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-center">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-800">
                  Today
                </span>
                <div className="text-lg font-bold text-amber-950 font-serif">
                  {completedTodayCount}/{totalHabits}
                </div>
                <span className="text-[10px] text-amber-700">{todayPercent}% done</span>
              </div>

              <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-100 text-center">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-sky-800">
                  Monthly
                </span>
                <div className="text-lg font-bold text-sky-950 font-serif">
                  {monthPercent}%
                </div>
                <span className="text-[10px] text-sky-700">goal pace</span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-800">
                  Active
                </span>
                <div className="text-lg font-bold text-emerald-950 font-serif">
                  {totalHabits}
                </div>
                <span className="text-[10px] text-emerald-700">habits set</span>
              </div>
            </div>
          </div>

          {/* Today's Habit Quick Checklist */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-amber-700" />
                <h3 className="font-serif font-bold text-sm text-stone-900">
                  Today&apos;s Checklist
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-sans">
                {completedTodayCount} of {totalHabits}
              </span>
            </div>

            {/* Habit rows */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {!habits ? (
                <p className="text-xs text-stone-400 py-4 text-center">Loading habits…</p>
              ) : habits.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-xs text-stone-500">No habits added yet.</p>
                  <Link
                    href="/daily-works"
                    className="text-xs text-amber-800 font-serif font-semibold hover:underline mt-1 inline-block"
                  >
                    + Add your first habit in Daily Works
                  </Link>
                </div>
              ) : (
                habits.map((habit) => {
                  const isChecked = todayCompletedSet.has(habit.id);
                  return (
                    <div
                      key={habit.id}
                      onClick={() => toggleTodayHabit(habit.id)}
                      className="group flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200/60 hover:border-amber-300/80 cursor-pointer transition select-none"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent div
                          className="h-4 w-4 cursor-pointer accent-amber-700 rounded"
                        />
                        <span
                          className={`text-xs font-serif truncate transition ${
                            isChecked
                              ? "line-through text-stone-400"
                              : "text-stone-800 font-medium group-hover:text-amber-950"
                          }`}
                        >
                          {habit.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono shrink-0 pl-2">
                        Goal: {habit.monthlyGoal}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <Link
              href="/daily-works"
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-serif text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <span>View Full Month Calendar</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Quick Motivational Snippet */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-stone-900 to-amber-950 text-amber-100 shadow-sm border border-stone-800">
            <div className="flex items-center gap-2 text-xs font-serif font-bold text-amber-300 mb-1">
              <Sparkles size={14} />
              <span>Nostalgic Scholar Discipline</span>
            </div>
            <p className="text-xs font-serif italic text-amber-200/90 leading-relaxed">
              "Success is neither magical nor mysterious. Success is the natural consequence of consistently applying basic fundamentals."
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. CENTER / HOME FRONT: NOSTALGIC MOTIVATION CENTERPIECE */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-6">
          {/* Nostalgic Art Frame */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-stone-300/80 shadow-xl bg-stone-900 group">
            <div className="relative w-full aspect-[16/9]">
              <Image
                src="/nostalgic_study_motivation.jpg"
                alt="Nostalgic Study Sanctuary"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />

              {/* Ambient atmospheric overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-stone-950/10"></div>

              {/* Top ambient badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-serif">
                  <Coffee size={14} className="text-amber-400" />
                  <span>The Quiet Study Desk</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-700 text-stone-300 text-xs font-sans">
                  <Clock size={13} className="text-amber-400" />
                  <span>Deep Work Session</span>
                </div>
              </div>

              {/* Bottom Quote & Motivation Header */}
              <div className="absolute bottom-6 left-6 right-6 z-10 text-white">
                <div className="flex items-center gap-2 text-xs font-serif uppercase tracking-widest text-amber-400 font-bold mb-1.5">
                  <Flame size={14} className="animate-pulse" />
                  <span>Daily Habit Focus</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-serif font-bold text-amber-50 drop-shadow-md">
                  Every Checkmark Is A Promise Kept To Yourself.
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 font-serif italic mt-1.5 max-w-xl drop-shadow">
                  In this quiet room of intention, let small consistent habits shape your mastery over the semester.
                </p>

                {/* Interactive Action Bar */}
                <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/20">
                  <Link
                    href="/daily-works"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-serif font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition"
                  >
                    <FolderOpen size={16} />
                    <span>Open "Daily Works" Folder</span>
                  </Link>

                  <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-xl bg-stone-900/80 hover:bg-stone-850 backdrop-blur-md border border-stone-600 text-amber-200 font-serif font-medium text-xs sm:text-sm flex items-center gap-2 transition"
                  >
                    <Trophy size={15} />
                    <span>Monthly Progress Charts</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Shelves & Folders Quick Explorer Cards */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Your Workspace Shelves
                </h3>
                <p className="text-xs text-stone-500">
                  Tip: Move your cursor to the far right edge of your screen anytime to reveal your expanding Shelves sideboard!
                </p>
              </div>
              <span className="text-xs font-serif font-medium text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                👉 Hover Right Edge
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <Link
                href="/daily-works"
                className="group p-4 rounded-2xl border border-stone-200/80 hover:border-amber-500/80 bg-stone-50/50 hover:bg-amber-50/30 transition-all shadow-sm hover:shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <CalendarCheck2 size={20} />
                </div>
                <h4 className="font-serif font-bold text-sm text-stone-900 group-hover:text-amber-950">
                  📁 Daily Works
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Full spreadsheet habit grid with monthly check-ins and goals.
                </p>
              </Link>

              <Link
                href="/dashboard"
                className="group p-4 rounded-2xl border border-stone-200/80 hover:border-sky-500/80 bg-stone-50/50 hover:bg-sky-50/30 transition-all shadow-sm hover:shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Target size={20} />
                </div>
                <h4 className="font-serif font-bold text-sm text-stone-900 group-hover:text-sky-950">
                  📊 Monthly Overview
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Consistency donuts, weekly performance bars, and trend lines.
                </p>
              </Link>

              <Link
                href="/progress"
                className="group p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-500/80 bg-stone-50/50 hover:bg-emerald-50/30 transition-all shadow-sm hover:shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Trophy size={20} />
                </div>
                <h4 className="font-serif font-bold text-sm text-stone-900 group-hover:text-emerald-950">
                  📈 Overall Progress
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Detailed habit completion vs. monthly goal progress bars.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
