import { describe, expect, it } from "vitest";
import { ALL_WORDS, WEEKS } from "@/data/weeks";
import {
  answerEndless,
  applyEndlessResult,
  exerciseWordId,
  isEndlessOver,
  nextEndlessExercise,
  secondsFor,
  startEndless,
  START_LIVES,
} from "./endless";
import { buildMixLesson, mixPool } from "./mix";
import { emptyProgress } from "./progress";
import { seededRandom } from "./random";
import { newlyEarnedBadges } from "./rewards";

const context = { words: [], pool: ALL_WORDS, random: seededRandom(3) };
const first = nextEndlessExercise({ pendingReviews: {}, previousWordId: null }, context);
const wordId = exerciseWordId(first) ?? "";
const right = { events: [{ wordId, correct: true }], solution: "" };
const wrong = { events: [{ wordId, correct: false }], solution: "" };

describe("endless mode", () => {
  it("gets faster with a higher score but never too fast", () => {
    expect(secondsFor(10)).toBeLessThan(secondsFor(0));
    expect(secondsFor(1000)).toBeGreaterThan(0);
    expect(secondsFor(1000)).toBe(secondsFor(2000));
  });

  it("never asks the same word twice in a row", () => {
    for (let round = 0; round < 50; round++) {
      const next = nextEndlessExercise({ pendingReviews: {}, previousWordId: wordId }, context);
      expect(exerciseWordId(next)).not.toBe(wordId);
    }
  });

  it("scores right answers and costs a life for wrong ones", () => {
    const state = answerEndless(answerEndless(startEndless(first), right), wrong);
    expect(state.score).toBe(1);
    expect(state.lives).toBe(START_LIVES - 1);
  });

  it("ends after three mistakes", () => {
    let state = startEndless(first);
    for (let mistake = 0; mistake < START_LIVES; mistake++) state = answerEndless(state, wrong);
    expect(isEndlessOver(state)).toBe(true);
  });

  it("saves a new record and gives xp for the score", () => {
    let state = startEndless(first);
    for (let point = 0; point < 30; point++) state = answerEndless(state, right);
    const report = applyEndlessResult(emptyProgress(), { state, today: "2026-10-18" });
    expect(report.progress.endlessRecord).toBe(30);
    expect(report.earnedXp).toBe(30);
    expect(report.newBadges.map((badge) => badge.id)).toContain("endless-25");
  });
});

describe("mix levels", () => {
  it("only uses words from weeks up to the anchor week", () => {
    const pool = mixPool(WEEKS, 39);
    expect(pool.every((word) => word.week <= 39)).toBe(true);
    const exercises = buildMixLesson({ anchorWeek: 39, number: 2, pendingReviews: {}, random: seededRandom(5) }, WEEKS);
    expect(exercises.length).toBeGreaterThan(0);
    for (const exercise of exercises) {
      expect(Number(exerciseWordId(exercise)?.split("-")[0])).toBeLessThanOrEqual(39);
    }
  });

  it("includes sentences in the sentence mix", () => {
    const exercises = buildMixLesson({ anchorWeek: 43, number: 3, pendingReviews: {}, random: seededRandom(5) }, WEEKS);
    expect(exercises.some((exercise) => exercise.kind === "sentence")).toBe(true);
  });

  it("ends every mix world with a test of written answers", () => {
    const exercises = buildMixLesson({ anchorWeek: 43, number: 4, pendingReviews: {}, random: seededRandom(5) }, WEEKS);
    expect(exercises.every((exercise) => exercise.kind === "write")).toBe(true);
  });

  it("does not count mix levels towards the week master badge", () => {
    const completed = Object.fromEntries([1, 2, 3, 4].map((number) => [`mix-43/${number}`, 1]));
    const badges = newlyEarnedBadges({ ...emptyProgress(), completed });
    expect(badges.map((badge) => badge.id)).not.toContain("veckomastare");
  });
});
