import type { RandomSource } from "./random";

export const PRAISE = [
  "Snyggt!",
  "Kanon!",
  "Helt rätt!",
  "Grymt jobbat!",
  "Kvack-tastiskt!",
  "Du är en stjärna!",
  "Wow!",
  "Perfekt!",
];

export const COMFORT = ["Nästan!", "Bra försök!", "Nära ögat!", "Inte riktigt…"];

const COMBO_MILESTONES: Record<number, string> = {
  3: "3 i rad! 🔥",
  5: "5 i rad! Du är het! 🔥🔥",
  10: "10 i rad! Ostoppbar! 🚀",
  15: "15 i rad! Glosgeni! 🧠",
  20: "20 i rad! Gåskungen! 👑",
};

export function comboCheer(combo: number): string | null {
  return COMBO_MILESTONES[combo] ?? null;
}

export function pickOne<T>(items: readonly T[], random: RandomSource = Math.random): T {
  return items[Math.floor(random() * items.length)];
}

const ENDINGS_WITHOUT_GENITIVE_S = /[sxz]$/i;

export function possessive(name: string): string {
  return ENDINGS_WITHOUT_GENITIVE_S.test(name) ? name : `${name}s`;
}
