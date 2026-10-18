import { describe, expect, it } from "vitest";
import { newlyEarnedBadges } from "./badges";
import { equipOutfit } from "./outfits";
import { emptyProgress } from "./progress";
import { mapLevelsDone, scoresFor, totalStars, worldsDone } from "./scores";
import type { Progress } from "./types";

function progressWith(completed: string[], extra: Partial<Progress> = {}): Progress {
  return { ...emptyProgress(), completed: Object.fromEntries(completed.map((key) => [key, 1])), ...extra };
}

describe("map scores", () => {
  const progress = progressWith(
    ["37/lar-dig", "37/stava", "37/meningar", "37/prov", "mix-43/1", "mix-43/2", "mix-43/3", "mix-43/4", "repetera", "endless"],
    { stars: { "37/lar-dig": 3, "37/prov": 2, "mix-43/1": 1, endless: 1 } },
  );

  it("counts week and mix levels but not reviews or endless", () => {
    expect(mapLevelsDone(progress)).toBe(8);
  });

  it("counts a world as done when its last level is done", () => {
    expect(worldsDone(progress)).toBe(2);
  });

  it("sums stars from map levels only", () => {
    expect(totalStars(progress)).toBe(6);
  });

  it("builds one score per leaderboard", () => {
    expect(scoresFor({ ...progress, xp: 120, endlessRecord: 17 })).toEqual({ xp: 120, map: 8, endless: 17 });
  });
});

describe("new badges", () => {
  it("awards the explorer badge after three worlds", () => {
    const progress = progressWith(["37/prov", "38/prov", "39/prov"]);
    expect(newlyEarnedBadges(progress).map((badge) => badge.id)).toContain("varldar-3");
  });

  it("awards the GOAT badge for 100 points in endless", () => {
    const badges = newlyEarnedBadges({ ...emptyProgress(), endlessRecord: 100 }).map((badge) => badge.id);
    expect(badges).toEqual(expect.arrayContaining(["endless-25", "endless-50", "endless-100"]));
  });

  it("awards the style badge when five outfits are unlocked", () => {
    expect(newlyEarnedBadges({ ...emptyProgress(), xp: 300 }).map((badge) => badge.id)).toContain("stilikon");
  });
});

describe("equipping outfits", () => {
  it("lets the goose wear items in different slots together", () => {
    expect(equipOutfit(equipOutfit(["keps"], "solglasogon"), "skateboard")).toEqual(["keps", "solglasogon", "skateboard"]);
  });

  it("swaps items in the same slot", () => {
    expect(equipOutfit(["keps", "solglasogon"], "krona")).toEqual(["solglasogon", "krona"]);
  });

  it("takes an item off when tapped again", () => {
    expect(equipOutfit(["keps", "solglasogon"], "keps")).toEqual(["solglasogon"]);
  });
});
