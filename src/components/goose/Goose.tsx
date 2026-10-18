import { useId, type ReactNode } from "react";
import { FEATHER_LINE, FINE_STROKE, OUTLINE, STROKE } from "./colors";
import type { GearLayer } from "./gear/types";
import { GooseBeak } from "./GooseBeak";
import { GooseBody, GooseLegs, GooseShadow, GooseWing } from "./GooseBody";
import { GooseDefs, paintFor, type GoosePaint } from "./GooseDefs";
import { GooseEyes } from "./GooseEyes";
import { GooseGear, hidesTuft } from "./GooseGear";
import { GooseScarf } from "./GooseScarf";

export type GooseMood = "happy" | "cheer" | "sad" | "think";

interface GooseProps {
  mood?: GooseMood;
  outfits?: string[];
  className?: string;
}

interface HeadProps {
  mood: GooseMood;
  paint: GoosePaint;
  showTuft: boolean;
  gear: (layer: GearLayer) => ReactNode;
}

const NON_ALPHANUMERIC = /[^a-zA-Z0-9]/g;
const SKATE_LIFT = "translate(0 -6)";
const SHADOW_ON_BOARD = "translate(0 8)";

function Tuft({ paint }: { paint: GoosePaint }) {
  return (
    <g fill={paint.head} stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round">
      <path d="M88 17 C84 6 92 -2 103 -1 C112 0 115 8 110 13 C108 8 103 6 99 8 C96 10 96 13 97 16 Z" />
      <path d="M93 13 C93 7 98 3 104 3 M99 15 C100 10 104 8 108 9" fill="none" stroke={FEATHER_LINE} strokeWidth={FINE_STROKE} strokeLinecap="round" />
    </g>
  );
}

function GooseHead({ mood, paint, showTuft, gear }: HeadProps) {
  return (
    <g>
      {showTuft && <Tuft paint={paint} />}
      <path
        d="M56 42 C56 25 68 15 83 15 C98 15 108 27 108 42 C108 57 99 67 86 69 C70 71 56 60 56 42 Z"
        fill={paint.head}
        stroke={OUTLINE}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <path d="M88 20 C96 22 102 28 104 36" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <GooseEyes mood={mood} paint={paint} />
      {gear("helmet")}
      <GooseBeak mood={mood} paint={paint} />
      {gear("face")}
      {gear("head")}
    </g>
  );
}

export function Goose({ mood = "happy", outfits = [], className = "" }: GooseProps) {
  const prefix = `goose${useId().replace(NON_ALPHANUMERIC, "")}`;
  const paint = paintFor(prefix);
  const context = { paint, prefix };
  const hoodie = outfits.includes("hoodie");
  const skating = outfits.includes("skateboard");
  const gear = (layer: GearLayer) => <GooseGear outfits={outfits} layer={layer} context={context} />;
  return (
    <svg viewBox="0 -14 200 240" className={className} role="img" aria-label="Gåsen">
      <GooseDefs prefix={prefix} />
      <g transform={skating ? SHADOW_ON_BOARD : undefined}>
        <GooseShadow paint={paint} />
      </g>
      {gear("ground")}
      <g transform={skating ? SKATE_LIFT : undefined}>
        <GooseLegs paint={paint} />
        {gear("hood")}
        <GooseBody paint={paint} hoodie={hoodie} />
        {gear("torso")}
        <GooseWing paint={paint} hoodie={hoodie} raised={mood === "cheer"} />
        <GooseScarf paint={paint} />
        {gear("neck")}
        <GooseHead mood={mood} paint={paint} showTuft={!hidesTuft(outfits)} gear={gear} />
      </g>
    </svg>
  );
}
