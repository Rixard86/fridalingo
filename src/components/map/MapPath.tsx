import type { NodePosition } from "@/lib/mapLayout";

const MIDPOINT_DIVISOR = 2;

function pathThrough(nodes: NodePosition[]): string {
  return nodes
    .map((node, index) => {
      if (index === 0) return `M ${node.x} ${node.y}`;
      const previous = nodes[index - 1];
      const middle = (previous.y + node.y) / MIDPOINT_DIVISOR;
      return `C ${previous.x} ${middle}, ${node.x} ${middle}, ${node.x} ${node.y}`;
    })
    .join(" ");
}

interface MapPathProps {
  nodes: NodePosition[];
  height: number;
  reached: number;
}

export function MapPath({ nodes, height, reached }: MapPathProps) {
  const fullPath = pathThrough(nodes);
  const reachedPath = pathThrough(nodes.slice(0, reached + 1));
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke">
        <path d={fullPath} stroke="rgba(90,60,30,0.18)" strokeWidth="34" vectorEffect="non-scaling-stroke" />
        <path d={fullPath} stroke="#fff6e3" strokeWidth="26" vectorEffect="non-scaling-stroke" />
        <path d={fullPath} stroke="#ead7ae" strokeWidth="5" strokeDasharray="1 14" vectorEffect="non-scaling-stroke" />
        <path d={reachedPath} stroke="#ffc800" strokeWidth="8" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}
