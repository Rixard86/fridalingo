import type { GoosePaint } from "../GooseDefs";

export interface GearContext {
  paint: GoosePaint;
  prefix: string;
}

export type GearLayer = "ground" | "hood" | "torso" | "neck" | "helmet" | "face" | "head";
