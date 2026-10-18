import { describe, expect, it } from "vitest";
import { WEEKS } from "@/data/weeks";
import { buildMap, currentLevelIndex, isLevelUnlocked, mixKey, type Level } from "./levels";
import { BANNER_HEIGHT, LEVEL_SPACING, layoutMap } from "./mapLayout";
import { emptyProgress } from "./progress";
import type { Progress, Week } from "./types";

function progressWith(keys: string[]): Progress {
  return { ...emptyProgress(), completed: Object.fromEntries(keys.map((key) => [key, 1])) };
}

function keysOf(levels: Level[]): string[] {
  return levels.map((level) => level.key);
}

const WEEK_44: Week = { week: 44, words: WEEKS[0].words.map((word) => ({ ...word, id: `44-${word.id}`, week: 44 })) };
const realLevelCount = WEEKS.length * 4;

describe("map levels", () => {
  const { levels } = buildMap(WEEKS, emptyProgress());

  it("starts with the oldest week and ends each week with the test", () => {
    expect(levels[0]).toMatchObject({ number: 1, key: "37/lar-dig" });
    expect(levels[3]).toMatchObject({ number: 4, key: "37/prov" });
    expect(levels[4]).toMatchObject({ number: 5, key: "38/lar-dig" });
  });

  it("never ends: mix levels follow the newest week", () => {
    const mix = levels.slice(realLevelCount);
    expect(mix.length).toBeGreaterThanOrEqual(8);
    expect(mix[0]).toMatchObject({ key: mixKey(43, 1), href: "/mix/43/1" });
  });

  it("adds more mix levels as the player completes them", () => {
    const done = Array.from({ length: 6 }, (_, index) => mixKey(43, index + 1));
    const grown = buildMap(WEEKS, progressWith(done)).levels;
    expect(grown.length).toBeGreaterThan(levels.length);
    expect(grown.length % 4).toBe(0);
  });

  it("unlocks strictly in order", () => {
    const progress = progressWith(["37/lar-dig"]);
    expect(isLevelUnlocked(progress, { levels, index: 1 })).toBe(true);
    expect(isLevelUnlocked(progress, { levels, index: 2 })).toBe(false);
  });

  it("puts the player on the first unfinished level", () => {
    expect(currentLevelIndex(emptyProgress(), levels)).toBe(0);
    expect(currentLevelIndex(progressWith(["37/lar-dig", "37/stava"]), levels)).toBe(2);
  });
});

describe("a new week arriving", () => {
  const allReal = WEEKS.flatMap((week) => ["lar-dig", "stava", "meningar", "prov"].map((kind) => `${week.week}/${kind}`));
  const mixDone = [1, 2, 3, 4, 5].map((number) => mixKey(43, number));
  const progress = progressWith([...allReal, ...mixDone]);
  const before = buildMap(WEEKS, progress).levels;
  const after = buildMap([...WEEKS, WEEK_44], progress).levels;

  it("is placed right after the last level the player finished", () => {
    const lastDone = after.findIndex((level) => level.key === mixKey(43, 5));
    expect(after[lastDone + 1].key).toBe("44/lar-dig");
  });

  it("keeps finished levels and their numbers unchanged", () => {
    const finished = before.slice(0, realLevelCount + mixDone.length);
    expect(after.slice(0, finished.length)).toEqual(finished);
  });

  it("moves the goose to the new week", () => {
    expect(after[currentLevelIndex(progress, after)].key).toBe("44/lar-dig");
  });

  it("starts a new endless mix stream after the new week", () => {
    expect(keysOf(after)).toContain(mixKey(44, 1));
    expect(keysOf(after)).not.toContain(mixKey(43, 6));
  });
});

describe("map layout", () => {
  const map = buildMap(WEEKS, emptyProgress());
  const layout = layoutMap(map);

  it("places the first level at the bottom and later levels higher up", () => {
    for (let index = 1; index < layout.nodes.length; index++) {
      expect(layout.nodes[index].y).toBeLessThan(layout.nodes[index - 1].y);
    }
  });

  it("gives each world room for a banner and its levels", () => {
    for (const area of layout.worlds) {
      expect(area.height).toBeGreaterThanOrEqual(BANNER_HEIGHT + 4 * LEVEL_SPACING);
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
});
