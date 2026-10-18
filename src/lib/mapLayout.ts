import type { GameMap, World } from "./levels";

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
  world: World;
  top: number;
  height: number;
}

export interface MapLayout {
  height: number;
  nodes: NodePosition[];
  worlds: WorldArea[];
}

interface WorldSpan {
  world: World;
  start: number;
  end: number;
}

export function layoutMap(map: GameMap): MapLayout {
  const fromBottom: number[] = [];
  let cursor = BOTTOM_PADDING;
  const spans: WorldSpan[] = map.worlds.map((world) => {
    const start = cursor;
    cursor += BANNER_HEIGHT;
    map.levels.forEach((level, levelIndex) => {
      if (level.worldId !== world.id) return;
      fromBottom[levelIndex] = cursor + NODE_CENTER_OFFSET;
      cursor += LEVEL_SPACING;
    });
    return { world, start, end: cursor };
  });
  const height = cursor + TOP_PADDING;
  const lastIndex = spans.length - 1;
  return {
    height,
    nodes: map.levels.map((_, index) => ({ x: X_PATTERN[index % X_PATTERN.length], y: height - fromBottom[index] })),
    worlds: spans.map((span, index) => {
      const bottom = index === 0 ? 0 : span.start;
      const top = index === lastIndex ? height : span.end;
      return { world: span.world, top: height - top, height: top - bottom };
    }),
  };
}
