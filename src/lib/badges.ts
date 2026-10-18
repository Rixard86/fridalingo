import { isLessonKind, LESSON_KINDS, REVIEW_KEY } from "./lessons";
import { unlockedOutfitCount } from "./outfits";
import { levelFor } from "./rewards";
import { mixLevelsDone, totalStars, worldsDone } from "./scores";
import type { Progress } from "./types";

const ONE = 1;
const SHORT_STREAK_DAYS = 3;
const LONG_STREAK_DAYS = 7;
const TWO_WEEK_STREAK_DAYS = 14;
const MONTH_STREAK_DAYS = 30;
const FAST_COMBO = 10;
const STORM_COMBO = 20;
const SMALL_XP = 100;
const BIG_XP = 500;
const HUGE_XP = 1000;
const TOP_LEVEL = 10;
const PERFECTIONIST_LESSONS = 10;
const MACHINE_LESSONS = 25;
const ENDLESS_GOOD_SCORE = 25;
const ENDLESS_GREAT_SCORE = 50;
const ENDLESS_GOAT_SCORE = 100;
const FEW_STARS = 30;
const MANY_STARS = 100;
const FEW_WORLDS = 3;
const MANY_WORLDS = 10;
const MIX_LEVELS = 10;
const REVIEWS = 10;
const STYLE_ITEMS = 5;
const WEEK_PATTERN = /^\d+$/;

export interface Badge {
  id: string;
  emoji: string;
  title: string;
  description: string;
  isEarned: (progress: Progress) => boolean;
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

function reviewsDone(progress: Progress): number {
  return progress.completed[REVIEW_KEY] ?? 0;
}

export const BADGES: Badge[] = [
  { id: "forsta-steget", emoji: "🐣", title: "Första steget", description: "Klara din första bana", isEarned: (p) => totalCompleted(p) >= ONE },
  { id: "felfri", emoji: "⭐", title: "Felfri", description: "Klara en bana utan fel", isEarned: (p) => p.perfectLessons >= ONE },
  { id: "svit-3", emoji: "🔥", title: "Het gås", description: "Öva 3 dagar i rad", isEarned: (p) => p.streak >= SHORT_STREAK_DAYS },
  { id: "svit-7", emoji: "🏆", title: "En hel vecka", description: "Öva 7 dagar i rad", isEarned: (p) => p.streak >= LONG_STREAK_DAYS },
  { id: "svit-14", emoji: "☄️", title: "Två veckor", description: "Öva 14 dagar i rad", isEarned: (p) => p.streak >= TWO_WEEK_STREAK_DAYS },
  { id: "svit-30", emoji: "🌋", title: "Oslagbar", description: "Öva 30 dagar i rad", isEarned: (p) => p.streak >= MONTH_STREAK_DAYS },
  { id: "kombo-10", emoji: "⚡", title: "Blixtsnabb", description: "10 rätt i rad", isEarned: (p) => p.bestCombo >= FAST_COMBO },
  { id: "kombo-20", emoji: "🌪️", title: "Virvelvind", description: "20 rätt i rad", isEarned: (p) => p.bestCombo >= STORM_COMBO },
  { id: "xp-100", emoji: "💯", title: "Hundra!", description: "Samla 100 XP", isEarned: (p) => p.xp >= SMALL_XP },
  { id: "xp-500", emoji: "🚀", title: "Raketgås", description: "Samla 500 XP", isEarned: (p) => p.xp >= BIG_XP },
  { id: "xp-1000", emoji: "💎", title: "Tusen!", description: "Samla 1000 XP", isEarned: (p) => p.xp >= HUGE_XP },
  { id: "niva-10", emoji: "🎖️", title: "Veteran", description: "Nå nivå 10", isEarned: (p) => levelFor(p.xp) >= TOP_LEVEL },
  { id: "veckomastare", emoji: "👑", title: "Veckomästare", description: "Klara alla banor i en vecka", isEarned: hasMasteredAWeek },
  { id: "varldar-3", emoji: "🗺️", title: "Upptäckare", description: "Klara 3 världar", isEarned: (p) => worldsDone(p) >= FEW_WORLDS },
  { id: "varldar-10", emoji: "🧭", title: "Världsresenär", description: "Klara 10 världar", isEarned: (p) => worldsDone(p) >= MANY_WORLDS },
  { id: "mix-10", emoji: "🎲", title: "Mixmästare", description: "Klara 10 mixbanor", isEarned: (p) => mixLevelsDone(p) >= MIX_LEVELS },
  { id: "stjarnor-30", emoji: "✨", title: "Stjärnjägare", description: "Samla 30 stjärnor", isEarned: (p) => totalStars(p) >= FEW_STARS },
  { id: "stjarnor-100", emoji: "🌠", title: "Stjärnregn", description: "Samla 100 stjärnor", isEarned: (p) => totalStars(p) >= MANY_STARS },
  { id: "minnesmastare", emoji: "🧠", title: "Minnesmästare", description: "Klara en repetition", isEarned: (p) => reviewsDone(p) >= ONE },
  { id: "repetition-10", emoji: "📚", title: "Pluggis", description: "Klara 10 repetitioner", isEarned: (p) => reviewsDone(p) >= REVIEWS },
  { id: "endless-25", emoji: "🛡️", title: "Överlevare", description: "25 poäng i Endless", isEarned: (p) => p.endlessRecord >= ENDLESS_GOOD_SCORE },
  { id: "endless-50", emoji: "♾️", title: "Oändlig", description: "50 poäng i Endless", isEarned: (p) => p.endlessRecord >= ENDLESS_GREAT_SCORE },
  { id: "endless-100", emoji: "🐐", title: "GOAT", description: "100 poäng i Endless", isEarned: (p) => p.endlessRecord >= ENDLESS_GOAT_SCORE },
  { id: "perfektionist", emoji: "🌟", title: "Perfektionist", description: "10 felfria banor", isEarned: (p) => p.perfectLessons >= PERFECTIONIST_LESSONS },
  { id: "perfekt-25", emoji: "💫", title: "Felfri maskin", description: "25 felfria banor", isEarned: (p) => p.perfectLessons >= MACHINE_LESSONS },
  { id: "stilikon", emoji: "🕶️", title: "Stilikon", description: "Lås upp 5 gåsgrejer", isEarned: (p) => unlockedOutfitCount(p.xp) >= STYLE_ITEMS },
];

export function newlyEarnedBadges(progress: Progress): Badge[] {
  return BADGES.filter((badge) => !progress.badges.includes(badge.id) && badge.isEarned(progress));
}
