const MS_PER_DAY = 86_400_000;
const SWEDISH_DATE_LOCALE = "sv-SE";

export function dayKey(date: Date): string {
  return date.toLocaleDateString(SWEDISH_DATE_LOCALE);
}

export function previousDayKey(day: string): string {
  const midnight = new Date(`${day}T00:00:00Z`).getTime();
  return new Date(midnight - MS_PER_DAY).toISOString().split("T")[0];
}
