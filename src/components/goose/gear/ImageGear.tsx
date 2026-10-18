import { GLASSES_IMAGE, type GearPlacement } from "./placements";
import type { GearContext } from "./types";

const NEAR_EYE = { x: 2, y: 163 };
const HEAD_BACK_CLIP = { x: -600, y: -400, width: 755, height: 1000 };
const HALF_TURN_DEGREES = 180;
const DEGREES_PER_RADIAN = HALF_TURN_DEGREES / Math.PI;
const DECIMALS = 3;

export function GearImage({ placement }: { placement: GearPlacement }) {
  return <image href={placement.href} x={placement.x} y={placement.y} width={placement.width} height={placement.height} />;
}

function glassesTransform(context: GearContext): string {
  const { nearLens, farLens } = GLASSES_IMAGE;
  const farEye = context.pose.farEye;
  const lens = { x: nearLens.x - farLens.x, y: nearLens.y - farLens.y };
  const eyes = { x: NEAR_EYE.x - farEye.x, y: NEAR_EYE.y - farEye.y };
  const scale = Math.hypot(eyes.x, eyes.y) / Math.hypot(lens.x, lens.y);
  const angle = (Math.atan2(eyes.y, eyes.x) - Math.atan2(lens.y, lens.x)) * DEGREES_PER_RADIAN;
  return `translate(${NEAR_EYE.x} ${NEAR_EYE.y}) rotate(${angle.toFixed(DECIMALS)}) scale(${scale.toFixed(DECIMALS)}) translate(${-nearLens.x} ${-nearLens.y})`;
}

export function Sunglasses({ context }: { context: GearContext }) {
  const clipId = `${context.prefix}-glasses`;
  return (
    <g>
      <clipPath id={clipId}>
        <rect x={HEAD_BACK_CLIP.x} y={HEAD_BACK_CLIP.y} width={HEAD_BACK_CLIP.width} height={HEAD_BACK_CLIP.height} />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <image href={GLASSES_IMAGE.href} width={GLASSES_IMAGE.width} height={GLASSES_IMAGE.height} transform={glassesTransform(context)} />
      </g>
    </g>
  );
}
