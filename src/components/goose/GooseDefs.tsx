const PAINT_NAMES = ["body", "head", "wing", "beak", "foot", "scarf", "cheek", "iris", "shadow"] as const;

export type PaintName = (typeof PAINT_NAMES)[number];
export type GoosePaint = Record<PaintName, string>;

export function paintFor(prefix: string): GoosePaint {
  return Object.fromEntries(PAINT_NAMES.map((name) => [name, `url(#${prefix}-${name})`])) as GoosePaint;
}

export function GooseDefs({ prefix }: { prefix: string }) {
  return (
    <defs>
      <radialGradient id={`${prefix}-body`} cx="40%" cy="35%" r="70%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="65%" stopColor="#f4f7fb" />
        <stop offset="100%" stopColor="#d9e2ee" />
      </radialGradient>
      <radialGradient id={`${prefix}-head`} cx="38%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="70%" stopColor="#f5f8fc" />
        <stop offset="100%" stopColor="#dde5f0" />
      </radialGradient>
      <linearGradient id={`${prefix}-wing`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f8fafd" />
        <stop offset="100%" stopColor="#d3dceb" />
      </linearGradient>
      <linearGradient id={`${prefix}-beak`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffbf55" />
        <stop offset="100%" stopColor="#ff8a00" />
      </linearGradient>
      <linearGradient id={`${prefix}-foot`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffab45" />
        <stop offset="100%" stopColor="#f07800" />
      </linearGradient>
      <linearGradient id={`${prefix}-scarf`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1580c6" />
        <stop offset="100%" stopColor="#005588" />
      </linearGradient>
      <radialGradient id={`${prefix}-cheek`}>
        <stop offset="0%" stopColor="#ff9fb4" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#ff9fb4" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${prefix}-iris`} cx="45%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#8a5a2b" />
        <stop offset="70%" stopColor="#4a2c14" />
        <stop offset="100%" stopColor="#1e1208" />
      </radialGradient>
      <radialGradient id={`${prefix}-shadow`}>
        <stop offset="0%" stopColor="#000000" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}
