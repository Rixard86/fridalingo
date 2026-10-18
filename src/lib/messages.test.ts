import { describe, expect, it } from "vitest";
import { comboCheer, homeGreeting, possessive } from "./messages";

describe("possessive", () => {
  it("adds s to most names", () => {
    expect(possessive("Elias")).toBe("Elias");
    expect(possessive("Frida")).toBe("Fridas");
  });
});

describe("homeGreeting", () => {
  it("celebrates a reached daily goal", () => {
    expect(homeGreeting({ name: "Sam", streak: 3, todaysXp: 30, goalXp: 30 })).toContain("Dagsmålet är klart");
  });

  it("mentions the streak before practising", () => {
    expect(homeGreeting({ name: "Sam", streak: 3, todaysXp: 0, goalXp: 30 })).toContain("3 dagar");
  });
});

describe("comboCheer", () => {
  it("cheers only at milestones", () => {
    expect(comboCheer(3)).not.toBeNull();
    expect(comboCheer(4)).toBeNull();
  });
});
