import { useSyncExternalStore } from "react";
import { activeSeason, type ActiveSeason } from "@/lib/seasons";

let cached: { day: string; season: ActiveSeason | null } | null = null;

const noSubscription = () => () => {};
const noSeasonOnServer = () => null;

function todaysSeason(): ActiveSeason | null {
  const now = new Date();
  const day = now.toDateString();
  if (cached?.day !== day) cached = { day, season: activeSeason(now) };
  return cached.season;
}

export function useSeason(): ActiveSeason | null {
  return useSyncExternalStore(noSubscription, todaysSeason, noSeasonOnServer);
}
