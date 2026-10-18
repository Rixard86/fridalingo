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

export interface GreetingInfo {
  name: string;
  streak: number;
  todaysXp: number;
  goalXp: number;
}

export function homeGreeting(info: GreetingInfo): string {
  if (info.todaysXp >= info.goalXp) return `Dagsmålet är klart, ${info.name}! Du är en riktig glosgås! 🎉`;
  if (info.todaysXp > 0) return `Bra jobbat, ${info.name}! Bara lite kvar till dagsmålet!`;
  if (info.streak > 0) return `Hej ${info.name}! Håll igång din svit på ${info.streak} dagar! 🔥`;
  return `Kvack! Hej ${info.name}! Dags för dagens glosor?`;
}
