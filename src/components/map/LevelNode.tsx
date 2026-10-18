import Link from "next/link";
import type { Ref } from "react";
import type { Level } from "@/lib/levels";
import { LESSON_TITLES } from "@/lib/lessons";
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

function StarRow({ stars }: { stars: number }) {
  return (
    <span className="absolute bottom-full mb-1 flex gap-0.5 text-xl drop-shadow">
      {Array.from({ length: MAX_STARS }, (_, index) => (
        <span key={index} className={index < stars ? "text-bee" : "text-white/70"}>
          ★
        </span>
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
        className={`flex items-center justify-center rounded-full border-b-[6px] font-black shadow-md ${
          isBoss ? "h-24 w-24 text-4xl" : "h-[72px] w-[72px] text-2xl"
        } ${circle.className}`}
        style={circle.style}
      >
        {state === "locked" ? "🔒" : isBoss ? "👑" : level.number}
      </span>
      <span className="absolute top-full mt-1 rounded-full bg-white/85 px-2 text-xs font-extrabold whitespace-nowrap text-ink">
        {isBoss ? `Bana ${level.number} · ` : ""}
        {LESSON_TITLES[level.kind]}
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
        <Link href={`/lektion/${level.week}/${level.kind}`} aria-label={`Bana ${level.number}`} className="relative flex flex-col items-center transition active:translate-y-0.5">
          {content}
        </Link>
      )}
    </div>
  );
}
