import { BEAK_DARK, BEAK_TIP, FEATHER_LINE, FINE_STROKE, OUTLINE, SHADE, STROKE } from "./colors";
import type { GoosePaint } from "./GooseDefs";

const BODY = "M86 60 L86 118 C86 132 40 134 40 168 C40 198 70 208 100 208 C130 208 160 198 160 168 C160 134 114 132 114 118 L114 60 Z";
const MIRROR = "translate(200 0) scale(-1 1)";

function Foot({ paint }: { paint: GoosePaint }) {
  return (
    <g stroke={BEAK_DARK} strokeLinejoin="round" strokeLinecap="round">
      <path d="M84 196 L84 206 L90 206 L90 196 Z" fill={paint.foot} strokeWidth="2.5" />
      <path d="M82 203 L64 213 Q70 214 75 212 L80 217 Q84 214 87 212 L94 216 Q96 212 98 213 L92 203 Z" fill={paint.foot} strokeWidth={STROKE} />
      <path d="M85 206 L74 211 M87 206 L84 214 M89 206 L94 212" fill="none" stroke={BEAK_TIP} strokeWidth={FINE_STROKE} opacity="0.7" />
      <g fill={BEAK_TIP} stroke="none">
        <circle cx="65" cy="213" r="1.4" />
        <circle cx="80" cy="216.5" r="1.4" />
        <circle cx="96.5" cy="214" r="1.4" />
      </g>
    </g>
  );
}

function Tail({ paint }: { paint: GoosePaint }) {
  return (
    <g fill={paint.wing} stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round">
      <path d="M46 176 C30 178 22 190 28 199 C34 194 42 192 52 192 Z" />
      <path d="M40 182 C32 186 30 192 32 196" fill="none" stroke={FEATHER_LINE} strokeWidth={FINE_STROKE} />
    </g>
  );
}

function Wing({ paint, raised }: { paint: GoosePaint; raised: boolean }) {
  return (
    <g transform={raised ? "rotate(55 60 150)" : undefined} stroke={OUTLINE} strokeLinejoin="round">
      <path d="M50 146 C30 156 30 190 52 201 C58 196 62 188 63 178 C65 166 65 154 60 144 Z" fill={paint.wing} strokeWidth={STROKE} />
      <g fill={paint.wing} strokeWidth="1.8">
        <path d="M50 160 C40 168 35 180 37 192 C43 186 48 177 54 166 Z" />
        <path d="M55 166 C47 176 44 186 47 198 C52 191 56 182 59 172 Z" />
        <path d="M59 172 C54 182 53 191 56 199 C60 192 62 184 62 176 Z" />
      </g>
      <path d="M48 154 Q55 150 61 156 M45 160 Q53 156 61 163" fill="none" stroke={FEATHER_LINE} strokeWidth={FINE_STROKE} />
    </g>
  );
}

function ChestFeathers() {
  return (
    <g fill="none" stroke={FEATHER_LINE} strokeWidth={FINE_STROKE} strokeLinecap="round">
      <path d="M84 142 q4 4 8 0 M94 142 q4 4 8 0 M104 142 q4 4 8 0" />
      <path d="M79 152 q4 4 8 0 M89 152 q4 4 8 0 M99 152 q4 4 8 0 M109 152 q4 4 8 0" />
      <path d="M86 162 q4 4 8 0 M96 162 q4 4 8 0 M106 162 q4 4 8 0" />
      <path d="M90 64 L90 82 M110 64 L110 82" stroke={SHADE} strokeWidth="2.5" />
    </g>
  );
}

export function GooseShadow({ paint }: { paint: GoosePaint }) {
  return <ellipse cx="100" cy="214" rx="56" ry="7" fill={paint.shadow} />;
}

export function GooseLegs({ paint }: { paint: GoosePaint }) {
  return (
    <g>
      <Foot paint={paint} />
      <g transform={MIRROR}>
        <Foot paint={paint} />
      </g>
    </g>
  );
}

export function GooseBody({ paint, raised }: { paint: GoosePaint; raised: boolean }) {
  return (
    <g>
      <Tail paint={paint} />
      <g transform={MIRROR}>
        <Tail paint={paint} />
      </g>
      <path d={BODY} fill={paint.body} stroke={OUTLINE} strokeWidth={STROKE} strokeLinejoin="round" />
      <ellipse cx="100" cy="170" rx="32" ry="26" fill="#ffffff" opacity="0.6" />
      <path d="M48 160 C45 178 52 192 68 201" fill="none" stroke={SHADE} strokeWidth="5" strokeLinecap="round" />
      <path d="M72 188 C86 198 114 198 128 188" fill="none" stroke={SHADE} strokeWidth="4" strokeLinecap="round" />
      <ChestFeathers />
      <Wing paint={paint} raised={raised} />
      <g transform={MIRROR}>
        <Wing paint={paint} raised={raised} />
      </g>
    </g>
  );
}
