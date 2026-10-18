import { describe, expect, it } from "vitest";
import { ALL_WORDS, findWeek } from "@/data/weeks";
import { buildLesson, buildReviewLesson, pickReviewWords, REVIEW_SIZE, type LessonContext } from "./lessons";
import type { Exercise } from "./types";

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
}

function contextFor(weekNumber: number): LessonContext {
  const words = findWeek(weekNumber)?.words ?? [];
  return { words, pool: words, random: seededRandom(42) };
}

function wordIdsOf(exercises: Exercise[]): string[] {
  return exercises.flatMap((exercise) => (exercise.kind === "match" ? exercise.words : [exercise.word])).map((word) => word.id);
}

describe("learn lesson", () => {
  const exercises = buildLesson("lar-dig", contextFor(37));

  it("starts and ends with matching rounds", () => {
    expect(exercises[0].kind).toBe("match");
    expect(exercises[exercises.length - 1].kind).toBe("match");
  });

  it("has one choice exercise per word with four unique options including the answer", () => {
    const choices = exercises.filter((exercise) => exercise.kind === "choice");
    expect(choices).toHaveLength(12);
    for (const choice of choices) {
      expect(new Set(choice.options).size).toBe(4);
      const answers = choice.direction === "en-sv" ? choice.word.sv : choice.word.en;
      expect(choice.options).toContain(answers[0]);
    }
  });

  it("covers every word in the week", () => {
    const ids = new Set(wordIdsOf(exercises));
    expect(ids.size).toBe(12);
  });
});

describe("spell lesson", () => {
  it("alternates writing and listening for every word", () => {
    const exercises = buildLesson("stava", contextFor(38));
    expect(exercises).toHaveLength(12);
    expect(exercises.filter((exercise) => exercise.kind === "listen")).toHaveLength(6);
    expect(exercises.filter((exercise) => exercise.kind === "write")).toHaveLength(6);
  });
});

describe("sentence lesson", () => {
  it("includes a sentence exercise for every underlined word", () => {
    const exercises = buildLesson("meningar", contextFor(41));
    const sentences = exercises.filter((exercise) => exercise.kind === "sentence");
    expect(sentences.map((exercise) => wordIdsOf([exercise])[0]).sort()).toEqual(
      ["41-dinner", "41-do-the-dishes", "41-slippers"],
    );
  });
});

describe("weekly test", () => {
  it("asks for every word in English, like the real test", () => {
    const exercises = buildLesson("prov", contextFor(43));
    expect(exercises).toHaveLength(12);
    for (const exercise of exercises) {
      expect(exercise).toMatchObject({ kind: "write", direction: "sv-en" });
    }
  });
});

describe("review", () => {
  const context: LessonContext = { words: [], pool: ALL_WORDS, random: seededRandom(7) };

  it("puts words with pending reviews first", () => {
    const words = pickReviewWords({ "40-nervous": 4, "39-beard": 2 }, context);
    expect(words).toHaveLength(REVIEW_SIZE);
    expect(words.map((word) => word.id)).toEqual(expect.arrayContaining(["40-nervous", "39-beard"]));
  });

  it("fills up with other words when few are weak", () => {
    const words = pickReviewWords({}, context);
    expect(new Set(words.map((word) => word.id)).size).toBe(REVIEW_SIZE);
  });

  it("builds one exercise per review word", () => {
    const words = pickReviewWords({}, context);
    expect(buildReviewLesson({ ...context, words })).toHaveLength(REVIEW_SIZE);
  });
});
