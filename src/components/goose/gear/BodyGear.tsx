import { BODY_PATH } from "../GooseBody";
import { HOODIE_DARK, OUTLINE, STROKE } from "../colors";
import type { GearContext } from "./types";

export function Skateboard() {
  return (
    <g stroke={OUTLINE} strokeLinejoin="round">
      <path d="M68 218 h8 v3 h-8 Z M138 218 h8 v3 h-8 Z" fill="#9aa5b1" strokeWidth="1.5" />
      <circle cx="72" cy="222" r="3.6" fill="#ffd23f" strokeWidth="2" />
      <circle cx="142" cy="222" r="3.6" fill="#ffd23f" strokeWidth="2" />
      <path d="M48 213 C48 209 52 208 56 208 L158 208 C162 208 166 209 166 213 C166 216 162 217 158 217 L56 217 C52 217 48 216 48 213 Z" fill="#ff4b4b" strokeWidth="2.6" />
      <path d="M60 212 H154" stroke="#ffffff" strokeWidth="1.6" opacity="0.6" />
    </g>
  );
}

export function Hood({ paint }: GearContext) {
  return (
    <g stroke={OUTLINE} strokeLinejoin="round">
      <path d="M96 60 C112 54 128 64 131 82 C134 99 124 112 108 115 C104 100 100 82 96 60 Z" fill={paint.hoodie} strokeWidth={STROKE} />
      <path d="M104 70 C114 70 122 80 122 94" fill="none" stroke={HOODIE_DARK} strokeWidth="2" />
    </g>
  );
}

export function HoodieTorso({ paint, prefix }: GearContext) {
  const clip = `${prefix}-torso`;
  return (
    <g>
      <clipPath id={clip}>
        <path d={BODY_PATH} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <rect x="40" y="104" width="124" height="112" fill={paint.hoodie} />
        <path d="M72 108 C86 116 102 116 117 106" fill="none" stroke={HOODIE_DARK} strokeWidth="5" />
        <path d="M70 168 C86 162 112 162 126 168 L122 188 C106 192 86 192 72 186 Z" fill={HOODIE_DARK} opacity="0.55" />
        <path d="M50 196 C80 207 130 207 162 191" fill="none" stroke={HOODIE_DARK} strokeWidth="6" />
      </g>
      <path d={BODY_PATH} fill="none" stroke={OUTLINE} strokeWidth={STROKE} strokeLinejoin="round" />
      <path d="M84 114 L82 134 M94 115 L94 136" stroke="#e8eef6" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="82" cy="135.5" r="1.8" fill="#c9d4e2" />
      <circle cx="94" cy="137.5" r="1.8" fill="#c9d4e2" />
    </g>
  );
}

export function BowTie() {
  return (
    <g stroke={OUTLINE} strokeLinejoin="round" strokeWidth="2.4">
      <path d="M82 114 L71 107 L71 121 Z" fill="#ce82ff" />
      <path d="M82 114 L93 107 L93 121 Z" fill="#ce82ff" />
      <circle cx="82" cy="114" r="3.5" fill="#a560e8" />
    </g>
  );
}

export function GoldChain({ paint }: GearContext) {
  return (
    <g strokeLinecap="round">
      <path d="M79 105 C81 122 91 130 98 130 C105 130 111 120 113 105" fill="none" stroke={paint.gold} strokeWidth="3.8" strokeDasharray="4 2.5" />
      <circle cx="98" cy="133" r="7.5" fill={paint.gold} stroke="#a87400" strokeWidth="2" />
      <text x="98" y="136.5" textAnchor="middle" fontSize="10" fontWeight="900" fill="#a87400">
        G
      </text>
    </g>
  );
}

export function Sunglasses() {
  return (
    <g stroke={OUTLINE} strokeLinejoin="round">
      <path d="M86 33 L111 36" fill="none" strokeWidth="3" strokeLinecap="round" />
      <path d="M53 33 L60 32 C61 39 59 43 56 43 C54 41 53 37 53 33 Z" fill="#111827" strokeWidth="2" />
      <path d="M60 33 L65 32.5" fill="none" strokeWidth="2.5" />
      <path d="M64 31 L90 30 C90 40 86 46 77 46 C68 46 64 40 64 31 Z" fill="#111827" strokeWidth="2.6" />
      <path d="M68 34 L74 34 M80 33.5 L85 33.5" stroke="#ffffff" strokeWidth="1.8" opacity="0.8" strokeLinecap="round" />
    </g>
  );
}
