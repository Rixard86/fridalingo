import { describe, expect, it } from "vitest";
import { completionRatio, isLessonFinished, nextExercise, startLesson, submitOutcome } from "./lessonState";
import type { Exercise, Word } from "./types";

const wall: Word = { id: "37-wall", week: 37, en: ["Wall"], sv: ["Vägg"] };
const garden: Word = { id: "37-garden", week: 37, en: ["Garden"], sv: ["Trädgård"] };
const writeWall: Exercise = { kind: "write", word: wall, direction: "sv-en" };
const matchBoth: Exercise = { kind: "match", words: [wall, garden] };

const right = { events: [{ wordId: wall.id, correct: true }], solution: "Wall" };
const wrong = { events: [{ wordId: wall.id, correct: false }], solution: "Wall" };

describe("lesson state", () => {
  it("re-queues a wrong answer at the end", () => {
    const state = submitOutcome(startLesson([writeWall]), wrong);
    expect(state.queue).toHaveLength(2);
    expect(state.mistakes).toBe(1);
    expect(isLessonFinished(nextExercise(state))).toBe(false);
  });

  it("does not re-queue a matching round", () => {
    const outcome = { events: [{ wordId: wall.id, correct: false }, { wordId: garden.id, correct: true }], solution: "" };
    const state = submitOutcome(startLesson([matchBoth]), outcome);
    expect(state.queue).toHaveLength(1);
    expect(state.mistakes).toBe(1);
  });

  it("tracks combo and best combo", () => {
    let state = startLesson([writeWall, writeWall, writeWall]);
    state = nextExercise(submitOutcome(state, right));
    state = nextExercise(submitOutcome(state, right));
    state = submitOutcome(state, wrong);
    expect(state.combo).toBe(0);
    expect(state.bestCombo).toBe(2);
  });

  it("finishes after the last exercise", () => {
    const state = nextExercise(submitOutcome(startLesson([writeWall]), right));
    expect(isLessonFinished(state)).toBe(true);
    expect(completionRatio(state)).toBe(1);
  });
});
