import { describe, expect, it } from "vitest";
import { emptyProgress } from "./progress";
import { progressSchema } from "./schemas";
import { activeSeason, christmasStage, halloweenStage } from "./seasons";

describe("halloween monster", () => {
  it("stays a normal goose until five days before Halloween", () => {
    expect(halloweenStage(new Date(2026, 9, 26))).toBeNull();
  });

  it("grows one stage per day up to stage five on Halloween", () => {
    expect([27, 28, 29, 30, 31].map((day) => halloweenStage(new Date(2026, 9, day)))).toEqual([1, 2, 3, 4, 5]);
  });

  it("turns back into a goose after Halloween", () => {
    expect(halloweenStage(new Date(2026, 10, 1))).toBeNull();
    expect(halloweenStage(new Date(2026, 11, 31))).toBeNull();
  });
});

describe("christmas goose", () => {
  it("starts on the first Sunday of Advent", () => {
    expect(christmasStage(new Date(2026, 10, 28))).toBeNull();
    expect(christmasStage(new Date(2026, 10, 29))).toBe(1);
  });

  it("grows one stage each Advent Sunday", () => {
    expect([6, 13, 20, 23].map((day) => christmasStage(new Date(2026, 11, day)))).toEqual([2, 3, 4, 4]);
  });

  it("follows the calendar in other years", () => {
    expect(christmasStage(new Date(2025, 10, 29))).toBeNull();
    expect(christmasStage(new Date(2025, 10, 30))).toBe(1);
    expect(christmasStage(new Date(2025, 11, 21))).toBe(4);
  });

  it("is at its most festive from Christmas Eve until Knut", () => {
    expect(christmasStage(new Date(2026, 11, 24))).toBe(5);
    expect(christmasStage(new Date(2027, 0, 13))).toBe(5);
    expect(christmasStage(new Date(2027, 0, 14))).toBeNull();
  });
});

describe("seasons", () => {
  it("knows which season is active", () => {
    expect(activeSeason(new Date(2026, 9, 30))).toEqual({ season: "halloween", stage: 4 });
    expect(activeSeason(new Date(2026, 11, 24))).toEqual({ season: "jul", stage: 5 });
    expect(activeSeason(new Date(2026, 4, 1))).toBeNull();
  });

  it("starts with the kraken and the Santa goose, also for older saved progress", () => {
    const { seasonThemes, ...older } = emptyProgress();
    expect(seasonThemes).toEqual({ halloween: "kraken", jul: "tomte" });
    expect(progressSchema.parse(older).seasonThemes).toEqual({ halloween: "kraken", jul: "tomte" });
  });
});
