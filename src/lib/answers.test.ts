import { describe, expect, it } from "vitest";
import { answersFor, fillBlank, isAcceptedAnswer, normalizeAnswer, promptFor } from "./answers";
import type { Word } from "./types";

const cardigan: Word = { id: "41-cardigan", week: 41, en: ["Cardigan"], sv: ["Kofta", "Tröja"] };

describe("normalizeAnswer", () => {
  it("ignores case, punctuation and extra spaces", () => {
    expect(normalizeAnswer("  Where?  ")).toBe("where");
    expect(normalizeAnswer("Do  the   DISHES")).toBe("do the dishes");
  });
});

describe("isAcceptedAnswer", () => {
  it("accepts any listed alternative", () => {
    expect(isAcceptedAnswer("tröja", cardigan.sv)).toBe(true);
    expect(isAcceptedAnswer("Kofta", cardigan.sv)).toBe(true);
  });

  it("requires correct spelling", () => {
    expect(isAcceptedAnswer("Cardigen", cardigan.en)).toBe(false);
  });

  it("rejects empty input", () => {
    expect(isAcceptedAnswer("   ", cardigan.en)).toBe(false);
  });

  it("treats å, ä and ö as different letters", () => {
    expect(isAcceptedAnswer("Troja", cardigan.sv)).toBe(false);
  });
});

describe("fillBlank", () => {
  it("lowercases the answer inside a sentence", () => {
    expect(fillBlank("The ___ lit up the dark sky.", "Lightning")).toBe("The lightning lit up the dark sky.");
  });

  it("keeps the capital and drops the question mark at the start", () => {
    expect(fillBlank("___ does the film start?", "When?")).toBe("When does the film start?");
  });
});

describe("prompts and answers", () => {
  it("asks in English and expects Swedish for en-sv", () => {
    expect(promptFor(cardigan, "en-sv")).toBe("Cardigan");
    expect(answersFor(cardigan, "en-sv")).toEqual(["Kofta", "Tröja"]);
  });

  it("shows all Swedish alternatives for sv-en", () => {
    expect(promptFor(cardigan, "sv-en")).toBe("Kofta / Tröja");
    expect(answersFor(cardigan, "sv-en")).toEqual(["Cardigan"]);
  });
});
