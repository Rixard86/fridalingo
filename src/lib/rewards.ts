import { isLessonKind, LESSON_KINDS, REVIEW_KEY } from "./lessons";
import type { Progress } from "./types";

export const LEVEL_XP = 50;
export const DAILY_GOAL_XP = 30;

const FIRST_STEP_LESSONS = 1;
const SHORT_STREAK_DAYS = 3;
const LONG_STREAK_DAYS = 7;
const FAST_COMBO = 10;
const SMALL_XP = 100;
const BIG_XP = 500;
const PERFECTIONIST_LESSONS = 10;
const ENDLESS_GOOD_SCORE = 25;
const ENDLESS_GREAT_SCORE = 50;
const WEEK_PATTERN = /^\d+$/;

export interface Badge {
  id: string;
  emoji: string;
  title: string;
  description: string;
  isEarned: (progress: Progress) => boolean;
}

export interface Outfit {
  id: string;
  name: string;
  level: number;
}

function totalCompleted(progress: Progress): number {
  return Object.values(progress.completed).reduce((sum, count) => sum + count, 0);
}

function hasMasteredAWeek(progress: Progress): boolean {
  const kindsPerWeek = new Map<string, number>();
  for (const key of Object.keys(progress.completed)) {
    const [week, kind = ""] = key.split("/");
    if (!WEEK_PATTERN.test(week) || !isLessonKind(kind)) continue;
    kindsPerWeek.set(week, (kindsPerWeek.get(week) ?? 0) + 1);
  }
  return [...kindsPerWeek.values()].some((count) => count >= LESSON_KINDS.length);
}

export const BADGES: Badge[] = [
  { id: "forsta-steget", emoji: "🐣", title: "Första steget", description: "Klara din första lektion", isEarned: (p) => totalCompleted(p) >= FIRST_STEP_LESSONS },
  { id: "felfri", emoji: "⭐", title: "Felfri", description: "Klara en lektion utan fel", isEarned: (p) => p.perfectLessons >= FIRST_STEP_LESSONS },
  { id: "svit-3", emoji: "🔥", title: "Het gås", description: "Öva 3 dagar i rad", isEarned: (p) => p.streak >= SHORT_STREAK_DAYS },
  { id: "svit-7", emoji: "🏆", title: "En hel vecka", description: "Öva 7 dagar i rad", isEarned: (p) => p.streak >= LONG_STREAK_DAYS },
  { id: "kombo-10", emoji: "⚡", title: "Blixtsnabb", description: "10 rätt i rad", isEarned: (p) => p.bestCombo >= FAST_COMBO },
  { id: "xp-100", emoji: "💯", title: "Hundra!", description: "Samla 100 XP", isEarned: (p) => p.xp >= SMALL_XP },
  { id: "xp-500", emoji: "🚀", title: "Raketgås", description: "Samla 500 XP", isEarned: (p) => p.xp >= BIG_XP },
  { id: "veckomastare", emoji: "👑", title: "Veckomästare", description: "Klara alla lektioner i en vecka", isEarned: hasMasteredAWeek },
  { id: "minnesmastare", emoji: "🧠", title: "Minnesmästare", description: "Klara en repetition", isEarned: (p) => (p.completed[REVIEW_KEY] ?? 0) >= FIRST_STEP_LESSONS },
  { id: "endless-25", emoji: "🛡️", title: "Överlevare", description: "25 poäng i Endless", isEarned: (p) => p.endlessRecord >= ENDLESS_GOOD_SCORE },
  { id: "endless-50", emoji: "♾️", title: "Oändlig", description: "50 poäng i Endless", isEarned: (p) => p.endlessRecord >= ENDLESS_GREAT_SCORE },
  { id: "perfektionist", emoji: "🌟", title: "Perfektionist", description: "10 felfria lektioner", isEarned: (p) => p.perfectLessons >= PERFECTIONIST_LESSONS },
];

export const OUTFITS: Outfit[] = [
  { id: "keps", name: "Keps", level: 2 },
  { id: "solglasogon", name: "Solglasögon", level: 3 },
  { id: "fluga", name: "Fluga", level: 4 },
  { id: "partyhatt", name: "Partyhatt", level: 6 },
  { id: "krona", name: "Krona", level: 8 },
];

export function levelFor(xp: number): number {
  return Math.floor(xp / LEVEL_XP) + 1;
}

export function levelRatio(xp: number): number {
  return (xp % LEVEL_XP) / LEVEL_XP;
}

export function newlyEarnedBadges(progress: Progress): Badge[] {
  return BADGES.filter((badge) => !progress.badges.includes(badge.id) && badge.isEarned(progress));
}

export function isOutfitUnlocked(outfit: Pick<Outfit, "level">, xp: number): boolean {
  return levelFor(xp) >= outfit.level;
}

export function newlyUnlockedOutfits(previousXp: number, currentXp: number): Outfit[] {
  return OUTFITS.filter(
    (outfit) => !isOutfitUnlocked(outfit, previousXp) && isOutfitUnlocked(outfit, currentXp),
  );
}
