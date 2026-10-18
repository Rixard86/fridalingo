import { describe, expect, it } from "vitest";
import { comboCheer, possessive } from "./messages";

describe("possessive", () => {
  it("adds s to most names", () => {
    expect(possessive("Elias")).toBe("Elias");
    expect(possessive("Frida")).toBe("Fridas");
  });
});

describe("comboCheer", () => {
  it("cheers only at milestones", () => {
    expect(comboCheer(3)).not.toBeNull();
    expect(comboCheer(4)).toBeNull();
  });
});
