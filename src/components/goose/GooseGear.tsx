import { GearImage, Sunglasses } from "./gear/ImageGear";
import { GEAR_PLACEMENTS, GLASSES_ID } from "./gear/placements";
import type { GearContext, GearLayer } from "./gear/types";

interface GooseGearProps {
  outfits: string[];
  layer: GearLayer;
  context: GearContext;
}

export function GooseGear({ outfits, layer, context }: GooseGearProps) {
  const worn = outfits
    .filter((outfit) => GEAR_PLACEMENTS[outfit]?.layer === layer)
    .sort((a, b) => GEAR_PLACEMENTS[a].order - GEAR_PLACEMENTS[b].order);
  return (
    <>
      {worn.map((outfit) =>
        outfit === GLASSES_ID ? (
          <Sunglasses key={outfit} context={context} />
        ) : (
          <GearImage key={outfit} placement={GEAR_PLACEMENTS[outfit]} />
        ),
      )}
    </>
  );
}
