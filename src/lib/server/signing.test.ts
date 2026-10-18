import { describe, expect, it } from "vitest";
import { profileKey, safeEqual, signName, verifySignedName } from "./signing";

const SECRET = "test-secret";

describe("session signing", () => {
  it("round-trips a name with Swedish letters", () => {
    expect(verifySignedName(signName("Åke", SECRET), SECRET)).toBe("Åke");
  });

  it("rejects a token signed with another secret", () => {
    expect(verifySignedName(signName("Åke", "other"), SECRET)).toBeNull();
  });

  it("rejects a tampered name", () => {
    const [, signature] = signName("Åke", SECRET).split(".");
    const forged = `${Buffer.from("Admin").toString("base64url")}.${signature}`;
    expect(verifySignedName(forged, SECRET)).toBeNull();
  });

  it("rejects malformed tokens", () => {
    expect(verifySignedName("garbage", SECRET)).toBeNull();
  });

  it("compares passwords exactly", () => {
    expect(safeEqual("gås123", "gås123")).toBe(true);
    expect(safeEqual("gås12", "gås123")).toBe(false);
  });

  it("uses the same profile for different casing", () => {
    expect(profileKey("  Elias ")).toBe(profileKey("elias"));
  });
});
