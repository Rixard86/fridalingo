import { OUTLINE, STROKE } from "../colors";
import type { GearContext } from "./types";

export function BackwardsCap() {
  return (
    <g stroke={OUTLINE} strokeLinejoin="round">
      <path d="M100 24 C112 21 126 23 132 28 C127 32 115 32 104 31 Z" fill="#c92a2f" strokeWidth="2.6" />
      <path d="M57 32 C57 13 74 5 88 6 C102 7 111 17 111 30 C94 26 73 26 57 32 Z" fill="#e8484d" strokeWidth={STROKE} />
      <path d="M84 7 C80 16 78 24 78 28 M96 9 C96 16 95 24 94 28" fill="none" stroke="#b5262b" strokeWidth="1.6" />
      <path d="M62 22 C68 14 76 10 82 9" fill="none" stroke="#ff8a8e" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="87" cy="6.5" r="2.6" fill="#c92a2f" strokeWidth="1.8" />
    </g>
  );
}

export function NinjaBand() {
  return (
    <g stroke={OUTLINE} strokeLinejoin="round">
      <path d="M110 31 C120 26 128 22 137 22 C131 27 124 31 117 34 Z" fill="#c62828" strokeWidth="2.2" />
      <path d="M110 35 C120 38 128 42 134 49 C126 47 118 43 112 39 Z" fill="#c62828" strokeWidth="2.2" />
      <path d="M56 31 C70 26 96 25 109 30 L109 37 C96 32 70 33 56 38 Z" fill="#e53935" strokeWidth="2.6" />
      <ellipse cx="110" cy="33.5" rx="3.5" ry="4" fill="#c62828" strokeWidth="2" />
    </g>
  );
}

export function PartyHat() {
  return (
    <g stroke={OUTLINE} strokeLinejoin="round" transform="rotate(-12 83 16)">
      <path d="M83 -8 L69 17 L97 17 Z" fill="#1cb0f6" strokeWidth={STROKE} />
      <path d="M78 2 L88 2 M74 10 L92 10" stroke="#ffc800" strokeWidth="4" />
      <circle cx="83" cy="-8" r="4.5" fill="#ffc800" strokeWidth="2" />
    </g>
  );
}

export function Crown({ paint }: GearContext) {
  return (
    <g stroke="#a87400" strokeWidth={STROKE} strokeLinejoin="round">
      <path d="M64 18 L64 0 L73 9 L83 -6 L93 9 L102 0 L102 18 Z" fill={paint.gold} />
      <circle cx="73" cy="13" r="2.8" fill="#ff4b4b" strokeWidth="1.5" />
      <circle cx="83" cy="11" r="3.2" fill="#1cb0f6" strokeWidth="1.5" />
      <circle cx="93" cy="13" r="2.8" fill="#58cc02" strokeWidth="1.5" />
    </g>
  );
}

export function Hat() {
  return (
    <g stroke={OUTLINE} strokeLinejoin="round">
      <path d="M52 27 C58 19 110 15 120 24 C116 31 60 34 52 27 Z" fill="#9a6a34" strokeWidth={STROKE} />
      <path d="M62 24 C61 6 70 0 86 0 C102 0 108 8 108 22 C94 19 76 19 62 24 Z" fill="#b8833f" strokeWidth={STROKE} />
      <path d="M62 21 C76 16 94 16 108 19 L108 24 C94 21 76 21 62 25 Z" fill="#4a3420" strokeWidth="1.6" />
      <path d="M80 3 C84 8 88 8 92 3" fill="none" stroke="#7c5426" strokeWidth="1.8" />
    </g>
  );
}

export function KnightHelmet({ paint }: GearContext) {
  return (
    <g stroke={OUTLINE} strokeLinejoin="round">
      <path d="M96 12 C98 -6 116 -12 126 -2 C114 -2 106 4 102 14 Z" fill="#ff4b4b" strokeWidth="2.5" />
      <path d="M54 46 C52 22 68 10 84 10 C102 10 112 24 112 42 L112 64 C100 72 74 74 60 66 C56 60 54 54 54 46 Z" fill={paint.steel} strokeWidth={STROKE} />
      <path d="M58 36 L86 34 M58 42 L86 40" stroke="#1f2937" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M84 10 C86 30 86 52 84 70" fill="none" stroke="#6f7b88" strokeWidth="2" />
      <path d="M64 20 C70 14 78 12 84 12" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.8" strokeLinecap="round" />
      <g fill="#6f7b88" stroke="none">
        <circle cx="98" cy="52" r="1.6" />
        <circle cx="104" cy="44" r="1.6" />
        <circle cx="104" cy="60" r="1.6" />
      </g>
    </g>
  );
}
