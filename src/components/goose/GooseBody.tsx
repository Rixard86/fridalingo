import { BEAK, BEAK_DARK, BEAK_TIP, FEATHER_LINE, FINE_STROKE, HOODIE_DARK, OUTLINE, SHADE, STROKE } from "./colors";
import type { GoosePaint } from "./GooseDefs";

export const BODY_PATH =
  "M104 58 C103 82 110 100 124 110 C140 119 160 117 180 113 C177 125 171 133 166 140 C177 162 168 193 132 202 C104 210 70 203 60 177 C52 155 60 133 74 119 C82 109 82 88 80 64 Z";

interface FootPlacement {
  x: number;
  opacity: number;
}

function Foot({ paint, placement }: { paint: GoosePaint; placement: FootPlacement }) {
  return (
    <g transform={`translate(${placement.x} 0)`} stroke={BEAK_DARK} strokeLinejoin="round" strokeLinecap="round" opacity={placement.opacity}>
      <path d="M0 196 L1 208" fill="none" strokeWidth="6" stroke={BEAK_DARK} />
      <path d="M0 196 L1 208" fill="none" strokeWidth="3.5" stroke={BEAK} />
      <path d="M3 206 L-21 211 C-19 214 -15 214 -13 213 L-17 217 C-11 218 -7 217 -5 215 L-6 219 C0 218 4 214 5 210 Z" fill={paint.foot} strokeWidth="2.8" />
      <path d="M1 208 L-15 213 M2 209 L-7 216" fill="none" stroke={BEAK_TIP} strokeWidth={FINE_STROKE} opacity="0.7" />
      <g fill={BEAK_TIP} stroke="none">
        <circle cx="-20.5" cy="212" r="1.3" />
        <circle cx="-16" cy="216.5" r="1.3" />
        <circle cx="-5.5" cy="218" r="1.3" />
      </g>
    </g>
  );
}

const BACK_FOOT = { x: 126, opacity: 0.85 };
const FRONT_FOOT = { x: 100, opacity: 1 };

export function GooseShadow({ paint }: { paint: GoosePaint }) {
  return <ellipse cx="108" cy="216" rx="56" ry="6" fill={paint.shadow} />;
}

export function GooseLegs({ paint }: { paint: GoosePaint }) {
  return (
    <g>
      <Foot paint={paint} placement={BACK_FOOT} />
      <Foot paint={paint} placement={FRONT_FOOT} />
    </g>
  );
}

function FeatherDetails() {
  return (
    <g fill="none" stroke={FEATHER_LINE} strokeWidth={FINE_STROKE} strokeLinecap="round">
      <path d="M66 146 q4 4 8 0 M72 156 q4 4 8 0 M64 164 q4 4 8 0 M70 174 q4 4 8 0 M78 166 q4 4 8 0" />
      <path d="M168 120 L182 114 M165 127 L179 123 M162 133 L174 131" />
      <path d="M86 70 C86 82 86 94 82 104" stroke={SHADE} strokeWidth="3" />
      <path d="M120 112 C138 120 158 120 176 116" stroke={SHADE} strokeWidth="4" />
    </g>
  );
}

export function GooseBody({ paint, hoodie }: { paint: GoosePaint; hoodie: boolean }) {
  return (
    <g>
      <path d={BODY_PATH} fill={paint.body} stroke={OUTLINE} strokeWidth={STROKE} strokeLinejoin="round" />
      {!hoodie && <ellipse cx="108" cy="172" rx="36" ry="22" fill="#ffffff" opacity="0.55" />}
      {!hoodie && <FeatherDetails />}
    </g>
  );
}

function Primaries({ paint, hoodie }: { paint: GoosePaint; hoodie: boolean }) {
  const fill = hoodie ? paint.hoodie : paint.wing;
  return (
    <g fill={fill} stroke={OUTLINE} strokeWidth="2.2" strokeLinejoin="round">
      <path d="M140 176 C154 184 170 180 180 166 C170 172 158 173 146 170 Z" />
      <path d="M132 181 C146 192 164 190 174 178 C162 182 150 182 138 178 Z" />
      <path d="M124 184 C136 196 154 196 164 186 C152 188 140 187 130 182 Z" />
    </g>
  );
}

export function GooseWing({ paint, hoodie, raised }: { paint: GoosePaint; hoodie: boolean; raised: boolean }) {
  return (
    <g transform={raised ? "rotate(-38 100 132)" : undefined}>
      <Primaries paint={paint} hoodie={hoodie} />
      <path
        d="M96 126 C118 112 152 120 168 146 C176 160 168 180 150 184 C128 188 106 176 97 154 C92 142 92 132 96 126 Z"
        fill={hoodie ? paint.hoodie : paint.wing}
        stroke={OUTLINE}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <path
        d="M106 134 C122 128 142 132 154 146 M103 146 C118 140 136 144 148 158 M106 160 C118 156 132 160 141 171"
        fill="none"
        stroke={hoodie ? HOODIE_DARK : FEATHER_LINE}
        strokeWidth={FINE_STROKE}
        strokeLinecap="round"
      />
    </g>
  );
}
