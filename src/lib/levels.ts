import { LESSON_KINDS, lessonKey, type LessonKind } from "./lessons";
import type { Progress, Week } from "./types";

export interface Level {
  number: number;
  week: number;
  kind: LessonKind;
  key: string;
}

export interface LevelPosition {
  levels: Level[];
  index: number;
}

export function buildLevels(weeks: Week[]): Level[] {
  return [...weeks]
    .sort((a, b) => a.week - b.week)
    .flatMap((week) => LESSON_KINDS.map((kind) => ({ week: week.week, kind, key: lessonKey(week.week, kind) })))
    .map((level, index) => ({ ...level, number: index + 1 }));
}

export function isLevelDone(progress: Progress, level: Level): boolean {
  return (progress.completed[level.key] ?? 0) > 0;
}

export function isLevelUnlocked(progress: Progress, position: LevelPosition): boolean {
  return position.index === 0 || isLevelDone(progress, position.levels[position.index - 1]);
}

export function currentLevelIndex(progress: Progress, levels: Level[]): number {
  const index = levels.findIndex(
    (level, position) => !isLevelDone(progress, level) && isLevelUnlocked(progress, { levels, index: position }),
  );
  return index === -1 ? levels.length - 1 : index;
}
