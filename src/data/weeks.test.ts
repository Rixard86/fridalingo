import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ALL_WORDS, RAW_WEEKS, WEEKS } from "./weeks";

const BLANK = "___";
const GLOSOR_DIR = path.join(__dirname, "glosor");

describe("glosor data", () => {
  it("registers every json file in the glosor folder", () => {
    const files = readdirSync(GLOSOR_DIR).filter((file) => file.endsWith(".json"));
    expect(RAW_WEEKS).toHaveLength(files.length);
  });

  it("has unique week numbers", () => {
    const numbers = WEEKS.map((week) => week.week);
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it("has unique word ids", () => {
    const ids = ALL_WORDS.map((word) => word.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has at least one answer in each language", () => {
    for (const word of ALL_WORDS) {
      expect(word.en.length, word.id).toBeGreaterThan(0);
      expect(word.sv.length, word.id).toBeGreaterThan(0);
    }
  });

  it("has exactly one blank in every sentence", () => {
    for (const word of ALL_WORDS.filter((item) => item.sentence)) {
      expect(word.sentence?.en.split(BLANK)).toHaveLength(2);
    }
  });

  it("has at least one underlined word per week", () => {
    for (const week of WEEKS) {
      expect(week.words.some((word) => word.sentence), String(week.week)).toBe(true);
    }
  });

  it("lists the newest week first", () => {
    expect(WEEKS[0].week).toBeGreaterThan(WEEKS[WEEKS.length - 1].week);
  });
});
