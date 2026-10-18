export interface Sentence {
  en: string;
  sv: string;
}

export interface Word {
  id: string;
  week: number;
  en: string[];
  sv: string[];
  sentence?: Sentence;
}

export interface Week {
  week: number;
  words: Word[];
}

export type Direction = "en-sv" | "sv-en";

export type Exercise =
  | { kind: "choice"; word: Word; direction: Direction; options: string[] }
  | { kind: "match"; words: Word[] }
  | { kind: "write"; word: Word; direction: Direction }
  | { kind: "listen"; word: Word }
  | { kind: "sentence"; word: Word };

export interface AnswerEvent {
  wordId: string;
  correct: boolean;
}

export interface ExerciseOutcome {
  events: AnswerEvent[];
  solution: string;
  timedOut?: boolean;
}

export interface Progress {
  xp: number;
  streak: number;
  lastPracticeDay: string | null;
  dailyXp: number;
  completed: Record<string, number>;
  pendingReviews: Record<string, number>;
  perfectLessons: number;
  bestCombo: number;
  badges: string[];
  outfits: string[];
  scarfOff: boolean;
  stars: Record<string, number>;
  endlessRecord: number;
}

export interface LessonResult {
  lessonKey: string;
  events: AnswerEvent[];
  mistakes: number;
  bestCombo: number;
  xp?: number;
}
