import { describe, expect, it } from "vitest";
import { previousDayKey } from "./days";
import {
  applyLessonResult,
  currentStreak,
  emptyProgress,
  isLessonUnlocked,
  lessonXp,
  todaysXp,
  updatePendingReviews,
} from "./progress";
import { levelFor, newlyUnlockedOutfits } from "./rewards";
import type { LessonResult } from "./types";

const TODAY = "2026-10-18";
const YESTERDAY = "2026-10-17";
const LONG_AGO = "2026-10-10";

const perfectResult: LessonResult = { lessonKey: "37/lar-dig", events: [], mistakes: 0, bestCombo: 6 };
const sloppyResult: LessonResult = { lessonKey: "37/lar-dig", events: [], mistakes: 2, bestCombo: 1 };

describe("days", () => {
  it("finds the previous day across months", () => {
    expect(previousDayKey("2026-11-01")).toBe("2026-10-31");
  });
});

describe("xp", () => {
  it("gives perfect and combo bonuses", () => {
    expect(lessonXp(perfectResult)).toBe(17);
    expect(lessonXp(sloppyResult)).toBe(10);
  });

  it("caps the combo bonus", () => {
    expect(lessonXp({ ...sloppyResult, bestCombo: 100 })).toBe(15);
  });
});

describe("streak", () => {
  it("starts at one on the first lesson", () => {
    const { progress } = applyLessonResult(emptyProgress(), { result: sloppyResult, today: TODAY });
    expect(progress.streak).toBe(1);
  });

  it("grows when practising the day after", () => {
    const start = { ...emptyProgress(), streak: 4, lastPracticeDay: YESTERDAY };
    expect(applyLessonResult(start, { result: sloppyResult, today: TODAY }).progress.streak).toBe(5);
  });

  it("stays the same for a second lesson the same day", () => {
    const start = { ...emptyProgress(), streak: 4, lastPracticeDay: TODAY };
    expect(applyLessonResult(start, { result: sloppyResult, today: TODAY }).progress.streak).toBe(4);
  });

  it("restarts after a missed day", () => {
    const start = { ...emptyProgress(), streak: 4, lastPracticeDay: LONG_AGO };
    expect(currentStreak(start, TODAY)).toBe(0);
    expect(applyLessonResult(start, { result: sloppyResult, today: TODAY }).progress.streak).toBe(1);
  });
});

describe("daily xp", () => {
  it("resets on a new day", () => {
    const start = { ...emptyProgress(), dailyXp: 25, lastPracticeDay: YESTERDAY };
    expect(todaysXp(start, TODAY)).toBe(0);
    expect(applyLessonResult(start, { result: sloppyResult, today: TODAY }).progress.dailyXp).toBe(10);
  });
});

describe("pending reviews", () => {
  it("adds reviews for misses and removes them after correct answers", () => {
    const afterMiss = updatePendingReviews({}, [{ wordId: "a", correct: false }]);
    expect(afterMiss).toEqual({ a: 2 });
    const afterHits = updatePendingReviews(afterMiss, [
      { wordId: "a", correct: true },
      { wordId: "a", correct: true },
    ]);
    expect(afterHits).toEqual({});
  });
});

describe("badges and unlocks", () => {
  it("awards the first badges once", () => {
    const first = applyLessonResult(emptyProgress(), { result: perfectResult, today: TODAY });
    expect(first.newBadges.map((badge) => badge.id)).toEqual(["forsta-steget", "felfri"]);
    const second = applyLessonResult(first.progress, { result: perfectResult, today: TODAY });
    expect(second.newBadges).toEqual([]);
  });

  it("unlocks lessons in order", () => {
    const start = emptyProgress();
    expect(isLessonUnlocked(start, { week: 37, kind: "lar-dig" })).toBe(true);
    expect(isLessonUnlocked(start, { week: 37, kind: "stava" })).toBe(false);
    const { progress } = applyLessonResult(start, { result: perfectResult, today: TODAY });
    expect(isLessonUnlocked(progress, { week: 37, kind: "stava" })).toBe(true);
  });

  it("unlocks the cap at level two", () => {
    expect(levelFor(49)).toBe(1);
    expect(levelFor(50)).toBe(2);
    expect(newlyUnlockedOutfits(45, 55).map((outfit) => outfit.id)).toEqual(["keps"]);
  });
});
