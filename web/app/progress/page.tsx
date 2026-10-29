"use client";

import React, { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { MonthSelector } from "@/components/MonthSelector";
import { api } from "@/lib/api";
import { BarChart3, FolderOpen, ArrowLeft, Trophy, CheckCircle2 } from "lucide-react";

export default function ProgressPage() {
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
            <span className="flex items-center gap-1 text-emerald-900 font-semibold">
              <FolderOpen size={13} className="text-emerald-700" />
              <span>Shelves: Overall Progress</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              <BarChart3 size={22} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
                Overall Progress & Goals
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-serif">
                Completed vs. remaining check-ins toward each habit&apos;s monthly target.
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
          <div className="w-10 h-10 border-4 border-emerald-600/20 border-t-emerald-700 rounded-full animate-spin mx-auto"></div>
          <p className="text-stone-600 font-serif text-sm">Loading goal rankings…</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md overflow-hidden">
          <div className="p-4 sm:px-6 bg-gradient-to-r from-stone-50 via-white to-emerald-50/40 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-amber-600" />
              <span className="font-serif font-bold text-stone-900 text-sm">
                Habit Milestones & Target Pace
              </span>
            </div>
            <span className="text-xs text-stone-500 font-sans">
              {data.habitProgress.length} habits tracked
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="py-3 px-6 text-left text-xs font-serif font-bold uppercase tracking-wider text-stone-600">
                    Habit Name
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-serif font-bold uppercase tracking-wider text-stone-600 w-28">
                    Completed
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-serif font-bold uppercase tracking-wider text-stone-600 w-28">
                    Remaining
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-serif font-bold uppercase tracking-wider text-stone-600">
                    Monthly Progress
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data.habitProgress.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-stone-500 font-serif text-sm">
                      No habits recorded for this month yet.
                    </td>
                  </tr>
                ) : (
                  data.habitProgress.map((row) => (
                    <tr key={row.name} className="hover:bg-amber-50/20 transition-colors">
                      <td className="py-4 px-6 text-left font-serif font-medium text-stone-900 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                          <span>{row.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-serif text-sm font-bold text-emerald-800">
                        {row.completed}
                      </td>
                      <td className="py-4 px-4 text-center font-serif text-sm font-semibold text-stone-500">
                        {row.left}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-full rounded-full bg-stone-100 overflow-hidden border border-stone-200/60">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-amber-600 to-emerald-600 transition-all duration-500"
                              style={{ width: `${Math.min(row.percent, 100)}%` }}
                            />
                          </div>
                          <span className="w-12 shrink-0 text-xs font-serif font-bold text-stone-700">
                            {row.percent}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
