import { BEAK_DARK, BEAK_TIP } from "./colors";
import type { GoosePaint } from "./GooseDefs";
import type { GooseMood } from "./Goose";

function OpenMouth({ paint }: { paint: GoosePaint }) {
  return (
    <g strokeLinejoin="round">
      <path d="M85 61 Q100 90 115 61 Q100 69 85 61 Z" fill="#7a1f2b" stroke={BEAK_DARK} strokeWidth="2.5" />
      <path d="M91 72 Q100 86 109 72 Q100 76 91 72 Z" fill="#ff7a8a" />
      <path d="M86 66 Q100 94 114 66 Q100 87 86 66 Z" fill={paint.beak} stroke={BEAK_DARK} strokeWidth="2.5" />
    </g>
  );
}

function LowerBeak() {
  return <path d="M88 66 Q100 77 112 66 Q107 73 100 75 Q93 73 88 66 Z" fill="#f08a00" stroke={BEAK_DARK} strokeWidth="2" strokeLinejoin="round" />;
}

export function GooseBeak({ mood, paint }: { mood: GooseMood; paint: GoosePaint }) {
  const open = mood === "cheer";
  const mouth = mood === "sad" ? "M87 64 Q100 60 113 64" : "M86 62 Q100 69 114 62";
  return (
    <g strokeLinecap="round">
      {open ? <OpenMouth paint={paint} /> : <LowerBeak />}
      <path d="M82 55 Q100 44 118 55 Q116 66 100 71 Q84 66 82 55 Z" fill={paint.beak} stroke={BEAK_DARK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M90 52 Q100 47.5 110 52" fill="none" stroke="#ffd59a" strokeWidth="2" />
      <ellipse cx="95" cy="56" rx="1.5" ry="0.9" fill={BEAK_TIP} />
      <ellipse cx="105" cy="56" rx="1.5" ry="0.9" fill={BEAK_TIP} />
      <path d="M95.5 68.5 Q100 72 104.5 68.5 Q100 70 95.5 68.5 Z" fill={BEAK_TIP} />
      {!open && <path d={mouth} fill="none" stroke={BEAK_DARK} strokeWidth="2" />}
    </g>
  );
}
