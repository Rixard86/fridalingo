import { LESSON_KINDS, LESSON_TITLES, lessonKey, type LessonKind } from "./lessons";
import { chunk } from "./random";
import type { Progress, Week } from "./types";

export const LEVELS_PER_WORLD = LESSON_KINDS.length;
const MIN_MIX_LOOKAHEAD = 5;

export const MIX_TITLES: Record<LessonKind, string> = {
  "lar-dig": "Blandat",
  stava: "Stavmix",
  meningar: "Meningsmix",
  prov: "Mixprov",
};

export type WorldKind = "week" | "mix";

export interface World {
  id: string;
  index: number;
  kind: WorldKind;
  week: number;
  firstWeek: number;
}

export interface Level {
  number: number;
  key: string;
  worldId: string;
  kind: LessonKind;
  title: string;
  href: string;
}

export interface GameMap {
  worlds: World[];
  levels: Level[];
}

export interface LevelPosition {
  levels: Level[];
  index: number;
}

type LevelDraft = Omit<Level, "number">;

interface Section {
  world: Omit<World, "index">;
  levels: LevelDraft[];
}

export function mixKey(anchorWeek: number, number: number): string {
  return `mix-${anchorWeek}/${number}`;
}

export function mixKind(number: number): LessonKind {
  return LESSON_KINDS[(number - 1) % LEVELS_PER_WORLD];
}

function completedMixCount(progress: Progress, anchorWeek: number): number {
  let count = 0;
  while ((progress.completed[mixKey(anchorWeek, count + 1)] ?? 0) > 0) count++;
  return count;
}

function withLookahead(done: number): number {
  return Math.ceil((done + MIN_MIX_LOOKAHEAD) / LEVELS_PER_WORLD) * LEVELS_PER_WORLD;
}

function weekSection(week: number, firstWeek: number): Section {
  const worldId = `v${week}`;
  return {
    world: { id: worldId, kind: "week", week, firstWeek },
    levels: LESSON_KINDS.map((kind) => ({
      key: lessonKey(week, kind),
      worldId,
      kind,
      title: LESSON_TITLES[kind],
      href: `/lektion/${week}/${kind}`,
    })),
  };
}

function mixDraft(anchorWeek: number, number: number): LevelDraft {
  const kind = mixKind(number);
  return {
    key: mixKey(anchorWeek, number),
    worldId: `mix-${anchorWeek}-${Math.ceil(number / LEVELS_PER_WORLD)}`,
    kind,
    title: MIX_TITLES[kind],
    href: `/mix/${anchorWeek}/${number}`,
  };
}

function mixSections(anchorWeek: number, stream: { count: number; firstWeek: number }): Section[] {
  const drafts = Array.from({ length: stream.count }, (_, index) => mixDraft(anchorWeek, index + 1));
  return chunk(drafts, LEVELS_PER_WORLD).map((levels) => ({
    world: { id: levels[0].worldId, kind: "mix", week: anchorWeek, firstWeek: stream.firstWeek },
    levels,
  }));
}

export function buildMap(weeks: Week[], progress: Progress): GameMap {
  const numbers = weeks.map((week) => week.week).sort((a, b) => a - b);
  const firstWeek = numbers[0];
  const newest = numbers[numbers.length - 1];
  const sections = numbers.flatMap((week) => {
    const done = completedMixCount(progress, week);
    const count = week === newest ? withLookahead(done) : done;
    return [weekSection(week, firstWeek), ...mixSections(week, { count, firstWeek })];
  });
  return {
    worlds: sections.map((section, index) => ({ ...section.world, index })),
    levels: sections.flatMap((section) => section.levels).map((level, index) => ({ ...level, number: index + 1 })),
  };
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
