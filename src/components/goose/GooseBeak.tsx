import { BEAK_DARK, BEAK_TIP } from "./colors";
import type { GoosePaint } from "./GooseDefs";
import type { GooseMood } from "./Goose";

const MOUTHS: Record<Exclude<GooseMood, "cheer">, string> = {
  happy: "M26 56.5 C38 57.5 50 57 62 52.5",
  sad: "M26 56 C38 57 50 59 62 60",
  think: "M26 56.5 C38 57 50 57 62 56",
};

function OpenMouth({ paint }: { paint: GoosePaint }) {
  return (
    <g strokeLinejoin="round">
      <path d="M62 56 L25 55 L29 66 C40 69 52 68 62 63 Z" fill="#6e1b27" stroke={BEAK_DARK} strokeWidth="2" />
      <path d="M57 60 C48 61 40 63 33 64 C41 67 51 66 58 63 Z" fill="#ff7a8a" />
      <path d="M62 62 C52 67 40 69 29 66 C33 73 52 74 63 67 Z" fill={paint.beak} stroke={BEAK_DARK} strokeWidth="2.6" />
    </g>
  );
}

function LowerBeak() {
  return (
    <path
      d="M61 55 C49 58 36 60 27 57.5 C33 63 50 65 62 61 Z"
      fill="#ef8500"
      stroke={BEAK_DARK}
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
  );
}

export function GooseBeak({ mood, paint }: { mood: GooseMood; paint: GoosePaint }) {
  const open = mood === "cheer";
  return (
    <g strokeLinecap="round">
      {open ? <OpenMouth paint={paint} /> : <LowerBeak />}
      <path
        d="M62 42 C49 40 33 42 21 49 C18 51 19 56 25 56 C38 57 51 56 63 56 Z"
        fill={paint.beak}
        stroke={BEAK_DARK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M58 44.5 C47 43.5 36 45 27 48.5" fill="none" stroke="#ffd59a" strokeWidth="2.2" />
      <ellipse cx="46" cy="48" rx="2.4" ry="1.1" fill={BEAK_TIP} />
      <path d="M21 49 C18 51 19 55 24 56 C22.5 53.5 23 51 25.5 49 Z" fill={BEAK_TIP} />
      {!open && <path d={MOUTHS[mood as Exclude<GooseMood, "cheer">]} fill="none" stroke={BEAK_DARK} strokeWidth="2" />}
    </g>
  );
}
