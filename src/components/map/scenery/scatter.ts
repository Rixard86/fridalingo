import { seededRandom } from "@/lib/random";

export interface Spot {
  x: number;
  y: number;
  scale: number;
  delay: number;
  duration: number;
  flip: boolean;
}

interface ScatterRequest {
  count: number;
  edgesOnly: boolean;
}

const SEED_STRIDE = 7919;
const EDGE_WIDTH = 10;
const LEFT_EDGE_START = 1;
const RIGHT_EDGE_START = 88;
const FULL_WIDTH = 100;
const TOP_MARGIN = 6;
const VERTICAL_RANGE = 86;
const MIN_SCALE = 0.7;
const SCALE_RANGE = 0.6;
const MAX_DELAY_SECONDS = 6;
const MIN_DURATION_SECONDS = 4;
const DURATION_RANGE_SECONDS = 5;
const HALF = 0.5;
const EVERY_OTHER = 2;

export function scatter(seed: number, request: ScatterRequest): Spot[] {
  const random = seededRandom((seed + 1) * SEED_STRIDE);
  return Array.from({ length: request.count }, (_, index) => {
    const edgeStart = index % EVERY_OTHER === 0 ? LEFT_EDGE_START : RIGHT_EDGE_START;
    const x = request.edgesOnly ? edgeStart + random() * EDGE_WIDTH : random() * FULL_WIDTH;
    return {
      x,
      y: TOP_MARGIN + ((index + random()) / request.count) * VERTICAL_RANGE,
      scale: MIN_SCALE + random() * SCALE_RANGE,
      delay: random() * MAX_DELAY_SECONDS,
      duration: MIN_DURATION_SECONDS + random() * DURATION_RANGE_SECONDS,
      flip: random() < HALF,
    };
  });
}
