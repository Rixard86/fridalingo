const MS_PER_DAY = 86_400_000;
const DAYS_PER_WEEK = 7;
const JANUARY = 0;
const OCTOBER = 9;
const DECEMBER = 11;
const HALLOWEEN_DAY = 31;
const CHRISTMAS_EVE = 24;
const CHRISTMAS_DAY = 25;
const KNUT_DAY = 13;
const ADVENT_SUNDAYS = 4;
const FINAL_STAGE = 5;

export const HALLOWEEN_THEMES = ["kraken", "spoke", "pumpa"] as const;
export const CHRISTMAS_THEMES = ["tomte", "gran", "pepparkaka", "snoflinga"] as const;
export const DEFAULT_SEASON_THEMES = { halloween: HALLOWEEN_THEMES[0], jul: CHRISTMAS_THEMES[0] };

export type SeasonId = keyof typeof DEFAULT_SEASON_THEMES;

export interface Season {
  title: string;
  hint: string;
  moods: boolean;
  themes: readonly string[];
}

export const SEASONS: Record<SeasonId, Season> = {
  halloween: {
    title: "🎃 Halloween-monster",
    hint: "Välj vad gåsen förvandlas till. Den växer varje dag fram till Halloween!",
    moods: true,
    themes: HALLOWEEN_THEMES,
  },
  jul: {
    title: "🎄 Julgås",
    hint: "Välj julgås. Den blir juligare varje advent och är som mest på julafton!",
    moods: false,
    themes: CHRISTMAS_THEMES,
  },
};

export const THEME_NAMES: Record<string, string> = {
  kraken: "Kraken",
  spoke: "Spöke",
  pumpa: "Pumpa",
  tomte: "Tomte",
  gran: "Julgran",
  pepparkaka: "Pepparkaka",
  snoflinga: "Snöflinga",
};

export interface ActiveSeason {
  season: SeasonId;
  stage: number;
}

function dayOf(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY;
}

function firstAdvent(year: number): number {
  const christmas = new Date(Date.UTC(year, DECEMBER, CHRISTMAS_DAY));
  const fourthAdvent = christmas.getTime() / MS_PER_DAY - (christmas.getUTCDay() || DAYS_PER_WEEK);
  return fourthAdvent - (ADVENT_SUNDAYS - 1) * DAYS_PER_WEEK;
}

export function halloweenStage(date: Date): number | null {
  const stage = FINAL_STAGE - (HALLOWEEN_DAY - date.getDate());
  return date.getMonth() === OCTOBER && stage >= 1 ? stage : null;
}

export function christmasStage(date: Date): number | null {
  if (date.getMonth() === JANUARY) return date.getDate() <= KNUT_DAY ? FINAL_STAGE : null;
  if (date.getMonth() === DECEMBER && date.getDate() >= CHRISTMAS_EVE) return FINAL_STAGE;
  const weeks = Math.floor((dayOf(date) - firstAdvent(date.getFullYear())) / DAYS_PER_WEEK);
  return weeks >= 0 ? weeks + 1 : null;
}

export function activeSeason(date: Date): ActiveSeason | null {
  const halloween = halloweenStage(date);
  if (halloween !== null) return { season: "halloween", stage: halloween };
  const christmas = christmasStage(date);
  return christmas === null ? null : { season: "jul", stage: christmas };
}
