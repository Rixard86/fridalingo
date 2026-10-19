import { answersFor, normalizeAnswer } from "./answers";
import { chunk, shuffle, type RandomSource } from "./random";
import type { Direction, Exercise, Word } from "./types";

export const LESSON_KINDS = ["lar-dig", "stava", "meningar", "prov"] as const;
export type LessonKind = (typeof LESSON_KINDS)[number];

export const LESSON_TITLES: Record<LessonKind, string> = {
  "lar-dig": "Lär dig",
  stava: "Stava",
  meningar: "Meningar",
  prov: "Veckoprov",
};

export const REVIEW_KEY = "repetera";
export const PRACTICE_HREF = "/ova";
const PRACTICE_PREFIX = "ova";
export const REVIEW_SIZE = 10;

const MATCH_GROUP_SIZE = 6;
const DISTRACTOR_COUNT = 3;
const MIX_WRITE_COUNT = 8;
const EVERY_OTHER = 2;

export interface LessonContext {
  words: Word[];
  pool: Word[];
  random: RandomSource;
  count?: number;
}

interface ChoiceSetup {
  direction: Direction;
  context: LessonContext;
}

export function lessonKey(week: number, kind: LessonKind): string {
  return `${week}/${kind}`;
}

export function practiceKey(week: number, kind: LessonKind): string {
  return `${PRACTICE_PREFIX}/${lessonKey(week, kind)}`;
}

export function isLessonKind(value: string): value is LessonKind {
  return (LESSON_KINDS as readonly string[]).includes(value);
}

function directionAt(index: number): Direction {
  return index % EVERY_OTHER === 0 ? "sv-en" : "en-sv";
}

function distractorsFor(word: Word, setup: ChoiceSetup): string[] {
  const correct = normalizeAnswer(answersFor(word, setup.direction)[0]);
  const candidates = setup.context.pool
    .filter((other) => other.id !== word.id)
    .map((other) => answersFor(other, setup.direction)[0])
    .filter((text) => normalizeAnswer(text) !== correct);
  return shuffle([...new Set(candidates)], setup.context.random).slice(0, DISTRACTOR_COUNT);
}

export function choiceExercise(word: Word, setup: ChoiceSetup): Exercise {
  const correct = answersFor(word, setup.direction)[0];
  const options = shuffle([correct, ...distractorsFor(word, setup)], setup.context.random);
  return { kind: "choice", word, direction: setup.direction, options };
}

function buildLearnLesson(context: LessonContext): Exercise[] {
  const words = shuffle(context.words, context.random);
  const [firstGroup, ...otherGroups] = chunk(words, MATCH_GROUP_SIZE);
  const choices = words.map((word, index) =>
    choiceExercise(word, { direction: directionAt(index), context }),
  );
  const matches = otherGroups.map((group): Exercise => ({ kind: "match", words: group }));
  return [{ kind: "match", words: firstGroup }, ...choices, ...matches];
}

function buildSpellLesson(context: LessonContext): Exercise[] {
  return shuffle(context.words, context.random).map(
    (word, index): Exercise =>
      index % EVERY_OTHER === 0 ? { kind: "write", word, direction: "sv-en" } : { kind: "listen", word },
  );
}

function buildSentenceLesson(context: LessonContext): Exercise[] {
  const sentences = context.words
    .filter((word) => word.sentence)
    .map((word): Exercise => ({ kind: "sentence", word }));
  const writes = shuffle(context.words, context.random)
    .slice(0, MIX_WRITE_COUNT)
    .map((word): Exercise => ({ kind: "write", word, direction: "en-sv" }));
  return shuffle([...sentences, ...writes], context.random);
}

function buildTestLesson(context: LessonContext): Exercise[] {
  return shuffle(context.words, context.random).map(
    (word): Exercise => ({ kind: "write", word, direction: "sv-en" }),
  );
}

const REVIEW_FACTORIES: ((word: Word, context: LessonContext) => Exercise)[] = [
  (word) => ({ kind: "write", word, direction: "sv-en" }),
  (word) => ({ kind: "listen", word }),
  (word, context) => choiceExercise(word, { direction: "en-sv", context }),
  (word) => (word.sentence ? { kind: "sentence", word } : { kind: "write", word, direction: "en-sv" }),
];

export function buildReviewLesson(context: LessonContext): Exercise[] {
  return context.words.map((word, index) =>
    REVIEW_FACTORIES[index % REVIEW_FACTORIES.length](word, context),
  );
}

const LESSON_BUILDERS: Record<LessonKind, (context: LessonContext) => Exercise[]> = {
  "lar-dig": buildLearnLesson,
  stava: buildSpellLesson,
  meningar: buildSentenceLesson,
  prov: buildTestLesson,
};

export function buildLesson(kind: LessonKind, context: LessonContext): Exercise[] {
  return LESSON_BUILDERS[kind](context);
}

export function pickReviewWords(pendingReviews: Record<string, number>, context: LessonContext): Word[] {
  const weak = context.pool
    .filter((word) => (pendingReviews[word.id] ?? 0) > 0)
    .sort((a, b) => pendingReviews[b.id] - pendingReviews[a.id]);
  const others = shuffle(
    context.pool.filter((word) => !weak.includes(word)),
    context.random,
  );
  return shuffle([...weak, ...others].slice(0, context.count ?? REVIEW_SIZE), context.random);
}
