import type { Habit, HabitEntry, OverviewResponse } from "@/types/habit";

/**
 * Local-first data layer.
 * Everything lives in THIS browser's localStorage. Nothing is sent to any
 * server, so the site owner never sees anyone's habits.
 * Same shape as the old HTTP client, so no component needs to change.
 */

const KEY = "habit-journal:v1";

interface Store {
  habits: Habit[];
  entries: HabitEntry[];
}

function load(): Store {
  if (typeof window === "undefined") return { habits: [], entries: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Store;
  } catch {
    /* corrupted or blocked storage -> start empty */
  }
  return { habits: [], entries: [] };
}

function save(store: Store) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

const uid = () => crypto.randomUUID();
const pad = (n: number) => String(n).padStart(2, "0");
const monthPrefix = (y: number, m: number) => `${y}-${pad(m)}-`;

const activeHabits = (s: Store) =>
  s.habits.filter((h) => !h.isArchived).sort((a, b) => a.sortOrder - b.sortOrder);

export const api = {
  habits: {
    list: async (): Promise<Habit[]> => activeHabits(load()),

    create: async (data: Partial<Habit>): Promise<Habit> => {
      const s = load();
      const habit: Habit = {
        id: uid(),
        name: (data.name ?? "").trim().slice(0, 80),
        monthlyGoal: data.monthlyGoal ?? 30,
        sortOrder: data.sortOrder ?? s.habits.length,
        isArchived: false,
      };
      s.habits.push(habit);
      save(s);
      return habit;
    },

    update: async (id: string, data: Partial<Habit>): Promise<Habit> => {
      const s = load();
      const h = s.habits.find((x) => x.id === id);
      if (!h) throw new Error("Habit not found");
      Object.assign(h, data, { id: h.id });
      save(s);
      return h;
    },

    remove: async (id: string): Promise<void> => {
      const s = load();
      const h = s.habits.find((x) => x.id === id);
      if (h) h.isArchived = true; // soft delete, like before
      save(s);
    },

    reorder: async (rows: { id: string; sortOrder: number }[]): Promise<void> => {
      const s = load();
      for (const r of rows) {
        const h = s.habits.find((x) => x.id === r.id);
        if (h) h.sortOrder = r.sortOrder;
      }
      save(s);
    },
  },

  entries: {
    listForMonth: async (year: number, month: number): Promise<HabitEntry[]> => {
      const prefix = monthPrefix(year, month);
      return load().entries.filter((e) => e.date.startsWith(prefix));
    },

    toggle: async (habitId: string, date: string, completed: boolean): Promise<HabitEntry> => {
      const s = load();
      let entry = s.entries.find((e) => e.habitId === habitId && e.date === date);
      if (entry) entry.completed = completed;
      else {
        entry = { id: uid(), habitId, date, completed };
        s.entries.push(entry);
      }
      save(s);
      return entry;
    },
  },

  overview: {
    get: async (year: number, month: number): Promise<OverviewResponse> => {
      const s = load();
      const habits = activeHabits(s);
      const prefix = monthPrefix(year, month);
      const activeIds = new Set(habits.map((h) => h.id));
      const entries = s.entries.filter(
        (e) => e.completed && e.date.startsWith(prefix) && activeIds.has(e.habitId)
      );
      const daysInMonth = new Date(year, month, 0).getDate();

      const byDay = new Map<string, number>();
      const byHabit = new Map<string, number>();
      for (const e of entries) {
        byDay.set(e.date, (byDay.get(e.date) ?? 0) + 1);
        byHabit.set(e.habitId, (byHabit.get(e.habitId) ?? 0) + 1);
      }
      const habitCount = habits.length || 1;

      const dailyProgress = Array.from({ length: daysInMonth }, (_, i) => {
        const date = `${prefix}${pad(i + 1)}`;
        return { date, percent: Math.round(((byDay.get(date) ?? 0) / habitCount) * 100) };
      });

      const weekly = [];
      for (let i = 0; i < daysInMonth; i += 7) {
        const slice = dailyProgress.slice(i, i + 7);
        const completed = slice.reduce((sum, d) => sum + (byDay.get(d.date) ?? 0), 0);
        const goal = slice.length * habitCount;
        weekly.push({
          weekLabel: `WEEK ${weekly.length + 1}`,
          completed,
          goal,
          left: goal - completed,
          percent: goal ? Math.round((completed / goal) * 100) : 0,
        });
      }

      const totalGoal = habits.reduce((n, h) => n + h.monthlyGoal, 0);
      const totalCompleted = [...byHabit.values()].reduce((n, v) => n + v, 0);

      return {
        dailyProgress,
        weekly,
        monthly: {
          completed: totalCompleted,
          total: totalGoal,
          percent: totalGoal ? Math.round((totalCompleted / totalGoal) * 100) : 0,
        },
        topHabits: habits
          .map((h) => ({ name: h.name, completions: byHabit.get(h.id) ?? 0 }))
          .sort((a, b) => b.completions - a.completions)
          .slice(0, 10),
        habitProgress: habits.map((h) => {
          const completed = byHabit.get(h.id) ?? 0;
          return {
            name: h.name,
            completed,
            left: Math.max(h.monthlyGoal - completed, 0),
            percent: h.monthlyGoal ? Math.round((completed / h.monthlyGoal) * 100) : 0,
          };
        }),
      };
    },
  },

  // Backup / restore: the only way data moves between devices, since there is no server.
  backup: {
    exportJson: (): string => JSON.stringify(load(), null, 2),
    importJson: (json: string) => {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed?.habits) || !Array.isArray(parsed?.entries)) {
        throw new Error("This doesn't look like a Habit Journal backup file.");
      }
      save({ habits: parsed.habits, entries: parsed.entries });
    },
  },
};
