import type { Pose } from "../poses";

export interface GearContext {
  prefix: string;
  pose: Pose;
}

export type GearLayer = "ground" | "torso" | "neck" | "head";
