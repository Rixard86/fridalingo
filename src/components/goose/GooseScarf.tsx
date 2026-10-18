import { OUTLINE, SCARF_DARK, SCARF_YELLOW, STROKE } from "./colors";
import type { GoosePaint } from "./GooseDefs";

export function GooseScarf({ paint }: { paint: GoosePaint }) {
  return (
    <g stroke={OUTLINE} strokeLinejoin="round" strokeLinecap="round">
      <path d="M104 100 L112 130 L125 125 L116 96 Z" fill={paint.scarf} strokeWidth={STROKE} />
      <path d="M106.5 109 L118.5 104.5 M109 118 L121 113.5" fill="none" stroke={SCARF_YELLOW} strokeWidth="3" />
      <path d="M113 130 l-1.5 6 M116 129 l-1 6 M119 128 l-0.5 6 M122.5 126.5 l0 6" fill="none" stroke={SCARF_YELLOW} strokeWidth="2.2" />
      <path d="M80 86 Q100 98 120 86 L122 100 Q100 112 78 100 Z" fill={paint.scarf} strokeWidth={STROKE} />
      <path
        d="M84 91 l0.5 9 M89 93 l0.5 9 M94 94 l0.3 9.5 M100 94.5 v9.5 M106 94 l-0.3 9.5 M111 93 l-0.5 9 M116 91 l-0.5 9"
        fill="none"
        stroke={SCARF_DARK}
        strokeWidth="1.2"
        opacity="0.6"
      />
      <path d="M79 92 Q100 103.5 121 92" fill="none" stroke={SCARF_YELLOW} strokeWidth="3" />
      <path d="M78.5 96.5 Q100 108 121.5 96.5" fill="none" stroke={SCARF_YELLOW} strokeWidth="1.6" />
      <ellipse cx="111" cy="101" rx="5.5" ry="4.5" fill={paint.scarf} strokeWidth="2.5" />
      <path d="M106.5 101 h9" fill="none" stroke={SCARF_YELLOW} strokeWidth="2" />
    </g>
  );
}
