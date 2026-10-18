import { isOutcomeCorrect } from "./lessonState";
import { choiceExercise, type LessonContext } from "./lessons";
import { applyLessonResult, type CompletionReport } from "./progress";
import type { AnswerEvent, Exercise, ExerciseOutcome, LessonResult, Progress, Word } from "./types";

export const ENDLESS_KEY = "endless";
export const START_LIVES = 3;
const START_SECONDS = 20;
const MIN_SECONDS = 6;
const SECONDS_DROP_PER_POINT = 0.5;
const WEAK_WORD_CHANCE = 0.4;
const XP_PER_POINT = 1;

export interface EndlessPick {
  pendingReviews: Record<string, number>;
  previousWordId: string | null;
}

export interface EndlessState {
  exercise: Exercise;
  round: number;
  lives: number;
  score: number;
  combo: number;
  bestCombo: number;
  events: AnswerEvent[];
  lastOutcome: ExerciseOutcome | null;
}

const ENDLESS_FACTORIES: ((word: Word, context: LessonContext) => Exercise)[] = [
  (word, context) => choiceExercise(word, { direction: "en-sv", context }),
  (word, context) => choiceExercise(word, { direction: "sv-en", context }),
  (word) => ({ kind: "write", word, direction: "sv-en" }),
  (word) => ({ kind: "listen", word }),
  (word) => ({ kind: "write", word, direction: "en-sv" }),
];

export function secondsFor(score: number): number {
  return Math.max(MIN_SECONDS, START_SECONDS - score * SECONDS_DROP_PER_POINT);
}

export function exerciseWordId(exercise: Exercise): string | null {
  return exercise.kind === "match" ? null : exercise.word.id;
}

function pickWord(pick: EndlessPick, context: LessonContext): Word {
  const candidates = context.pool.filter((word) => word.id !== pick.previousWordId);
  const weak = candidates.filter((word) => (pick.pendingReviews[word.id] ?? 0) > 0);
  const source = weak.length > 0 && context.random() < WEAK_WORD_CHANCE ? weak : candidates;
  return source[Math.floor(context.random() * source.length)];
}

export function nextEndlessExercise(pick: EndlessPick, context: LessonContext): Exercise {
  const word = pickWord(pick, context);
  const factory = ENDLESS_FACTORIES[Math.floor(context.random() * ENDLESS_FACTORIES.length)];
  return factory(word, context);
}

export function startEndless(exercise: Exercise): EndlessState {
  return { exercise, round: 0, lives: START_LIVES, score: 0, combo: 0, bestCombo: 0, events: [], lastOutcome: null };
}

export function answerEndless(state: EndlessState, outcome: ExerciseOutcome): EndlessState {
  const correct = isOutcomeCorrect(outcome);
  const combo = correct ? state.combo + 1 : 0;
  return {
    ...state,
    lives: correct ? state.lives : state.lives - 1,
    score: correct ? state.score + 1 : state.score,
    combo,
    bestCombo: Math.max(state.bestCombo, combo),
    events: [...state.events, ...outcome.events],
    lastOutcome: outcome,
  };
}

export function nextEndlessRound(state: EndlessState, exercise: Exercise): EndlessState {
  return { ...state, exercise, round: state.round + 1, lastOutcome: null };
}

export function isEndlessOver(state: EndlessState): boolean {
  return state.lives <= 0;
}

export function endlessResult(state: EndlessState): LessonResult {
  return {
    lessonKey: ENDLESS_KEY,
    events: state.events,
    mistakes: START_LIVES - state.lives,
    bestCombo: state.bestCombo,
    xp: state.score * XP_PER_POINT,
  };
}

export function applyEndlessResult(progress: Progress, finish: { state: EndlessState; today: string }): CompletionReport {
  const withRecord = { ...progress, endlessRecord: Math.max(progress.endlessRecord, finish.state.score) };
  return applyLessonResult(withRecord, { result: endlessResult(finish.state), today: finish.today });
}
