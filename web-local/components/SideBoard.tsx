"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Folder,
  FolderOpen,
  CalendarCheck2,
  LayoutDashboard,
  BarChart3,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Pin,
  Sparkles,
  BookOpen,
  LucideIcon,
} from "lucide-react";

interface ShelfFolder {
  id: string;
  name: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  color: string;
}

const folders: ShelfFolder[] = [
  {
    id: "daily-works",
    name: "Daily Works",
    subtitle: "Spreadsheet checklist & monthly habits",
    href: "/daily-works",
    icon: CalendarCheck2,
    badge: "Core Sheet",
    color: "from-amber-600 to-amber-800",
  },
  {
    id: "overview",
    name: "Monthly Overview",
    subtitle: "Consistency donut & weekly trends",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: "Analytics",
    color: "from-sky-600 to-indigo-800",
  },
  {
    id: "progress",
    name: "Overall Progress",
    subtitle: "Goal achievement & remaining checks",
    href: "/progress",
    icon: BarChart3,
    badge: "Rankings",
    color: "from-emerald-600 to-teal-800",
  },
  {
    id: "desk",
    name: "Study Desk",
    subtitle: "Nostalgic front lounge & daily focus",
    href: "/",
    icon: Coffee,
    badge: "Lounge",
    color: "from-stone-700 to-stone-900",
  },
];

export function SideBoard() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // If path is login, do not render sideboard
  if (pathname === "/login") return null;

  const isOpen = isHovered || isPinned;

  return (
    <>
      {/* Invisible Hover Sensor Zone along the rightmost edge */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        className="fixed top-0 right-0 w-8 h-full z-40 cursor-pointer pointer-events-auto"
        title="Move cursor here to reveal your Shelves & Folders"
        aria-hidden="true"
      />

      {/* Floating Peek Tab when collapsed */}
      {!isOpen && (
        <button
          onClick={() => setIsPinned(true)}
          onMouseEnter={() => setIsHovered(true)}
          className="fixed right-0 top-1/3 -translate-y-1/2 z-40 bg-stone-900/90 text-amber-300 backdrop-blur-md px-2.5 py-4 rounded-l-2xl shadow-xl border-l-2 border-y border-amber-500/40 flex flex-col items-center gap-2 group transition-all duration-300 hover:pr-4 hover:bg-stone-950"
          title="Click or hover to expand Shelves & Folders"
        >
          <Folder size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
          <span
            className="text-[11px] font-serif font-semibold tracking-widest text-amber-200/90 [writing-mode:vertical-rl] select-none"
          >
            SHELVES
          </span>
          <ChevronLeft size={14} className="text-amber-400/80 animate-pulse" />
        </button>
      )}

      {/* Expandable Sideboard Panel */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => !isPinned && setIsHovered(false)}
        className={clsx(
          "fixed top-0 right-0 h-full w-80 sm:w-96 z-50 bg-[#1c1917]/95 text-stone-100 backdrop-blur-2xl shadow-2xl border-l border-amber-900/30 flex flex-col transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Top Header of the Sideboard */}
        <div className="p-5 border-b border-stone-800/80 flex items-center justify-between bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <BookOpen size={18} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base tracking-wide text-amber-100 flex items-center gap-1.5">
                <span>Student Shelves</span>
                <Sparkles size={13} className="text-amber-400" />
              </h3>
              <p className="text-[11px] text-stone-400 font-sans">Workspace Folders & Sheets</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Pin Toggle Button */}
            <button
              onClick={() => setIsPinned(!isPinned)}
              title={isPinned ? "Unpin sidebar" : "Pin sidebar open"}
              className={clsx(
                "p-1.5 rounded-lg text-xs font-medium transition-colors border",
                isPinned
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200"
              )}
            >
              <Pin size={14} className={clsx(isPinned && "rotate-45")} />
            </button>

            {/* Close / Collapse Button */}
            <button
              onClick={() => {
                setIsPinned(false);
                setIsHovered(false);
              }}
              title="Collapse shelves"
              className="p-1.5 rounded-lg bg-stone-800 text-stone-400 border border-stone-700 hover:text-white transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Shelf Content / Folders List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold text-amber-400/80 px-1">
            <span>Your Active Binders</span>
            <span>4 Sections</span>
          </div>

          <div className="space-y-3">
            {folders.map((folder) => {
              const isActive =
                folder.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(folder.href);
              const Icon = folder.icon;

              return (
                <Link
                  key={folder.id}
                  href={folder.href}
                  onClick={() => {
                    if (!isPinned) setIsHovered(false);
                  }}
                  className={clsx(
                    "group relative block p-4 rounded-2xl border transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-stone-800 to-amber-950/70 border-amber-500/60 shadow-lg shadow-amber-950/40 scale-[1.02]"
                      : "bg-stone-900/60 hover:bg-stone-850 border-stone-800/80 hover:border-stone-700"
                  )}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Folder Tab Visual */}
                    <div
                      className={clsx(
                        "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105",
                        isActive
                          ? "bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 border-amber-300 font-bold shadow-md shadow-amber-900/40"
                          : "bg-stone-800 text-amber-400 border-stone-700 group-hover:border-amber-500/40"
                      )}
                    >
                      {isActive ? <FolderOpen size={20} /> : <Icon size={20} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={clsx(
                            "font-serif font-semibold text-sm truncate",
                            isActive ? "text-amber-100" : "text-stone-200 group-hover:text-amber-200"
                          )}
                        >
                          {folder.name}
                        </h4>
                        {folder.badge && (
                          <span
                            className={clsx(
                              "text-[10px] font-sans px-2 py-0.5 rounded-full font-medium shrink-0",
                              isActive
                                ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                                : "bg-stone-800 text-stone-400 border border-stone-700"
                            )}
                          >
                            {folder.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 mt-1 line-clamp-1 font-sans">
                        {folder.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Active Indicator Accent Line */}
                  {isActive && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-amber-400 rounded-r-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Wooden Shelf Divider Visual */}
          <div className="my-6 pt-4 border-t border-stone-800/90">
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/30 text-amber-200/90 text-xs font-serif leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                <span>💡 Study Tip</span>
              </div>
              <p className="opacity-90">
                Click on <strong className="text-amber-300 font-medium">Daily Works</strong> above anytime to check off your habits on the full monthly grid.
              </p>
            </div>
          </div>
        </div>

        {/* Footer with Pin Hint */}
        <div className="p-4 border-t border-stone-800/80 bg-stone-950/90 text-[11px] text-stone-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Cursor right to peek</span>
          </span>
          <button
            onClick={() => setIsPinned(!isPinned)}
            className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
          >
            {isPinned ? "Unpin Drawer" : "Keep Drawer Pinned"}
          </button>
        </div>
      </aside>
    </>
  );
}
