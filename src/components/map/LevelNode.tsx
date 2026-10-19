import Link from "next/link";
import type { Ref } from "react";
import type { Level } from "@/lib/levels";
import type { NodePosition } from "@/lib/mapLayout";
import { MAX_STARS } from "@/lib/progress";
import type { WorldTheme } from "./themes";

export type NodeState = "done" | "open" | "locked";

interface LevelNodeProps {
  level: Level;
  position: NodePosition;
  state: NodeState;
  isCurrent: boolean;
  stars: number;
  theme: WorldTheme;
  ref?: Ref<HTMLDivElement>;
}

const STAR_PATH = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z";

function StarRow({ stars }: { stars: number }) {
  return (
    <span className="absolute bottom-full mb-1 flex gap-0.5 rounded-full bg-white/90 px-1.5 py-0.5 shadow">
      {Array.from({ length: MAX_STARS }, (_, index) => (
        <svg key={index} viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path
            d={STAR_PATH}
            strokeWidth="2"
            strokeLinejoin="round"
            className={index < stars ? "fill-bee stroke-fox" : "fill-swan stroke-hare"}
          />
        </svg>
      ))}
    </span>
  );
}

function circleStyle(props: LevelNodeProps) {
  if (props.state === "locked") return { className: "border-hare bg-swan text-hare", style: undefined };
  if (props.isCurrent) return { className: "border-feather-dark bg-feather text-white animate-node-pulse", style: undefined };
  return { className: "text-white", style: { background: props.theme.node, borderColor: props.theme.nodeDark } };
}

export function LevelNode(props: LevelNodeProps) {
  const { level, position, state, stars, ref } = props;
  const isBoss = level.kind === "prov";
  const circle = circleStyle(props);
  const content = (
    <>
      {state === "done" && <StarRow stars={stars} />}
      <span
        className={`relative flex items-center justify-center rounded-full border-b-[6px] font-black shadow-lg ${
          isBoss ? "h-24 w-24 text-4xl" : "h-[72px] w-[72px] text-2xl"
        } ${circle.className}`}
        style={circle.style}
      >
        <span className="pointer-events-none absolute top-2 left-1/2 h-3 w-1/2 -translate-x-1/2 rounded-full bg-white/40" />
        {state === "locked" ? "🔒" : isBoss ? "👑" : level.number}
      </span>
      <span className="absolute top-full mt-1 rounded-full bg-white/85 px-2 text-xs font-extrabold whitespace-nowrap text-ink">
        {isBoss ? `Bana ${level.number} · ` : ""}
        {level.title}
      </span>
    </>
  );
  return (
    <div
      ref={ref}
      className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
      style={{ left: `${position.x}%`, top: position.y }}
    >
      {state === "locked" ? (
        <div className="relative flex flex-col items-center">{content}</div>
      ) : (
        <Link href={level.href} aria-label={`Bana ${level.number}`} className="relative flex flex-col items-center transition active:translate-y-0.5">
          {content}
        </Link>
      )}
    </div>
  );
}
