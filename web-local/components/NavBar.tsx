"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Coffee,
  CalendarCheck2,
  LayoutDashboard,
  BarChart3,
  BookOpen,
  FolderOpen,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { BackupButtons } from "@/components/BackupButtons";

const links = [
  { href: "/", label: "Study Desk", icon: Coffee },
  { href: "/daily-works", label: "Daily Works", icon: CalendarCheck2 },
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/progress", label: "Progress", icon: BarChart3 },
];

export function NavBar() {
  const pathname = usePathname();
  const { user } = useAuth();

  // If on login page, don't show the main navbar
  if (pathname === "/login") return null;

  return (
    <header className="sticky top-0 z-30 bg-[#faf8f5]/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 sm:px-6 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-700 to-stone-900 text-amber-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <BookOpen size={18} />
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-stone-900 tracking-tight block">
              Habit Journal
            </span>
            <span className="text-[10px] uppercase font-sans tracking-widest text-amber-800 font-semibold block -mt-1">
              Student Edition
            </span>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-stone-100/80 p-1 rounded-2xl border border-stone-200/60">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-serif font-semibold transition-all duration-150",
                  isActive
                    ? "bg-amber-800 text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
                )}
              >
                <Icon size={14} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side: User & Shelves Hint */}
        <div className="flex items-center gap-3">
          {/* Shelves quick hint */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-stone-500 font-serif px-2 py-1 rounded-lg bg-stone-100/60 border border-stone-200/50">
            <FolderOpen size={13} className="text-amber-700" />
            <span>Shelves on right edge 👉</span>
          </div>

          {/* User Profile Pill */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center font-serif text-xs font-bold">
                {user.displayName ? user.displayName.slice(0, 2).toUpperCase() : "ST"}
              </div>
              <span className="hidden sm:inline font-serif text-xs font-medium text-stone-800 truncate max-w-[120px]">
                {user.displayName}
              </span>
              <BackupButtons />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
