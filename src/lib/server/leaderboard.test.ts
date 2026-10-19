import { describe, expect, it } from "vitest";
import { leaderboard, saveScores } from "./leaderboard";
import { saveLook } from "./looks";
import { createUser, migrateProgress } from "./store";

const PASSWORD = { salt: "s", hash: "h" };

describe("leaderboard", () => {
  it("ranks players by score and marks the current player", async () => {
    await createUser("elias", { name: "Elias", ...PASSWORD });
    await createUser("sam", { name: "Sam", ...PASSWORD });
    await createUser("kim", { name: "Kim", ...PASSWORD });
    await saveScores("elias", { xp: 120, map: 9, endless: 30 });
    await saveScores("sam", { xp: 300, map: 4, endless: 12 });
    await saveScores("kim", { xp: 50, map: 12, endless: 41 });

    const xp = await leaderboard("xp", "elias");
    expect(xp.entries.map((entry) => entry.name)).toEqual(["Sam", "Elias", "Kim"]);
    expect(xp.entries[1]).toMatchObject({ rank: 2, isMe: true });
    expect(xp.me).toEqual({ rank: 2, score: 120 });

    const endless = await leaderboard("endless", "elias");
    expect(endless.entries[0]).toMatchObject({ name: "Kim", score: 41 });
  });

  it("updates a player's score instead of adding a duplicate", async () => {
    await saveScores("sam", { xp: 10, map: 4, endless: 12 });
    const xp = await leaderboard("xp", "sam");
    expect(xp.entries.filter((entry) => entry.name === "Sam")).toHaveLength(1);
    expect(xp.me?.score).toBe(10);
  });
});

describe("leaderboard looks", () => {
  it("shows the look each player wears, with the scarf as default", async () => {
    await saveLook("elias", "keps");
    await saveLook("sam", null);
    const xp = await leaderboard("xp", "elias");
    const looks = Object.fromEntries(xp.entries.map((entry) => [entry.name, entry.look]));
    expect(looks).toEqual({ Elias: "keps", Sam: null, Kim: "halsduk" });
  });
});

describe("progress migration", () => {
  it("turns the old single outfit into a list", () => {
    expect(migrateProgress({ outfit: "krona" }).outfits).toEqual(["krona"]);
    expect(migrateProgress(null).outfits).toEqual([]);
  });
});
