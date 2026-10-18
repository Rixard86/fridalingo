export const LEVEL_XP = 50;
export const DAILY_GOAL_XP = 30;

export function levelFor(xp: number): number {
  return Math.floor(xp / LEVEL_XP) + 1;
}

export function levelRatio(xp: number): number {
  return (xp % LEVEL_XP) / LEVEL_XP;
}
