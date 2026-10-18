import { describe, expect, it } from "vitest";
import { krakenStage } from "./halloween";

describe("kraken goose", () => {
  it("stays a normal goose until five days before Halloween", () => {
    expect(krakenStage(new Date(2026, 9, 26))).toBeNull();
  });

  it("grows one stage per day up to stage five on Halloween", () => {
    expect([27, 28, 29, 30, 31].map((day) => krakenStage(new Date(2026, 9, day)))).toEqual([1, 2, 3, 4, 5]);
  });

  it("turns back into a goose after Halloween", () => {
    expect(krakenStage(new Date(2026, 10, 1))).toBeNull();
    expect(krakenStage(new Date(2026, 11, 31))).toBeNull();
  });
});
