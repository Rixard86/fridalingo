import type { Sentence, Week, Word } from "@/lib/types";
import v37 from "./glosor/v37.json";
import v38 from "./glosor/v38.json";
import v39 from "./glosor/v39.json";
import v40 from "./glosor/v40.json";
import v41 from "./glosor/v41.json";
import v42 from "./glosor/v42.json";
import v43 from "./glosor/v43.json";

interface RawWord {
  en: string[];
  sv: string[];
  sentence?: Sentence;
}

interface RawWeek {
  week: number;
  words: RawWord[];
}

export const RAW_WEEKS: RawWeek[] = [v37, v38, v39, v40, v41, v42, v43];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toWeek(raw: RawWeek): Week {
  const words: Word[] = raw.words.map((word) => ({
    ...word,
    id: `${raw.week}-${slugify(word.en[0])}`,
    week: raw.week,
  }));
  return { week: raw.week, words };
}

export const WEEKS: Week[] = RAW_WEEKS.map(toWeek).sort((a, b) => b.week - a.week);

export const ALL_WORDS: Word[] = WEEKS.flatMap((week) => week.words);

export function findWeek(weekNumber: number): Week | undefined {
  return WEEKS.find((week) => week.week === weekNumber);
}
