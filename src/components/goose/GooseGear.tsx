import type { JSX } from "react";
import { BowTie, GoldChain, Hood, HoodieTorso, Skateboard, Sunglasses } from "./gear/BodyGear";
import { BackwardsCap, Crown, Hat, KnightHelmet, NinjaBand, PartyHat } from "./gear/HeadGear";
import type { GearContext, GearLayer } from "./gear/types";

interface GearPiece {
  layer: GearLayer;
  Drawing: (context: GearContext) => JSX.Element;
}

const GEAR: Record<string, GearPiece[]> = {
  keps: [{ layer: "head", Drawing: BackwardsCap }],
  ninjaband: [{ layer: "head", Drawing: NinjaBand }],
  partyhatt: [{ layer: "head", Drawing: PartyHat }],
  krona: [{ layer: "head", Drawing: Crown }],
  hatt: [{ layer: "head", Drawing: Hat }],
  riddarhjalm: [{ layer: "helmet", Drawing: KnightHelmet }],
  solglasogon: [{ layer: "face", Drawing: Sunglasses }],
  fluga: [{ layer: "neck", Drawing: BowTie }],
  guldkedja: [{ layer: "neck", Drawing: GoldChain }],
  hoodie: [
    { layer: "hood", Drawing: Hood },
    { layer: "torso", Drawing: HoodieTorso },
  ],
  skateboard: [{ layer: "ground", Drawing: Skateboard }],
};

const TUFT_HIDERS = ["keps", "partyhatt", "krona", "hatt", "riddarhjalm"];

export function hidesTuft(outfits: string[]): boolean {
  return outfits.some((outfit) => TUFT_HIDERS.includes(outfit));
}

interface GooseGearProps {
  outfits: string[];
  layer: GearLayer;
  context: GearContext;
}

export function GooseGear({ outfits, layer, context }: GooseGearProps) {
  return (
    <>
      {outfits.flatMap((outfit) =>
        (GEAR[outfit] ?? [])
          .filter((piece) => piece.layer === layer)
          .map(({ Drawing }) => <Drawing key={outfit} paint={context.paint} prefix={context.prefix} />),
      )}
    </>
  );
}
