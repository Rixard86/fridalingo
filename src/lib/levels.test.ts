import { describe, expect, it } from "vitest";
import { WEEKS } from "@/data/weeks";
import { buildLevels, currentLevelIndex, isLevelUnlocked } from "./levels";
import { BANNER_HEIGHT, LEVEL_SPACING, layoutMap } from "./mapLayout";
import { emptyProgress } from "./progress";

const levels = buildLevels(WEEKS);

function progressWith(keys: string[]) {
  return { ...emptyProgress(), completed: Object.fromEntries(keys.map((key) => [key, 1])) };
}

describe("levels", () => {
  it("starts with the oldest week and ends each week with the test", () => {
    expect(levels[0]).toMatchObject({ number: 1, week: 37, kind: "lar-dig" });
    expect(levels[3]).toMatchObject({ number: 4, week: 37, kind: "prov" });
    expect(levels[4]).toMatchObject({ number: 5, week: 38, kind: "lar-dig" });
    expect(levels).toHaveLength(WEEKS.length * 4);
  });

  it("unlocks strictly in order", () => {
    const progress = progressWith(["37/lar-dig"]);
    expect(isLevelUnlocked(progress, { levels, index: 0 })).toBe(true);
    expect(isLevelUnlocked(progress, { levels, index: 1 })).toBe(true);
    expect(isLevelUnlocked(progress, { levels, index: 2 })).toBe(false);
    expect(isLevelUnlocked(progress, { levels, index: 4 })).toBe(false);
  });

  it("needs the weekly test before the next world opens", () => {
    const progress = progressWith(["37/lar-dig", "37/stava", "37/meningar"]);
    expect(isLevelUnlocked(progress, { levels, index: 4 })).toBe(false);
    expect(isLevelUnlocked(progressWith(["37/prov"]), { levels, index: 4 })).toBe(true);
  });

  it("puts the player on the first unfinished level", () => {
    expect(currentLevelIndex(emptyProgress(), levels)).toBe(0);
    expect(currentLevelIndex(progressWith(["37/lar-dig", "37/stava"]), levels)).toBe(2);
  });

  it("stays on the last level when everything is done", () => {
    expect(currentLevelIndex(progressWith(levels.map((level) => level.key)), levels)).toBe(levels.length - 1);
  });
});

describe("map layout", () => {
  const layout = layoutMap(levels);

  it("places the first level at the bottom and later levels higher up", () => {
    for (let index = 1; index < layout.nodes.length; index++) {
      expect(layout.nodes[index].y).toBeLessThan(layout.nodes[index - 1].y);
    }
  });

  it("gives each world room for a banner and its levels", () => {
    expect(layout.worlds).toHaveLength(WEEKS.length);
    for (const world of layout.worlds) {
      expect(world.height).toBeGreaterThanOrEqual(BANNER_HEIGHT + 4 * LEVEL_SPACING);
    }
  });

  it("covers the whole map with worlds without gaps", () => {
    const sorted = [...layout.worlds].sort((a, b) => a.top - b.top);
    expect(sorted[0].top).toBe(0);
    for (let index = 1; index < sorted.length; index++) {
      expect(sorted[index].top).toBe(sorted[index - 1].top + sorted[index - 1].height);
    }
    const last = sorted[sorted.length - 1];
    expect(last.top + last.height).toBe(layout.height);
  });

  it("keeps every node inside its world", () => {
    levels.forEach((level, index) => {
      const world = layout.worlds.find((area) => area.week === level.week)!;
      expect(layout.nodes[index].y).toBeGreaterThan(world.top);
      expect(layout.nodes[index].y).toBeLessThan(world.top + world.height - BANNER_HEIGHT);
    });
  });
});
