"use client";

import { useId, useSyncExternalStore } from "react";
import { krakenStage } from "@/lib/halloween";
import { SCARF_ID } from "@/lib/outfits";
import { GooseDefs, shadowFill } from "./GooseDefs";

export type GooseMood = "happy" | "cheer" | "sad" | "think";

interface GooseProps {
  mood?: GooseMood;
  look?: string | null;
  seasonal?: boolean;
  className?: string;
}

const NON_ALPHANUMERIC = /[^a-zA-Z0-9]/g;
const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 1736;
const VIEW_TOP = 120;
const LOOK_FRAME = { x: 0, width: IMAGE_WIDTH, height: IMAGE_HEIGHT };
const KRAKEN_FRAME = { x: -384, width: 1792, height: 2036 };
const POSE_BY_MOOD: Record<GooseMood, string> = { happy: "cool", cheer: "cheer", sad: "sad", think: "think" };

const noSubscription = () => () => {};
const todaysStage = () => krakenStage(new Date());
const noStageOnServer = () => null;

function lookImage(look: string | null, mood: GooseMood): string {
  const pose = POSE_BY_MOOD[mood];
  return look ? `/goose/looks/${look}-${pose}.webp` : `/goose/goose-${pose}.webp`;
}

export function Goose({ mood = "happy", look = SCARF_ID, seasonal = true, className = "" }: GooseProps) {
  const prefix = `goose${useId().replace(NON_ALPHANUMERIC, "")}`;
  const stage = useSyncExternalStore(noSubscription, todaysStage, noStageOnServer);
  const kraken = seasonal && stage !== null;
  const frame = kraken ? KRAKEN_FRAME : LOOK_FRAME;
  return (
    <svg
      viewBox={`0 ${VIEW_TOP} ${IMAGE_WIDTH} ${IMAGE_HEIGHT - VIEW_TOP}`}
      overflow={kraken ? "visible" : undefined}
      className={className}
      role="img"
      aria-label="Gåsen"
    >
      <GooseDefs prefix={prefix} />
      <ellipse cx="558" cy="1690" rx="380" ry="34" fill={shadowFill(prefix)} />
      <image href={lookImage(kraken ? `kraken-${stage}` : look, mood)} x={frame.x} width={frame.width} height={frame.height} />
    </svg>
  );
}
