import { previousDayKey } from "./days";
import { newlyEarnedBadges, type Badge } from "./badges";
import type { AnswerEvent, LessonResult, Progress } from "./types";

export const LESSON_XP = 10;
export const PERFECT_BONUS_XP = 5;
export const COMBO_STEP = 3;
export const MAX_COMBO_BONUS_XP = 5;
export const REVIEWS_PER_MISS = 2;
export const MAX_STARS = 3;
const TWO_STARS = 2;
const ONE_STAR = 1;
const TWO_STAR_MAX_MISTAKES = 2;

export interface Completion {
  result: LessonResult;
  today: string;
}

export interface CompletionReport {
  progress: Progress;
  earnedXp: number;
  newBadges: Badge[];
  stars: number;
}

export function emptyProgress(): Progress {
  return {
    xp: 0,
    streak: 0,
    lastPracticeDay: null,
    dailyXp: 0,
    completed: {},
    pendingReviews: {},
    perfectLessons: 0,
    bestCombo: 0,
    badges: [],
    outfits: [],
    stars: {},
    endlessRecord: 0,
  };
}

export function lessonXp(result: LessonResult): number {
  if (result.xp !== undefined) return result.xp;
  const perfectBonus = result.mistakes === 0 ? PERFECT_BONUS_XP : 0;
  const comboBonus = Math.min(MAX_COMBO_BONUS_XP, Math.floor(result.bestCombo / COMBO_STEP));
  return LESSON_XP + perfectBonus + comboBonus;
}

export function starsFor(mistakes: number): number {
  if (mistakes === 0) return MAX_STARS;
  return mistakes <= TWO_STAR_MAX_MISTAKES ? TWO_STARS : ONE_STAR;
}

export function currentStreak(progress: Progress, today: string): number {
  const last = progress.lastPracticeDay;
  return last === today || last === previousDayKey(today) ? progress.streak : 0;
}

export function todaysXp(progress: Progress, today: string): number {
  return progress.lastPracticeDay === today ? progress.dailyXp : 0;
}

function nextStreak(progress: Progress, today: string): number {
  if (progress.lastPracticeDay === today) return progress.streak;
  return currentStreak(progress, today) + 1;
}

export function updatePendingReviews(
  pending: Record<string, number>,
  events: AnswerEvent[],
): Record<string, number> {
  const updated = { ...pending };
  for (const event of events) {
    const current = updated[event.wordId] ?? 0;
    const next = event.correct ? current - 1 : current + REVIEWS_PER_MISS;
    if (next > 0) updated[event.wordId] = next;
    else delete updated[event.wordId];
  }
  return updated;
}

function withLessonResult(progress: Progress, completion: Completion): Progress {
  const { result, today } = completion;
  const earnedXp = lessonXp(result);
  return {
    ...progress,
    xp: progress.xp + earnedXp,
    streak: nextStreak(progress, today),
    lastPracticeDay: today,
    dailyXp: todaysXp(progress, today) + earnedXp,
    completed: { ...progress.completed, [result.lessonKey]: (progress.completed[result.lessonKey] ?? 0) + 1 },
    pendingReviews: updatePendingReviews(progress.pendingReviews, result.events),
    perfectLessons: progress.perfectLessons + (result.mistakes === 0 ? 1 : 0),
    bestCombo: Math.max(progress.bestCombo, result.bestCombo),
    stars: { ...progress.stars, [result.lessonKey]: Math.max(progress.stars[result.lessonKey] ?? 0, starsFor(result.mistakes)) },
  };
}

export function applyLessonResult(progress: Progress, completion: Completion): CompletionReport {
  const updated = withLessonResult(progress, completion);
  const newBadges = newlyEarnedBadges(updated);
  return {
    progress: { ...updated, badges: [...updated.badges, ...newBadges.map((badge) => badge.id)] },
    earnedXp: updated.xp - progress.xp,
    newBadges,
    stars: starsFor(completion.result.mistakes),
  };
}
