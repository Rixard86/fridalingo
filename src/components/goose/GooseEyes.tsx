import { EYE, OUTLINE, TEAR } from "./colors";
import type { GoosePaint } from "./GooseDefs";
import type { GooseMood } from "./Goose";

type Side = "left" | "right";

interface EyeProps {
  mood: GooseMood;
  side: Side;
  paint: GoosePaint;
}

const MIRROR = "translate(200 0) scale(-1 1)";
const LOOK_SIDEWAYS = 1.5;
const LOOK_UP = -2.5;

const BROWS: Record<GooseMood, string> = {
  happy: "M80 29 Q87 25 94 28",
  cheer: "M80 26 Q87 21 94 25",
  sad: "M80 31 L94 26",
  think: "M80 29 Q87 25 94 28",
};
const RAISED_BROW = "M80 24 Q87 18 94 23";

function Brow({ mood, side }: Omit<EyeProps, "paint">) {
  const raised = mood === "think" && side === "right";
  return <path d={raised ? RAISED_BROW : BROWS[mood]} fill="none" stroke={OUTLINE} strokeWidth="2.8" strokeLinecap="round" />;
}

function ClosedEye() {
  return (
    <g fill="none" stroke={EYE} strokeLinecap="round">
      <path d="M80 46 Q88 36 96 46" strokeWidth="4" />
      <path d="M80.5 45.5 L77 47 M82.5 41.5 L79.5 40" strokeWidth="1.8" />
    </g>
  );
}

function SadLid() {
  return (
    <g>
      <path d="M79.5 41 Q88 36 96.5 43 L96.5 34 L79.5 34 Z" fill="#eef2f8" />
      <path d="M79.5 41 Q88 36 96.5 43" fill="none" stroke={OUTLINE} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

function OpenEye({ mood, side, paint }: EyeProps) {
  const lookX = mood === "think" ? (side === "left" ? LOOK_SIDEWAYS : -LOOK_SIDEWAYS) : 0;
  const lookY = mood === "think" ? LOOK_UP : 0;
  return (
    <g>
      <ellipse cx="88" cy="44" rx="8" ry="10" fill="#ffffff" stroke={OUTLINE} strokeWidth="2" />
      <g transform={`translate(${lookX} ${lookY})`}>
        <ellipse cx="89" cy="45" rx="6" ry="7.5" fill={paint.iris} />
        <ellipse cx="89.5" cy="46" rx="3.2" ry="4" fill="#0d0d0d" />
        <circle cx="91.5" cy="41.5" r="2.4" fill="#ffffff" />
        <circle cx="87" cy="49" r="1.1" fill="#ffffff" />
      </g>
      {mood === "sad" ? (
        <SadLid />
      ) : (
        <path d="M79.5 39 Q88 30 96.5 39" fill="none" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" />
      )}
      <path d="M80 39 L76.5 37 M82 35.5 L79.5 32.5" stroke={OUTLINE} strokeWidth="1.8" strokeLinecap="round" />
      {mood === "sad" && side === "left" && (
        <path d="M78 53 q-3.5 5.5 0 8 q3.5 -2.5 0 -8 Z" fill={TEAR} stroke="#4aa8e8" strokeWidth="1" />
      )}
    </g>
  );
}

function Eye(props: EyeProps) {
  return (
    <g>
      {props.mood === "cheer" ? <ClosedEye /> : <OpenEye {...props} />}
      <Brow mood={props.mood} side={props.side} />
    </g>
  );
}

export function GooseEyes({ mood, paint }: { mood: GooseMood; paint: GoosePaint }) {
  return (
    <g>
      <Eye mood={mood} side="left" paint={paint} />
      <g transform={MIRROR}>
        <Eye mood={mood} side="right" paint={paint} />
      </g>
    </g>
  );
}
