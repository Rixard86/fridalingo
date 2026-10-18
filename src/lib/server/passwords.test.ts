import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./passwords";

describe("passwords", () => {
  it("accepts the original password", async () => {
    const record = await hashPassword("gås123");
    expect(await verifyPassword("gås123", record)).toBe(true);
  });

  it("rejects a different password", async () => {
    const record = await hashPassword("gås123");
    expect(await verifyPassword("gås124", record)).toBe(false);
  });

  it("never stores the password itself", async () => {
    const record = await hashPassword("gås123");
    expect(JSON.stringify(record)).not.toContain("gås123");
  });

  it("uses a new salt every time", async () => {
    const first = await hashPassword("gås123");
    const second = await hashPassword("gås123");
    expect(first.salt).not.toBe(second.salt);
    expect(first.hash).not.toBe(second.hash);
  });
});
