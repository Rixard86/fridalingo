import { OUTLINE, SCARF_DARK, SCARF_YELLOW, STROKE } from "./colors";
import type { GoosePaint } from "./GooseDefs";

export function GooseScarf({ paint }: { paint: GoosePaint }) {
  return (
    <g stroke={OUTLINE} strokeLinejoin="round" strokeLinecap="round">
      <path d="M102 98 C110 108 118 118 120 132 L132 126 C128 112 120 102 110 94 Z" fill={paint.scarf} strokeWidth={STROKE} />
      <path d="M108 106 L120 100 M113 115 L125 110" fill="none" stroke={SCARF_YELLOW} strokeWidth="3" />
      <path d="M120 132 l-1 6 M123.5 130.5 l0 6 M127 129 l1 6 M130.5 127.5 l1.5 5.5" fill="none" stroke={SCARF_YELLOW} strokeWidth="2.2" />
      <path d="M77 90 C86 96 98 97 108 89 L110 102 C99 110 87 110 76 103 Z" fill={paint.scarf} strokeWidth={STROKE} />
      <path d="M81 95 l0.4 9 M86 97 l0.3 9 M92 98 l0 9 M98 97.5 l-0.3 9 M104 95 l-0.4 9" fill="none" stroke={SCARF_DARK} strokeWidth="1.2" opacity="0.6" />
      <path d="M76.5 96 C86 102 99 103 109 95" fill="none" stroke={SCARF_YELLOW} strokeWidth="3" />
      <path d="M76.5 100 C86 106 99 107 109.5 99.5" fill="none" stroke={SCARF_YELLOW} strokeWidth="1.5" />
      <ellipse cx="106" cy="99" rx="5.5" ry="4.5" fill={paint.scarf} strokeWidth="2.5" />
      <path d="M101.5 99 h9" fill="none" stroke={SCARF_YELLOW} strokeWidth="2" />
    </g>
  );
}
