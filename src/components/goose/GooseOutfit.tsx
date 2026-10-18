import { OUTLINE, STROKE } from "./colors";

export const HAT_OUTFITS = ["keps", "partyhatt", "krona"];

function Cap() {
  return (
    <g stroke={OUTLINE} strokeWidth={STROKE} strokeLinejoin="round">
      <path d="M70 30 Q100 24 146 32 Q150 39 140 39 Q100 32 70 35 Z" fill="#ea2b2b" />
      <path d="M72 30 C72 4 128 4 128 30 Z" fill="#ff4b4b" />
      <circle cx="100" cy="8" r="3.5" fill="#ea2b2b" />
    </g>
  );
}

function Sunglasses() {
  return (
    <g stroke={OUTLINE} strokeWidth="3">
      <path d="M68 43 L75 43 M125 43 L132 43 M98 44 L102 44" fill="none" />
      <rect x="75" y="33" width="23" height="21" rx="8" fill="#1f2937" />
      <rect x="102" y="33" width="23" height="21" rx="8" fill="#1f2937" />
      <path d="M80 38 L87 38 M107 38 L114 38" stroke="#ffffff" strokeLinecap="round" />
    </g>
  );
}

function BowTie() {
  return (
    <g stroke={OUTLINE} strokeWidth={STROKE} strokeLinejoin="round">
      <path d="M100 124 L84 114 L84 134 Z" fill="#ce82ff" />
      <path d="M100 124 L116 114 L116 134 Z" fill="#ce82ff" />
      <circle cx="100" cy="124" r="5" fill="#a560e8" />
    </g>
  );
}

function PartyHat() {
  return (
    <g stroke={OUTLINE} strokeWidth={STROKE} strokeLinejoin="round" transform="rotate(12 100 22)">
      <path d="M100 -2 L83 22 L117 22 Z" fill="#1cb0f6" />
      <path d="M93 8 L107 8 M89 15 L111 15" stroke="#ffc800" strokeWidth="4" />
      <circle cx="100" cy="-2" r="5" fill="#ffc800" />
    </g>
  );
}

function Crown() {
  return (
    <g stroke="#b8860b" strokeWidth={STROKE} strokeLinejoin="round">
      <path d="M78 24 L78 4 L89 14 L100 -3 L111 14 L122 4 L122 24 Z" fill="#ffc800" />
      <circle cx="89" cy="19" r="3" fill="#ff4b4b" />
      <circle cx="100" cy="16" r="3.5" fill="#1cb0f6" />
      <circle cx="111" cy="19" r="3" fill="#58cc02" />
    </g>
  );
}

const OUTFIT_DRAWINGS: Record<string, () => React.JSX.Element> = {
  keps: Cap,
  solglasogon: Sunglasses,
  fluga: BowTie,
  partyhatt: PartyHat,
  krona: Crown,
};

export function GooseOutfit({ outfit }: { outfit: string | null }) {
  const Drawing = outfit ? OUTFIT_DRAWINGS[outfit] : undefined;
  return Drawing ? <Drawing /> : null;
}
