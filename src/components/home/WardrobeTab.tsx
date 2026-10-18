"use client";

import { Goose } from "@/components/goose/Goose";
import { useAccount } from "@/components/ProgressProvider";
import { possessive } from "@/lib/messages";
import { isOutfitUnlocked, LEVEL_XP, levelFor, OUTFITS } from "@/lib/rewards";

interface OutfitChoice {
  id: string | null;
  name: string;
  level: number;
}

const NO_OUTFIT: OutfitChoice = { id: null, name: "Ingen", level: 1 };

export function WardrobeTab() {
  const { name, progress, updateProgress, logout } = useAccount();
  const level = levelFor(progress.xp);
  const xpToNext = level * LEVEL_XP - progress.xp;
  return (
    <div className="flex flex-col items-center gap-4">
      <Goose outfit={progress.outfit} mood="cheer" className="w-44 animate-goose-bob" />
      <div className="text-center">
        <h2 className="text-3xl font-black">{possessive(name)} gås</h2>
        <p className="font-bold text-wolf">
          Nivå {level} · {xpToNext} XP till nästa nivå
        </p>
      </div>
      <div className="grid w-full grid-cols-3 gap-3">
        {[NO_OUTFIT, ...OUTFITS].map((outfit) => {
          const unlocked = isOutfitUnlocked(outfit, progress.xp);
          const selected = progress.outfit === outfit.id;
          return (
            <button
              key={outfit.name}
              disabled={!unlocked}
              onClick={() => void updateProgress({ ...progress, outfit: outfit.id })}
              className={`tile flex flex-col items-center gap-1 px-2 ${selected ? "tile-selected" : ""} ${unlocked ? "" : "tile-done"}`}
            >
              <Goose outfit={outfit.id} className={`w-16 ${unlocked ? "" : "opacity-40 grayscale"}`} />
              <span className="text-sm">{outfit.name}</span>
              {!unlocked && <span className="text-xs">🔒 Nivå {outfit.level}</span>}
            </button>
          );
        })}
      </div>
      <button onClick={() => void logout()} className="mt-6 text-sm font-bold text-hare underline">
        Logga ut
      </button>
    </div>
  );
}
