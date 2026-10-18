import { EYE, HEAD_FILL, OUTLINE, TEAR } from "./colors";
import type { GoosePaint } from "./GooseDefs";
import type { GooseMood } from "./Goose";

const LOOK_UP = -3.5;

const BROWS: Record<GooseMood, string> = {
  happy: "M63 31 C70 29 80 26 89 23",
  cheer: "M64 26 C70 20 82 18 89 22",
  sad: "M63 25 C70 26 80 28 89 31",
  think: "M64 24 C70 16 82 15 89 20",
};

const LIDS: Partial<Record<GooseMood, string>> = {
  happy: "M67.5 37 C72 34.5 79 33.5 84.5 34.5",
  sad: "M67.5 33 C72 33 79 35 84.5 39",
};

function Lid({ line }: { line: string }) {
  return (
    <g>
      <path d={`${line} L84.5 27 L67.5 27 Z`} fill={HEAD_FILL} />
      <path d={line} fill="none" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function OpenEye({ mood, paint }: { mood: GooseMood; paint: GoosePaint }) {
  const lookUp = mood === "think" ? LOOK_UP : 0;
  const lid = LIDS[mood];
  return (
    <g>
      <ellipse cx="76" cy="38" rx="8" ry="9.5" fill="#ffffff" stroke={OUTLINE} strokeWidth="2" />
      <g transform={`translate(0 ${lookUp})`}>
        <ellipse cx="73" cy="39" rx="5.2" ry="6.6" fill={paint.iris} />
        <ellipse cx="72" cy="39.6" rx="2.9" ry="3.7" fill="#0d0d0d" />
        <circle cx="74.3" cy="36" r="1.9" fill="#ffffff" />
        <circle cx="70.6" cy="42.4" r="0.9" fill="#ffffff" />
      </g>
      {lid ? <Lid line={lid} /> : <path d="M67.5 33 C72 28 80 28 84.5 33" fill="none" stroke={OUTLINE} strokeWidth="2.6" strokeLinecap="round" />}
      <path d="M84 34 L88 31.5 M84.5 37 L88.5 36" stroke={OUTLINE} strokeWidth="1.8" strokeLinecap="round" />
      {mood === "sad" && <path d="M73 49 q-3.5 5.5 0 8 q3.5 -2.5 0 -8 Z" fill={TEAR} stroke="#4aa8e8" strokeWidth="1" />}
    </g>
  );
}

function SquintEye() {
  return (
    <g fill="none" stroke={EYE} strokeLinecap="round">
      <path d="M67 41 Q76 29 85 40" strokeWidth="4" />
      <path d="M84.5 39 L88.5 37.5 M83 35 L86.5 32.5" strokeWidth="1.8" />
    </g>
  );
}

export function GooseEyes({ mood, paint }: { mood: GooseMood; paint: GoosePaint }) {
  return (
    <g>
      {mood === "cheer" ? <SquintEye /> : <OpenEye mood={mood} paint={paint} />}
      <path d={BROWS[mood]} fill="none" stroke={OUTLINE} strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}
