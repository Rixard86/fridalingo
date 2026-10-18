import { isLessonKind } from "./lessons";
import { LEVELS_PER_WORLD } from "./levels";
import type { Progress } from "./types";

const WEEK_LEVEL = /^(\d+)\/([a-z-]+)$/;
const MIX_LEVEL = /^mix-\d+\/(\d+)$/;
const TEST_KIND = "prov";

export type Board = "xp" | "map" | "endless";
export const BOARDS: Board[] = ["xp", "map", "endless"];

function isWeekLevel(key: string): boolean {
  const match = WEEK_LEVEL.exec(key);
  return match !== null && isLessonKind(match[2]);
}

function isMixLevel(key: string): boolean {
  return MIX_LEVEL.test(key);
}

function isWorldFinale(key: string): boolean {
  const mix = MIX_LEVEL.exec(key);
  if (mix) return Number(mix[1]) % LEVELS_PER_WORLD === 0;
  return isWeekLevel(key) && key.endsWith(`/${TEST_KIND}`);
}

function doneKeys(progress: Progress): string[] {
  return Object.keys(progress.completed).filter((key) => (progress.completed[key] ?? 0) > 0);
}

export function mapLevelsDone(progress: Progress): number {
  return doneKeys(progress).filter((key) => isWeekLevel(key) || isMixLevel(key)).length;
}

export function mixLevelsDone(progress: Progress): number {
  return doneKeys(progress).filter(isMixLevel).length;
}

export function worldsDone(progress: Progress): number {
  return doneKeys(progress).filter(isWorldFinale).length;
}

export function totalStars(progress: Progress): number {
  return Object.entries(progress.stars)
    .filter(([key]) => isWeekLevel(key) || isMixLevel(key))
    .reduce((sum, [, stars]) => sum + stars, 0);
}

export function scoresFor(progress: Progress): Record<Board, number> {
  return { xp: progress.xp, map: mapLevelsDone(progress), endless: progress.endlessRecord };
}
