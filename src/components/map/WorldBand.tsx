import { BANNER_HEIGHT, type WorldArea } from "@/lib/mapLayout";
import { Atmosphere } from "./scenery/Atmosphere";
import { Props } from "./scenery/Props";
import { Terrain } from "./scenery/Terrain";
import { themeFor, worldName } from "./themes";

interface WorldBandProps {
  area: WorldArea;
  isTop: boolean;
  onShowWords: (week: number) => void;
}

function CloudBank() {
  return (
    <svg className="absolute inset-x-0 -top-5 z-[1] h-10 w-full" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden>
      <path
        d="M0 10 Q4 2 9 8 Q13 0 19 7 Q24 1 29 8 Q34 2 39 9 Q44 1 50 8 Q55 2 60 8 Q65 0 71 7 Q76 2 81 8 Q86 1 91 8 Q96 3 100 9 L100 20 Q50 14 0 20 Z"
        fill="#ffffff"
        opacity="0.92"
      />
    </svg>
  );
}

function Banner({ area, onShowWords }: Omit<WorldBandProps, "isTop">) {
  const { world } = area;
  const theme = themeFor(world.index);
  const subtitle = world.kind === "week" ? `Vecka ${world.week}` : `Mix v.${world.firstWeek}–${world.week}`;
  return (
    <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center" style={{ height: BANNER_HEIGHT }}>
      <div
        className="rounded-3xl border-4 border-b-8 bg-white/95 px-6 py-2 text-center shadow-lg"
        style={{ borderColor: theme.node, borderBottomColor: theme.nodeDark }}
      >
        <p className="text-xs font-black tracking-wide text-wolf uppercase">
          Värld {world.index + 1} · {subtitle}
        </p>
        <p className="text-2xl font-black" style={{ color: theme.nodeDark }}>
          {theme.emoji} {worldName(world.index)}
        </p>
        {world.kind === "week" && (
          <button onClick={() => onShowWords(world.week)} className="text-sm font-bold text-sky">
            📖 Visa glosorna
          </button>
        )}
      </div>
    </div>
  );
}

export function WorldBand({ area, isTop, onShowWords }: WorldBandProps) {
  const theme = themeFor(area.world.index);
  return (
    <section
      className="absolute inset-x-0"
      style={{ top: area.top, height: area.height, background: `linear-gradient(${theme.skyTop}, ${theme.skyBottom})` }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Atmosphere theme={theme} seed={area.world.index} />
        <Terrain theme={theme} />
        <Props theme={theme} seed={area.world.index} />
      </div>
      {!isTop && <CloudBank />}
      <Banner area={area} onShowWords={onShowWords} />
    </section>
  );
}
