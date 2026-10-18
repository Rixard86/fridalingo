import { levelFor } from "./rewards";
import type { Progress } from "./types";

export interface Outfit {
  id: string;
  name: string;
  level: number;
}

export const SCARF_ID = "halsduk";

export const OUTFITS: Outfit[] = [
  { id: SCARF_ID, name: "Halsduk", level: 1 },
  { id: "keps", name: "Bakvänd keps", level: 2 },
  { id: "solglasogon", name: "Solglasögon", level: 3 },
  { id: "fluga", name: "Fluga", level: 4 },
  { id: "ninjaband", name: "Ninjaband", level: 5 },
  { id: "partyhatt", name: "Partyhatt", level: 6 },
  { id: "skateboard", name: "Skateboard", level: 7 },
  { id: "krona", name: "Krona", level: 8 },
  { id: "guldkedja", name: "Guldkedja", level: 9 },
  { id: "hatt", name: "Hatt", level: 10 },
  { id: "hoodie", name: "Hoodie", level: 12 },
  { id: "riddarhjalm", name: "Riddarhjälm", level: 15 },
];

export function isOutfitUnlocked(outfit: Pick<Outfit, "level">, xp: number): boolean {
  return levelFor(xp) >= outfit.level;
}

export function unlockedOutfitCount(xp: number): number {
  return OUTFITS.filter((outfit) => isOutfitUnlocked(outfit, xp)).length;
}

export function newlyUnlockedOutfits(previousXp: number, currentXp: number): Outfit[] {
  return OUTFITS.filter(
    (outfit) => !isOutfitUnlocked(outfit, previousXp) && isOutfitUnlocked(outfit, currentXp),
  );
}

type Wardrobe = Pick<Progress, "outfits" | "scarfOff">;

export function wornLook(wardrobe: Wardrobe): string | null {
  return wardrobe.outfits.at(-1) ?? (wardrobe.scarfOff ? null : SCARF_ID);
}

export function chooseLook<T extends Wardrobe>(wardrobe: T, id: string): T {
  if (wornLook(wardrobe) === id) return { ...wardrobe, outfits: [], scarfOff: true };
  return { ...wardrobe, outfits: [id], scarfOff: false };
}
