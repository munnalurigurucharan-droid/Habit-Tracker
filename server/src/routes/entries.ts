import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthedRequest } from "../middleware/auth";
import { ApiError } from "../middleware/errorHandler";

const router = Router();

// GET /api/entries?year=2025&month=1
// Returns every checkbox state for the given month, keyed for the grid.
router.get("/", async (req: AuthedRequest, res, next) => {
  try {
    const { year, month } = z
      .object({ year: z.coerce.number(), month: z.coerce.number().min(1).max(12) })
      .parse(req.query);

    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));

    const entries = await prisma.habitEntry.findMany({
      where: {
        date: { gte: start, lt: end },
        habit: { userId: req.userId! },
      },
    });
    res.json(entries);
  } catch (err) {
    next(err);
  }
});

const toggleSchema = z.object({
  habitId: z.string(),
  date: z.coerce.date(), // single day, e.g. "2025-01-03"
  completed: z.boolean(),
});

// PUT /api/entries/toggle    -> checkbox click handler (idempotent upsert)
router.put("/toggle", async (req: AuthedRequest, res, next) => {
  try {
    const { habitId, date, completed } = toggleSchema.parse(req.body);

    const habit = await prisma.habit.findFirst({ where: { id: habitId, userId: req.userId! } });
    if (!habit) throw new ApiError(404, "Habit not found");

    const entry = await prisma.habitEntry.upsert({
      where: { habitId_date: { habitId, date } },
      update: { completed },
      create: { habitId, date, completed },
    });
    res.json(entry);
  } catch (err) {
    next(err);
  }
});

export default router;
