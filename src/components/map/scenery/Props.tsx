import type { WorldTheme } from "../themes";
import { scatter } from "./scatter";

const PROP_COUNT = 10;
const PROP_SEED_OFFSET = 101;
const SWAY_EVERY = 3;
const EVERY_OTHER = 2;

export function Props({ theme, seed }: { theme: WorldTheme; seed: number }) {
  const landmarkOnLeft = seed % EVERY_OTHER === 0;
  return (
    <>
      <span
        className={`absolute top-[12%] text-7xl drop-shadow-lg select-none ${landmarkOnLeft ? "left-[2%]" : "right-[2%]"}`}
        aria-hidden
      >
        {theme.landmark}
      </span>
      {scatter(seed + PROP_SEED_OFFSET, { count: PROP_COUNT, edgesOnly: true }).map((spot, index) => (
        <span
          key={index}
          aria-hidden
          className={`absolute origin-bottom text-4xl drop-shadow select-none ${index % SWAY_EVERY === 0 ? "animate-sway" : ""}`}
          style={{
            left: `${spot.x}%`,
            top: `${spot.y}%`,
            scale: `${spot.flip ? -spot.scale : spot.scale} ${spot.scale}`,
            animationDelay: `${spot.delay}s`,
          }}
        >
          {theme.props[index % theme.props.length]}
        </span>
      ))}
    </>
  );
}
