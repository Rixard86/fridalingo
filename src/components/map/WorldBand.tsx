import { BANNER_HEIGHT, type WorldArea } from "@/lib/mapLayout";
import { themeFor } from "./themes";

const DECOR_SPOTS = [
  { side: "left", top: 14 },
  { side: "right", top: 34 },
  { side: "left", top: 56 },
  { side: "right", top: 72 },
];

interface WorldBandProps {
  world: WorldArea;
  onShowWords: () => void;
}

export function WorldBand({ world, onShowWords }: WorldBandProps) {
  const theme = themeFor(world.index);
  return (
    <section
      className="absolute inset-x-0"
      style={{ top: world.top, height: world.height, background: `linear-gradient(${theme.skyTop}, ${theme.skyBottom})` }}
    >
      {theme.decor.map((emoji, index) => {
        const spot = DECOR_SPOTS[index % DECOR_SPOTS.length];
        return (
          <span key={emoji} className="absolute text-4xl opacity-80 select-none" style={{ [spot.side]: "3%", top: `${spot.top}%` }}>
            {emoji}
          </span>
        );
      })}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center" style={{ height: BANNER_HEIGHT }}>
        <div className="rounded-3xl border-2 border-b-4 border-white/80 bg-white/90 px-5 py-2 text-center shadow-sm">
          <p className="text-xs font-black tracking-wide text-wolf uppercase">
            Värld {world.index + 1} · Vecka {world.week}
          </p>
          <p className="text-xl font-black">
            {theme.emoji} {theme.name}
          </p>
          <button onClick={onShowWords} className="text-sm font-bold text-sky">
            📖 Visa glosorna
          </button>
        </div>
      </div>
    </section>
  );
}
