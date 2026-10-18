import { z } from "zod";

const MAX_NAME_LENGTH = 30;
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const count = z.number().int().nonnegative();

export const progressSchema = z.object({
  xp: count,
  streak: count,
  lastPracticeDay: z.string().regex(DAY_PATTERN).nullable(),
  dailyXp: count,
  completed: z.record(z.string(), count),
  pendingReviews: z.record(z.string(), count),
  perfectLessons: count,
  bestCombo: count,
  badges: z.array(z.string()),
  outfit: z.string().nullable(),
});

export const loginSchema = z.object({
  name: z.string().trim().min(1).max(MAX_NAME_LENGTH),
  password: z.string().min(1),
});
