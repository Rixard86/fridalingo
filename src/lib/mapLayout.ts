import type { Level } from "./levels";

export const LEVEL_SPACING = 130;
export const BANNER_HEIGHT = 120;
const NODE_CENTER_OFFSET = 65;
const TOP_PADDING = 80;
const BOTTOM_PADDING = 130;
const CENTER = 50;
const RIGHT = 74;
const LEFT = 26;
const X_PATTERN = [CENTER, RIGHT, CENTER, LEFT];

export interface NodePosition {
  x: number;
  y: number;
}

export interface WorldArea {
  week: number;
  index: number;
  top: number;
  height: number;
}

export interface MapLayout {
  height: number;
  nodes: NodePosition[];
  worlds: WorldArea[];
}

interface WorldSpan {
  week: number;
  index: number;
  start: number;
  end: number;
}

export function layoutMap(levels: Level[]): MapLayout {
  const weeks = [...new Set(levels.map((level) => level.week))];
  const fromBottom: number[] = [];
  let cursor = BOTTOM_PADDING;
  const spans: WorldSpan[] = weeks.map((week, index) => {
    const start = cursor;
    cursor += BANNER_HEIGHT;
    levels.forEach((level, levelIndex) => {
      if (level.week !== week) return;
      fromBottom[levelIndex] = cursor + NODE_CENTER_OFFSET;
      cursor += LEVEL_SPACING;
    });
    return { week, index, start, end: cursor };
  });
  const height = cursor + TOP_PADDING;
  const lastIndex = spans.length - 1;
  return {
    height,
    nodes: levels.map((_, index) => ({ x: X_PATTERN[index % X_PATTERN.length], y: height - fromBottom[index] })),
    worlds: spans.map((span) => {
      const bottom = span.index === 0 ? 0 : span.start;
      const top = span.index === lastIndex ? height : span.end;
      return { week: span.week, index: span.index, top: height - top, height: top - bottom };
    }),
  };
}
