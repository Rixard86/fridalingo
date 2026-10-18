import type { Direction, Exercise, Word } from "./types";

const PUNCTUATION = /[?!.,;:]/g;
const WHITESPACE = /\s+/g;
const BLANK = "___";

export function normalizeAnswer(text: string): string {
  return text.normalize("NFC").toLowerCase().replace(PUNCTUATION, "").replace(WHITESPACE, " ").trim();
}

export function isAcceptedAnswer(input: string, accepted: string[]): boolean {
  const given = normalizeAnswer(input);
  return given.length > 0 && accepted.some((answer) => normalizeAnswer(answer) === given);
}

export function answersFor(word: Word, direction: Direction): string[] {
  return direction === "en-sv" ? word.sv : word.en;
}

export function promptFor(word: Word, direction: Direction): string {
  return direction === "en-sv" ? word.en.join(" / ") : word.sv.join(" / ");
}

export function sentenceParts(sentence: string): [string, string] {
  const [before, after] = sentence.split(BLANK);
  return [before, after ?? ""];
}

export function fillBlank(sentence: string, answer: string): string {
  const [before, after] = sentenceParts(sentence);
  const bare = answer.replace(PUNCTUATION, "");
  const word = before.length === 0 ? bare : bare.toLowerCase();
  return `${before}${word}${after}`;
}

export function solutionFor(exercise: Exercise): string {
  switch (exercise.kind) {
    case "match":
      return "";
    case "choice":
      return answersFor(exercise.word, exercise.direction)[0];
    case "write":
      return answersFor(exercise.word, exercise.direction).join(" / ");
    case "listen":
      return exercise.word.en.join(" / ");
    case "sentence":
      return exercise.word.sentence ? fillBlank(exercise.word.sentence.en, exercise.word.en[0]) : exercise.word.en[0];
  }
}
