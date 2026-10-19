"use client";

import { useId } from "react";
import { useSeason } from "@/lib/client/useSeason";
import { DEFAULT_SEASON_THEMES, SEASONS, type ActiveSeason, type SeasonId } from "@/lib/seasons";
import { SCARF_ID } from "@/lib/outfits";
import { GooseDefs, shadowFill } from "./GooseDefs";

export type GooseMood = "happy" | "cheer" | "sad" | "think";

interface GooseProps {
  mood?: GooseMood;
  look?: string | null;
  themes?: Record<SeasonId, string>;
  seasonal?: boolean;
  className?: string;
}

const NON_ALPHANUMERIC = /[^a-zA-Z0-9]/g;
const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 1736;
const VIEW_TOP = 120;
const LOOK_FRAME = { x: 0, width: IMAGE_WIDTH, height: IMAGE_HEIGHT };
const SEASON_FRAME = { x: -384, width: 1792, height: 2036 };
const POSE_BY_MOOD: Record<GooseMood, string> = { happy: "cool", cheer: "cheer", sad: "sad", think: "think" };

function lookImage(look: string | null, mood: GooseMood): string {
  const pose = POSE_BY_MOOD[mood];
  return look ? `/goose/looks/${look}-${pose}.webp` : `/goose/goose-${pose}.webp`;
}

function seasonImage(active: ActiveSeason, choice: { theme: string; mood: GooseMood }): string {
  const name = `${choice.theme}-${active.stage}`;
  return SEASONS[active.season].moods ? `/goose/looks/${name}-${POSE_BY_MOOD[choice.mood]}.webp` : `/goose/looks/${name}.webp`;
}

export function Goose({ mood = "happy", look = SCARF_ID, themes = DEFAULT_SEASON_THEMES, seasonal = true, className = "" }: GooseProps) {
  const prefix = `goose${useId().replace(NON_ALPHANUMERIC, "")}`;
  const season = useSeason();
  const active = seasonal ? season : null;
  const frame = active ? SEASON_FRAME : LOOK_FRAME;
  const href = active ? seasonImage(active, { theme: themes[active.season], mood }) : lookImage(look, mood);
  return (
    <svg
      viewBox={`0 ${VIEW_TOP} ${IMAGE_WIDTH} ${IMAGE_HEIGHT - VIEW_TOP}`}
      overflow={active ? "visible" : undefined}
      className={className}
      role="img"
      aria-label="Gåsen"
    >
      <GooseDefs prefix={prefix} />
      <ellipse cx="558" cy="1690" rx="380" ry="34" fill={shadowFill(prefix)} />
      <image href={href} x={frame.x} width={frame.width} height={frame.height} />
    </svg>
  );
}
