import { z } from "zod";

export const MAX_NAME_LENGTH = 30;
export const MIN_PASSWORD_LENGTH = 4;
const MAX_PASSWORD_LENGTH = 100;
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
  outfits: z.array(z.string()).default([]),
  stars: z.record(z.string(), count).default({}),
  endlessRecord: count.default(0),
});

const username = z
  .string()
  .trim()
  .min(1, "Skriv ditt användarnamn")
  .max(MAX_NAME_LENGTH, `Användarnamnet får vara högst ${MAX_NAME_LENGTH} tecken`);

export const loginSchema = z.object({
  name: username,
  password: z.string().min(1, "Skriv ditt lösenord").max(MAX_PASSWORD_LENGTH),
});

export const signupSchema = z.object({
  name: username,
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `Lösenordet måste vara minst ${MIN_PASSWORD_LENGTH} tecken`)
    .max(MAX_PASSWORD_LENGTH, `Lösenordet får vara högst ${MAX_PASSWORD_LENGTH} tecken`),
});
