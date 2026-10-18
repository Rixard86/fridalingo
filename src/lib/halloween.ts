const OCTOBER = 9;
const HALLOWEEN_DAY = 31;
const KRAKEN_STAGES = 5;

export function krakenStage(date: Date): number | null {
  const stage = KRAKEN_STAGES - (HALLOWEEN_DAY - date.getDate());
  return date.getMonth() === OCTOBER && stage >= 1 ? stage : null;
}
