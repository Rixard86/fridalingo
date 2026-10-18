import type { AnswerEvent, Exercise, ExerciseOutcome } from "./types";

export interface LessonState {
  queue: Exercise[];
  position: number;
  mistakes: number;
  combo: number;
  bestCombo: number;
  events: AnswerEvent[];
  lastOutcome: ExerciseOutcome | null;
}

export function startLesson(exercises: Exercise[]): LessonState {
  return { queue: exercises, position: 0, mistakes: 0, combo: 0, bestCombo: 0, events: [], lastOutcome: null };
}

export function isOutcomeCorrect(outcome: ExerciseOutcome): boolean {
  return outcome.events.every((event) => event.correct);
}

export function currentExercise(state: LessonState): Exercise | undefined {
  return state.queue[state.position];
}

export function submitOutcome(state: LessonState, outcome: ExerciseOutcome): LessonState {
  const exercise = state.queue[state.position];
  const correct = isOutcomeCorrect(outcome);
  const retry = !correct && exercise.kind !== "match";
  const combo = correct ? state.combo + 1 : 0;
  return {
    ...state,
    queue: retry ? [...state.queue, exercise] : state.queue,
    mistakes: correct ? state.mistakes : state.mistakes + 1,
    combo,
    bestCombo: Math.max(state.bestCombo, combo),
    events: [...state.events, ...outcome.events],
    lastOutcome: outcome,
  };
}

export function nextExercise(state: LessonState): LessonState {
  return { ...state, position: state.position + 1, lastOutcome: null };
}

export function isLessonFinished(state: LessonState): boolean {
  return state.position >= state.queue.length;
}

export function completionRatio(state: LessonState): number {
  const answered = state.position + (state.lastOutcome ? 1 : 0);
  return state.queue.length === 0 ? 1 : answered / state.queue.length;
}
