"use client";

import React, { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { MonthSelector } from "@/components/MonthSelector";
import { ProgressLineChart } from "@/components/ProgressLineChart";
import { MonthlyDonut } from "@/components/MonthlyDonut";
import { WeeklyOverview } from "@/components/WeeklyOverview";
import { TopHabitsList } from "@/components/TopHabitsList";
import { api } from "@/lib/api";
import { LayoutDashboard, FolderOpen, ArrowLeft } from "lucide-react";

export default function DashboardPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const { data } = useSWR(["overview", year, month], () => api.overview.get(year, month));

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
            <span className="flex items-center gap-1 text-sky-900 font-semibold">
              <FolderOpen size={13} className="text-sky-700" />
              <span>Shelves: Monthly Overview</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-900 flex items-center justify-center font-bold">
              <LayoutDashboard size={22} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
                Monthly Overview & Consistency
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-serif">
                Comprehensive analytics of your daily discipline, weekly volume, and habit goals.
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

      {!data ? (
        <div className="p-16 rounded-3xl bg-white border border-stone-200 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-sky-600/20 border-t-sky-700 rounded-full animate-spin mx-auto"></div>
          <p className="text-stone-600 font-serif text-sm">Calculating consistency analytics…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-6">
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
              <ProgressLineChart data={data.dailyProgress} />
            </div>
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
              <WeeklyOverview weekly={data.weekly} />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
              <MonthlyDonut summary={data.monthly} />
            </div>
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
              <TopHabitsList habits={data.topHabits} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
