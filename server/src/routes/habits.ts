import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthedRequest } from "../middleware/auth";
import { ApiError } from "../middleware/errorHandler";

const router = Router();

const createSchema = z.object({
  name: z.string().min(1).max(80),
  monthlyGoal: z.number().int().min(1).max(31).default(30),
  sortOrder: z.number().int().optional(),
});

const updateSchema = createSchema.partial();

// GET /api/habits            -> list active habits, ordered
router.get("/", async (req: AuthedRequest, res, next) => {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: req.userId!, isArchived: false },
      orderBy: { sortOrder: "asc" },
    });
    res.json(habits);
  } catch (err) {
    next(err);
  }
});

// POST /api/habits           -> add a new row to the tracker
router.post("/", async (req: AuthedRequest, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const count = await prisma.habit.count({ where: { userId: req.userId! } });
    const habit = await prisma.habit.create({
      data: { ...data, sortOrder: data.sortOrder ?? count, userId: req.userId! },
    });
    res.status(201).json(habit);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/habits/:id      -> rename, change goal, reorder
router.patch("/:id", async (req: AuthedRequest, res, next) => {
  try {
    const data = updateSchema.parse(req.body);
    const habit = await prisma.habit.findFirst({ where: { id: req.params.id, userId: req.userId! } });
    if (!habit) throw new ApiError(404, "Habit not found");

    const updated = await prisma.habit.update({ where: { id: habit.id }, data });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/habits/:id     -> archive (soft delete) a habit row
router.delete("/:id", async (req: AuthedRequest, res, next) => {
  try {
    const habit = await prisma.habit.findFirst({ where: { id: req.params.id, userId: req.userId! } });
    if (!habit) throw new ApiError(404, "Habit not found");

    await prisma.habit.update({ where: { id: habit.id }, data: { isArchived: true } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// PATCH /api/habits/reorder  -> bulk update sortOrder after drag-and-drop
router.patch("/reorder/bulk", async (req: AuthedRequest, res, next) => {
  try {
    const body = z.array(z.object({ id: z.string(), sortOrder: z.number().int() })).parse(req.body);
    await prisma.$transaction(
      body.map((row) =>
        prisma.habit.update({
          where: { id: row.id, userId: req.userId! } as any,
          data: { sortOrder: row.sortOrder },
        })
      )
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
