import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthedRequest } from "../middleware/auth";

const router = Router();

const querySchema = z.object({ year: z.coerce.number(), month: z.coerce.number().min(1).max(12) });

// GET /api/overview?year=2025&month=1
// One call that powers the entire Dashboard screen:
//  - dailyProgress: [{ date, percent }]           -> line chart
//  - weekly: [{ weekLabel, completed[], goal, left, percent }] -> bar chart + table
//  - monthly: { completed, total, percent }        -> donut chart
//  - topHabits: [{ name, completions }]            -> "TOP 10 DAILY HABITS"
//  - habitProgress: [{ name, completed, left, percent }] -> "OVERALL PROGRESS" bars
router.get("/", async (req: AuthedRequest, res, next) => {
  try {
    const { year, month } = querySchema.parse(req.query);
    const userId = req.userId!;

    const habits = await prisma.habit.findMany({
      where: { userId, isArchived: false },
      orderBy: { sortOrder: "asc" },
    });

    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

    const entries = await prisma.habitEntry.findMany({
      where: { date: { gte: start, lt: end }, habit: { userId } },
    });

    const completedByDay = new Map<string, number>();
    const completedByHabit = new Map<string, number>();
    for (const e of entries) {
      if (!e.completed) continue;
      const key = e.date.toISOString().slice(0, 10);
      completedByDay.set(key, (completedByDay.get(key) ?? 0) + 1);
      completedByHabit.set(e.habitId, (completedByHabit.get(e.habitId) ?? 0) + 1);
    }

    const habitCount = habits.length || 1;

    // Daily % completion across the whole month (line chart)
    const dailyProgress = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(Date.UTC(year, month - 1, i + 1)).toISOString().slice(0, 10);
      const completed = completedByDay.get(date) ?? 0;
      return { date, percent: Math.round((completed / habitCount) * 100) };
    });

    // Weekly buckets of 7 days each (sheet groups Wed-Tue)
    const weeks: { weekLabel: string; completed: number; goal: number }[] = [];
    for (let i = 0; i < daysInMonth; i += 7) {
      const slice = dailyProgress.slice(i, i + 7);
      const completed = slice.reduce(
        (sum, d) => sum + (completedByDay.get(d.date) ?? 0),
        0
      );
      weeks.push({
        weekLabel: `WEEK ${weeks.length + 1}`,
        completed,
        goal: slice.length * habitCount,
      });
    }
    const weekly = weeks.map((w) => ({
      ...w,
      left: w.goal - w.completed,
      percent: w.goal ? Math.round((w.completed / w.goal) * 100) : 0,
    }));

    const totalGoal = habits.reduce((s, h) => s + h.monthlyGoal, 0);
    const totalCompleted = [...completedByHabit.values()].reduce((s, n) => s + n, 0);
    const monthly = {
      completed: totalCompleted,
      total: totalGoal,
      percent: totalGoal ? Math.round((totalCompleted / totalGoal) * 100) : 0,
    };

    const topHabits = habits
      .map((h) => ({ name: h.name, completions: completedByHabit.get(h.id) ?? 0 }))
      .sort((a, b) => b.completions - a.completions)
      .slice(0, 10);

    const habitProgress = habits.map((h) => {
      const completed = completedByHabit.get(h.id) ?? 0;
      const left = Math.max(h.monthlyGoal - completed, 0);
      return {
        name: h.name,
        completed,
        left,
        percent: h.monthlyGoal ? Math.round((completed / h.monthlyGoal) * 100) : 0,
      };
    });

    res.json({ dailyProgress, weekly, monthly, topHabits, habitProgress });
  } catch (err) {
    next(err);
  }
});

export default router;
