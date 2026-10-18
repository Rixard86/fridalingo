import type { GearLayer } from "./types";

export interface GearPlacement {
  href: string;
  layer: GearLayer;
  order: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const GLASSES_ID = "solglasogon";

export const GLASSES_IMAGE = {
  href: "/goose/gear/solglasogon.webp",
  width: 600,
  height: 212,
  nearLens: { x: 261.4, y: 121.7 },
  farLens: { x: 73.4, y: 93.6 },
};

export const GEAR_PLACEMENTS: Record<string, GearPlacement> = {
  riddarhjalm: { href: "/goose/gear/riddarhjalm.webp", layer: "head", order: 0, x: -170, y: -153, width: 434, height: 485 },
  solglasogon: { href: GLASSES_IMAGE.href, layer: "head", order: 1, x: 0, y: 0, width: 0, height: 0 },
  ninjaband: { href: "/goose/gear/ninjaband.webp", layer: "head", order: 2, x: -155, y: -54, width: 503, height: 220 },
  keps: { href: "/goose/gear/keps.webp", layer: "head", order: 2, x: -160, y: -78, width: 400, height: 277 },
  partyhatt: { href: "/goose/gear/partyhatt.webp", layer: "head", order: 2, x: -100, y: -212, width: 197, height: 253 },
  krona: { href: "/goose/gear/krona.webp", layer: "head", order: 2, x: -123, y: -155, width: 276, height: 208 },
  hatt: { href: "/goose/gear/hatt.webp", layer: "head", order: 2, x: -220, y: -162, width: 430, height: 261 },
  fluga: { href: "/goose/gear/fluga.webp", layer: "neck", order: 0, x: 345, y: 509, width: 150, height: 78 },
  guldkedja: { href: "/goose/gear/guldkedja.webp", layer: "neck", order: 0, x: 315, y: 680, width: 300, height: 242 },
  hoodie: { href: "/goose/gear/hoodie.webp", layer: "torso", order: 0, x: 260, y: 640, width: 680, height: 667 },
  skateboard: { href: "/goose/gear/skateboard.webp", layer: "ground", order: 0, x: 230, y: 1348, width: 600, height: 207 },
};
