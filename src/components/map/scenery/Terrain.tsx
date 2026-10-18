import type { Ground, WorldTheme } from "../themes";

const WAVE_SEGMENTS = 10;
const EVERY_OTHER = 2;
const WAVE_LAYERS = [
  { base: 44, amplitude: 3 },
  { base: 60, amplitude: 4 },
  { base: 76, amplitude: 3 },
];
const VIEWBOX_WIDTH = 100;
const WAVE_WIDTH = VIEWBOX_WIDTH / WAVE_SEGMENTS;
const HALF_WAVE = WAVE_WIDTH / EVERY_OTHER;

const HILLS = [
  "M0 42 C15 26 30 28 45 40 S75 20 100 36 L100 100 L0 100 Z",
  "M0 58 C20 44 38 50 55 58 S85 46 100 54 L100 100 L0 100 Z",
  "M0 76 C18 66 40 72 60 78 S88 68 100 74 L100 100 L0 100 Z",
];
const DUNES = [
  "M0 48 C25 30 45 34 62 46 S90 40 100 44 L100 100 L0 100 Z",
  "M0 64 C30 52 52 58 70 66 S92 58 100 62 L100 100 L0 100 Z",
  "M0 80 C22 72 48 76 66 82 S90 74 100 78 L100 100 L0 100 Z",
];
const MOUNTAINS = [
  "M0 55 L10 32 L20 45 L32 14 L46 48 L58 24 L70 46 L84 18 L100 42 L100 100 L0 100 Z",
  "M0 68 L14 46 L26 60 L40 38 L54 62 L68 44 L82 60 L94 46 L100 52 L100 100 L0 100 Z",
  "M0 82 C20 76 40 80 60 84 S90 78 100 80 L100 100 L0 100 Z",
];
const SNOW_CAPS = "M29 20 L32 14 L35 20 L33 19 L32 21 L30.5 19 Z M55 30 L58 24 L61 30 L59 29 L58 31 L56.5 29 Z M81 24 L84 18 L87 24 L85 23 L84 25 L82.5 23 Z M8 36 L10 32 L12 36 Z";
const VOLCANO = "M18 100 L41 30 L50 34 L59 30 L82 100 Z";
const LAVA = "M41 30 L45 44 L50 36 L55 46 L59 30 L50 34 Z";
const PLANET = ["M0 66 Q50 44 100 66 L100 100 L0 100 Z", "M0 80 Q50 64 100 80 L100 100 L0 100 Z"];

function wavePath({ base: baseY, amplitude }: { base: number; amplitude: number }): string {
  const crests = Array.from({ length: WAVE_SEGMENTS }, (_, index) => {
    const startX = index * WAVE_WIDTH;
    const peakY = index % EVERY_OTHER === 0 ? baseY - amplitude : baseY + amplitude;
    return `Q ${startX + HALF_WAVE} ${peakY} ${startX + WAVE_WIDTH} ${baseY}`;
  });
  return `M0 ${baseY} ${crests.join(" ")} L100 100 L0 100 Z`;
}

const SEA = WAVE_LAYERS.map(wavePath);

const LAYER_PATHS: Record<Ground, string[]> = {
  hills: HILLS,
  sea: SEA,
  snow: MOUNTAINS,
  desert: DUNES,
  volcano: HILLS,
  space: PLANET,
};

function Extras({ ground }: { ground: Ground }) {
  if (ground === "snow") return <path d={SNOW_CAPS} fill="#ffffff" />;
  if (ground === "volcano") {
    return (
      <g>
        <path d={VOLCANO} fill="#6b5a54" />
        <path d={LAVA} fill="#ff7a1a" />
        <ellipse cx="50" cy="31" rx="12" ry="4" fill="#ffb347" opacity="0.6" />
      </g>
    );
  }
  if (ground === "space") {
    return (
      <g fill="#2e2470" opacity="0.7">
        <ellipse cx="22" cy="78" rx="5" ry="2" />
        <ellipse cx="64" cy="72" rx="7" ry="2.5" />
        <ellipse cx="86" cy="88" rx="4" ry="1.5" />
      </g>
    );
  }
  return null;
}

export function Terrain({ theme }: { theme: WorldTheme }) {
  const [back, middle, front] = LAYER_PATHS[theme.ground];
  return (
    <svg
      className="absolute inset-x-0 bottom-0 h-[58%] w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d={back} fill={theme.layers[0]} />
      {theme.ground === "volcano" && <Extras ground="volcano" />}
      {theme.ground === "snow" && <Extras ground="snow" />}
      <path d={middle} fill={theme.layers[1]} />
      {front && <path d={front} fill={theme.layers[2]} />}
      {theme.ground === "space" && <Extras ground="space" />}
    </svg>
  );
}
