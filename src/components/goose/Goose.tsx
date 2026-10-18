import { GooseOutfit, HAT_OUTFITS } from "./GooseOutfit";
import { BEAK, BEAK_DARK, EYE, FEATHER, OUTLINE, SHADE, STROKE } from "./colors";

export type GooseMood = "happy" | "cheer" | "sad" | "think";

interface GooseProps {
  mood?: GooseMood;
  outfit?: string | null;
  className?: string;
}

const LEFT_WING = "M48 152 C30 162 32 192 56 198 C64 184 66 164 60 148 Z";
const RIGHT_WING = "M152 152 C170 162 168 192 144 198 C136 184 134 164 140 148 Z";

function GooseFeet() {
  return (
    <g fill={BEAK} stroke={BEAK_DARK} strokeWidth={STROKE} strokeLinejoin="round">
      <path d="M80 200 L64 214 L76 212 L82 217 L88 212 L98 214 L90 200 Z" />
      <path d="M110 200 L102 214 L112 212 L118 217 L124 212 L136 214 L120 200 Z" />
    </g>
  );
}

function GooseBody({ mood }: { mood: GooseMood }) {
  const raised = mood === "cheer";
  return (
    <g stroke={OUTLINE} strokeWidth={STROKE} strokeLinejoin="round">
      <path
        d="M86 60 L86 118 C86 132 40 134 40 168 C40 198 70 208 100 208 C130 208 160 198 160 168 C160 134 114 132 114 118 L114 60 Z"
        fill={FEATHER}
      />
      <path d="M72 184 C86 196 114 196 128 184" fill="none" stroke={SHADE} strokeWidth="5" strokeLinecap="round" />
      <path d={LEFT_WING} fill={SHADE} transform={raised ? "rotate(55 60 150)" : undefined} />
      <path d={RIGHT_WING} fill={SHADE} transform={raised ? "rotate(-55 140 150)" : undefined} />
    </g>
  );
}

function GooseScarf() {
  return (
    <g stroke={OUTLINE} strokeWidth={STROKE} strokeLinejoin="round">
      <path d="M104 100 L112 130 L125 125 L116 96 Z" fill="#006aa7" />
      <path d="M80 86 Q100 98 120 86 L122 100 Q100 112 78 100 Z" fill="#006aa7" />
      <path d="M79 93 Q100 105 121 93" fill="none" stroke="#fecc02" strokeWidth="4" />
      <path d="M109 109 L118 126" fill="none" stroke="#fecc02" strokeWidth="4" />
    </g>
  );
}

function GooseEyes({ mood }: { mood: GooseMood }) {
  if (mood === "cheer") {
    return (
      <g fill="none" stroke={EYE} strokeWidth="4.5" strokeLinecap="round">
        <path d="M82 47 Q88 37 94 47" />
        <path d="M106 47 Q112 37 118 47" />
      </g>
    );
  }
  const lookUp = mood === "think";
  const eyeY = mood === "sad" ? "47" : "45";
  return (
    <g>
      <ellipse cx="88" cy={eyeY} rx="6" ry="8" fill={EYE} />
      <ellipse cx="112" cy={eyeY} rx="6" ry="8" fill={EYE} />
      <circle cx={lookUp ? "91" : "90"} cy={lookUp ? "39" : "41"} r="2.4" fill="#fff" />
      <circle cx={lookUp ? "115" : "114"} cy={lookUp ? "39" : "41"} r="2.4" fill="#fff" />
      {mood === "sad" && (
        <g stroke={EYE} strokeWidth="3.5" strokeLinecap="round">
          <path d="M80 35 L94 31" />
          <path d="M120 35 L106 31" />
        </g>
      )}
      {lookUp && <path d="M106 31 Q113 26 120 31" stroke={EYE} strokeWidth="3.5" strokeLinecap="round" fill="none" />}
    </g>
  );
}

function GooseBeak({ mood }: { mood: GooseMood }) {
  const open = mood === "cheer";
  return (
    <g stroke={BEAK_DARK} strokeWidth={STROKE} strokeLinejoin="round" strokeLinecap="round">
      {open && <path d="M88 62 Q100 86 112 62 Q100 68 88 62 Z" fill={BEAK} />}
      <path d="M83 55 Q100 46 117 55 Q115 70 100 75 Q85 70 83 55 Z" fill={BEAK} />
      {!open && <path d={mood === "sad" ? "M90 65 Q100 61 110 65" : "M89 62 Q100 68 111 62"} fill="none" />}
    </g>
  );
}

function GooseHead({ mood, outfit }: { mood: GooseMood; outfit: string | null }) {
  const showTuft = !outfit || !HAT_OUTFITS.includes(outfit);
  return (
    <g>
      {showTuft && (
        <path d="M94 20 C90 4 104 0 105 10 C109 2 120 6 112 20 Z" fill={FEATHER} stroke={OUTLINE} strokeWidth={STROKE} strokeLinejoin="round" />
      )}
      <circle cx="100" cy="46" r="30" fill={FEATHER} stroke={OUTLINE} strokeWidth={STROKE} />
      <ellipse cx="78" cy="57" rx="6" ry="3.5" fill="#ffb3c1" opacity="0.8" />
      <ellipse cx="122" cy="57" rx="6" ry="3.5" fill="#ffb3c1" opacity="0.8" />
      <GooseEyes mood={mood} />
      <GooseBeak mood={mood} />
    </g>
  );
}

export function Goose({ mood = "happy", outfit = null, className = "" }: GooseProps) {
  return (
    <svg viewBox="0 -8 200 228" className={className} role="img" aria-label="Gåsen">
      <GooseFeet />
      <GooseBody mood={mood} />
      <GooseScarf />
      <GooseHead mood={mood} outfit={outfit} />
      <GooseOutfit outfit={outfit} />
    </svg>
  );
}
