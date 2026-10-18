import type { CSSProperties } from "react";
import type { Particle, WorldTheme } from "../themes";
import { scatter, type Spot } from "./scatter";

const PARTICLE_COUNT = 16;
const STAR_COUNT = 34;
const CLOUDS = [
  { delay: 0, top: 6 },
  { delay: 14, top: 20 },
  { delay: 27, top: 34 },
];

const PARTICLE_LOOKS: Record<Particle, { className: string; content: string }> = {
  sparkle: { className: "text-white text-lg animate-twinkle", content: "✦" },
  firefly: { className: "h-2 w-2 rounded-full bg-yellow-200 shadow-[0_0_10px_4px_rgba(253,224,71,0.8)] animate-drift", content: "" },
  bubble: { className: "h-3 w-3 rounded-full border-2 border-white/80 bg-white/20 animate-rise", content: "" },
  snow: { className: "h-2 w-2 rounded-full bg-white shadow animate-fall", content: "" },
  sand: { className: "h-1.5 w-1.5 rounded-full bg-amber-500/60 animate-drift", content: "" },
  ember: { className: "h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_3px_rgba(255,120,30,0.7)] animate-rise", content: "" },
  star: { className: "text-white text-xs animate-twinkle", content: "★" },
};

function spotStyle(spot: Spot): CSSProperties {
  return {
    left: `${spot.x}%`,
    top: `${spot.y}%`,
    animationDelay: `${spot.delay}s`,
    animationDuration: `${spot.duration}s`,
    scale: `${spot.scale}`,
  };
}

function Particles({ theme, seed }: { theme: WorldTheme; seed: number }) {
  const look = PARTICLE_LOOKS[theme.particle];
  const count = theme.particle === "star" ? STAR_COUNT : PARTICLE_COUNT;
  return (
    <>
      {scatter(seed, { count, edgesOnly: false }).map((spot, index) => (
        <span key={index} className={`absolute ${look.className}`} style={spotStyle(spot)}>
          {look.content}
        </span>
      ))}
    </>
  );
}

function Celestial({ night }: { night: boolean }) {
  if (night) {
    return (
      <div className="absolute top-[5%] left-[8%] h-16 w-16 rounded-full bg-[#fdf6d8] shadow-[0_0_40px_12px_rgba(253,246,216,0.35)]">
        <span className="absolute top-3 left-4 h-3 w-3 rounded-full bg-[#e8dfb8]" />
        <span className="absolute top-8 left-9 h-4 w-4 rounded-full bg-[#e8dfb8]" />
      </div>
    );
  }
  return (
    <div className="absolute top-[4%] right-[6%] h-20 w-20">
      <div className="absolute inset-0 animate-spin-slow rounded-full bg-[repeating-conic-gradient(rgba(255,214,0,0.45)_0deg_12deg,transparent_12deg_30deg)] [mask-image:radial-gradient(circle,transparent_35%,black_36%)]" />
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-200 to-amber-400 shadow-[0_0_30px_8px_rgba(255,200,0,0.45)]" />
    </div>
  );
}

function Clouds() {
  return (
    <>
      {CLOUDS.map(({ delay, top }) => (
        <div
          key={delay}
          className="absolute -left-32 h-10 w-28 animate-cloud rounded-full bg-white/80 shadow-[30px_-12px_0_-2px_rgba(255,255,255,0.8),-24px_-6px_0_-6px_rgba(255,255,255,0.8)]"
          style={{ top: `${top}%`, animationDelay: `-${delay}s` }}
        />
      ))}
    </>
  );
}

export function Atmosphere({ theme, seed }: { theme: WorldTheme; seed: number }) {
  return (
    <>
      <Celestial night={theme.night} />
      {!theme.night && <Clouds />}
      <Particles theme={theme} seed={seed} />
    </>
  );
}
