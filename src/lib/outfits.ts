import { levelFor } from "./rewards";

export type OutfitSlot = "head" | "eyes" | "neck" | "body" | "feet";

export interface Outfit {
  id: string;
  name: string;
  level: number;
  slot: OutfitSlot;
}

export const OUTFITS: Outfit[] = [
  { id: "keps", name: "Bakvänd keps", level: 2, slot: "head" },
  { id: "solglasogon", name: "Solglasögon", level: 3, slot: "eyes" },
  { id: "fluga", name: "Fluga", level: 4, slot: "neck" },
  { id: "ninjaband", name: "Ninjaband", level: 5, slot: "head" },
  { id: "partyhatt", name: "Partyhatt", level: 6, slot: "head" },
  { id: "skateboard", name: "Skateboard", level: 7, slot: "feet" },
  { id: "krona", name: "Krona", level: 8, slot: "head" },
  { id: "guldkedja", name: "Guldkedja", level: 9, slot: "neck" },
  { id: "hatt", name: "Hatt", level: 10, slot: "head" },
  { id: "hoodie", name: "Hoodie", level: 12, slot: "body" },
  { id: "riddarhjalm", name: "Riddarhjälm", level: 15, slot: "head" },
];

const OUTFIT_BY_ID = new Map(OUTFITS.map((outfit) => [outfit.id, outfit]));

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

export function equipOutfit(equipped: string[], id: string): string[] {
  if (equipped.includes(id)) return equipped.filter((item) => item !== id);
  const slot = OUTFIT_BY_ID.get(id)?.slot;
  return [...equipped.filter((item) => OUTFIT_BY_ID.get(item)?.slot !== slot), id];
}
