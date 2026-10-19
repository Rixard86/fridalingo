"use client";

import { Goose } from "@/components/goose/Goose";
import { useAccount } from "@/components/ProgressProvider";
import { useSeason } from "@/lib/client/useSeason";
import { SEASONS, THEME_NAMES, type SeasonId } from "@/lib/seasons";

const GRID_BY_SEASON: Record<SeasonId, string> = { halloween: "grid-cols-3", jul: "grid-cols-2" };

export function SeasonPicker() {
  const { progress, updateProgress } = useAccount();
  const active = useSeason();
  if (!active) return null;
  const season = SEASONS[active.season];
  const chosen = progress.seasonThemes[active.season];

  function choose(theme: string) {
    if (!active) return;
    void updateProgress({ ...progress, seasonThemes: { ...progress.seasonThemes, [active.season]: theme } });
  }

  return (
    <section className="flex w-full flex-col gap-3">
      <div className="text-center">
        <h3 className="text-2xl font-black text-fox">{season.title}</h3>
        <p className="text-sm font-bold text-hare">{season.hint}</p>
      </div>
      <div className={`grid gap-3 ${GRID_BY_SEASON[active.season]}`}>
        {season.themes.map((theme) => (
          <button
            key={theme}
            onClick={() => choose(theme)}
            className={`tile flex flex-col items-center gap-1 overflow-hidden px-2 ${chosen === theme ? "tile-selected" : ""}`}
          >
            <Goose themes={{ ...progress.seasonThemes, [active.season]: theme }} className="w-16" />
            <span className="text-sm leading-tight">{THEME_NAMES[theme]}</span>
            {chosen === theme && <span className="text-xs">✅ Vald</span>}
          </button>
        ))}
      </div>
    </section>
  );
}
