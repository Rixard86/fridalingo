import type { GooseMood } from "./Goose";

export interface Point {
  x: number;
  y: number;
}

export interface Pose {
  image: string;
  head: Point & { angle: number; scale: number };
  farEye: Point;
  wingOnBody: boolean;
}

export const POSES: Record<GooseMood, Pose> = {
  happy: {
    image: "/goose/goose-cool.webp",
    head: { x: 495, y: 100, angle: 0, scale: 1 },
    farEye: { x: -162, y: 150 },
    wingOnBody: true,
  },
  cheer: {
    image: "/goose/goose-cheer.webp",
    head: { x: 498, y: 106, angle: 4, scale: 1 },
    farEye: { x: -116, y: 104 },
    wingOnBody: false,
  },
  sad: {
    image: "/goose/goose-sad.webp",
    head: { x: 437, y: 114, angle: 5.5, scale: 1.28 },
    farEye: { x: -111, y: 154 },
    wingOnBody: true,
  },
  think: {
    image: "/goose/goose-think.webp",
    head: { x: 511, y: 113, angle: 16, scale: 1.25 },
    farEye: { x: -119, y: 153 },
    wingOnBody: false,
  },
};

export function headTransform(pose: Pose): string {
  const { x, y, angle, scale } = pose.head;
  return `translate(${x} ${y}) rotate(${angle}) scale(${scale})`;
}
