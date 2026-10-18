import confetti from "canvas-confetti";

const COLORS = ["#58cc02", "#1cb0f6", "#ffc800", "#ff4b4b", "#ce82ff"];
const BIG_PARTICLES = 180;
const BIG_SPREAD = 100;
const BIG_ORIGIN_Y = 0.55;
const SMALL_PARTICLES = 50;
const SMALL_SPREAD = 60;
const SMALL_ORIGIN_Y = 0.85;

export function celebrate(): void {
  void confetti({
    particleCount: BIG_PARTICLES,
    spread: BIG_SPREAD,
    origin: { y: BIG_ORIGIN_Y },
    colors: COLORS,
    disableForReducedMotion: true,
  });
}

export function smallBurst(): void {
  void confetti({
    particleCount: SMALL_PARTICLES,
    spread: SMALL_SPREAD,
    origin: { y: SMALL_ORIGIN_Y },
    colors: COLORS,
    disableForReducedMotion: true,
  });
}
