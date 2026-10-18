import { useId } from "react";
import { FEATHER_LINE, FINE_STROKE, OUTLINE, STROKE } from "./colors";
import { GooseBeak } from "./GooseBeak";
import { GooseBody, GooseLegs, GooseShadow } from "./GooseBody";
import { GooseDefs, paintFor, type GoosePaint } from "./GooseDefs";
import { GooseEyes } from "./GooseEyes";
import { GooseOutfit, HAT_OUTFITS } from "./GooseOutfit";
import { GooseScarf } from "./GooseScarf";

export type GooseMood = "happy" | "cheer" | "sad" | "think";

interface GooseProps {
  mood?: GooseMood;
  outfit?: string | null;
  className?: string;
}

interface HeadProps {
  mood: GooseMood;
  outfit: string | null;
  paint: GoosePaint;
}

const NON_ALPHANUMERIC = /[^a-zA-Z0-9]/g;

function Tuft({ paint }: { paint: GoosePaint }) {
  return (
    <g fill={paint.head} stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round">
      <path d="M95 19 C90 6 97 -1 102 5 C103 -2 111 -2 112 6 C116 2 122 6 116 18 Z" />
      <path d="M101 7 C101 11 100 14 100 17 M109 7 C108 11 107 14 106 17" fill="none" stroke={FEATHER_LINE} strokeWidth={FINE_STROKE} />
    </g>
  );
}

function GooseHead({ mood, outfit, paint }: HeadProps) {
  const showTuft = !outfit || !HAT_OUTFITS.includes(outfit);
  return (
    <g>
      {showTuft && <Tuft paint={paint} />}
      <circle cx="100" cy="46" r="30" fill={paint.head} stroke={OUTLINE} strokeWidth={STROKE} />
      <ellipse cx="89" cy="29" rx="9" ry="4.5" fill="#ffffff" opacity="0.85" transform="rotate(-20 89 29)" />
      <ellipse cx="80" cy="58" rx="6.5" ry="4.5" fill={paint.cheek} />
      <ellipse cx="120" cy="58" rx="6.5" ry="4.5" fill={paint.cheek} />
      <GooseEyes mood={mood} paint={paint} />
      <GooseBeak mood={mood} paint={paint} />
    </g>
  );
}

export function Goose({ mood = "happy", outfit = null, className = "" }: GooseProps) {
  const prefix = `goose${useId().replace(NON_ALPHANUMERIC, "")}`;
  const paint = paintFor(prefix);
  return (
    <svg viewBox="0 -8 200 228" className={className} role="img" aria-label="Gåsen">
      <GooseDefs prefix={prefix} />
      <GooseShadow paint={paint} />
      <GooseLegs paint={paint} />
      <GooseBody paint={paint} raised={mood === "cheer"} />
      <GooseScarf paint={paint} />
      <GooseHead mood={mood} outfit={outfit} paint={paint} />
      <GooseOutfit outfit={outfit} />
    </svg>
  );
}
