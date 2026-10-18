export type RandomSource = () => number;

const LCG_MULTIPLIER = 16807;
const LCG_MODULUS = 2147483647;

export function seededRandom(seed: number): RandomSource {
  let state = Math.max(1, Math.floor(seed)) % LCG_MODULUS;
  return () => {
    state = (state * LCG_MULTIPLIER) % LCG_MODULUS;
    return state / LCG_MODULUS;
  };
}

export function shuffle<T>(items: readonly T[], random: RandomSource): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function chunk<T>(items: readonly T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let start = 0; start < items.length; start += size) {
    groups.push(items.slice(start, start + size));
  }
  return groups;
}
