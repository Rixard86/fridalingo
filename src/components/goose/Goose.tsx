import { useId } from "react";
import type { GearLayer } from "./gear/types";
import { GooseDefs, shadowFill } from "./GooseDefs";
import { GooseGear } from "./GooseGear";
import { headTransform, POSES } from "./poses";

export type GooseMood = "happy" | "cheer" | "sad" | "think";

interface GooseProps {
  mood?: GooseMood;
  outfits?: string[];
  className?: string;
}

const NON_ALPHANUMERIC = /[^a-zA-Z0-9]/g;
const SKATE_LIFT = "translate(0 -72)";
const SHADOW_ON_BOARD = "translate(0 60)";
const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 1536;

export function Goose({ mood = "happy", outfits = [], className = "" }: GooseProps) {
  const prefix = `goose${useId().replace(NON_ALPHANUMERIC, "")}`;
  const pose = POSES[mood];
  const context = { prefix, pose };
  const skating = outfits.includes("skateboard");
  const gear = (layer: GearLayer) => <GooseGear outfits={outfits} layer={layer} context={context} />;
  return (
    <svg viewBox="0 -220 1024 1780" className={className} role="img" aria-label="Gåsen">
      <GooseDefs prefix={prefix} />
      <ellipse cx="520" cy="1490" rx="380" ry="34" fill={shadowFill(prefix)} transform={skating ? SHADOW_ON_BOARD : undefined} />
      {gear("ground")}
      <g transform={skating ? SKATE_LIFT : undefined}>
        <image href={pose.image} width={IMAGE_WIDTH} height={IMAGE_HEIGHT} />
        {gear("torso")}
        {gear("neck")}
        <g transform={headTransform(pose)}>{gear("head")}</g>
      </g>
    </svg>
  );
}
