export function shadowFill(prefix: string): string {
  return `url(#${prefix}-shadow)`;
}

export function GooseDefs({ prefix }: { prefix: string }) {
  return (
    <defs>
      <radialGradient id={`${prefix}-shadow`}>
        <stop offset="0%" stopColor="#000000" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}
