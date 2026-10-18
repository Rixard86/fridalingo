"use client";

import { Goose } from "@/components/goose/Goose";
import { useAccount } from "@/components/ProgressProvider";
import { possessive } from "@/lib/messages";
import { equipOutfit, isOutfitUnlocked, OUTFITS, type Outfit } from "@/lib/outfits";
import { LEVEL_XP, levelFor } from "@/lib/rewards";

interface OutfitTileProps {
  outfit: Outfit;
  unlocked: boolean;
  worn: boolean;
  onToggle: () => void;
}

function OutfitTile({ outfit, unlocked, worn, onToggle }: OutfitTileProps) {
  return (
    <button
      disabled={!unlocked}
      onClick={onToggle}
      className={`tile flex flex-col items-center gap-1 px-2 ${worn ? "tile-selected" : ""} ${unlocked ? "" : "tile-done"}`}
    >
      <Goose outfits={[outfit.id]} className={`w-16 ${unlocked ? "" : "opacity-40 grayscale"}`} />
      <span className="text-sm leading-tight">{outfit.name}</span>
      {!unlocked && <span className="text-xs">🔒 Nivå {outfit.level}</span>}
      {worn && <span className="text-xs">✅ På</span>}
    </button>
  );
}

export function WardrobeTab() {
  const { name, progress, updateProgress, logout } = useAccount();
  const level = levelFor(progress.xp);
  const xpToNext = level * LEVEL_XP - progress.xp;

  function toggle(id: string) {
    void updateProgress({ ...progress, outfits: equipOutfit(progress.outfits, id) });
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Goose outfits={progress.outfits} className="w-56 animate-goose-bob" />
      <div className="text-center">
        <h2 className="text-3xl font-black">{possessive(name)} gås</h2>
        <p className="font-bold text-wolf">
          Nivå {level} · {xpToNext} XP till nästa nivå
        </p>
        <p className="mt-1 text-sm font-bold text-hare">Tryck för att ta på eller av. Kombinera grejer!</p>
      </div>
      <div className="grid w-full grid-cols-3 gap-3">
        {OUTFITS.map((outfit) => (
          <OutfitTile
            key={outfit.id}
            outfit={outfit}
            unlocked={isOutfitUnlocked(outfit, progress.xp)}
            worn={progress.outfits.includes(outfit.id)}
            onToggle={() => toggle(outfit.id)}
          />
        ))}
      </div>
      {progress.outfits.length > 0 && (
        <button onClick={() => void updateProgress({ ...progress, outfits: [] })} className="btn btn-white w-full">
          Ta av allt
        </button>
      )}
      <button onClick={() => void logout()} className="mt-4 text-sm font-bold text-hare underline">
        Logga ut
      </button>
    </div>
  );
}
