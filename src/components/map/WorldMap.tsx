"use client";

import { useEffect, useRef, useState } from "react";
import { Goose } from "@/components/goose/Goose";
import { WEEKS } from "@/data/weeks";
import { buildLevels, currentLevelIndex, isLevelDone, isLevelUnlocked } from "@/lib/levels";
import { layoutMap, type NodePosition } from "@/lib/mapLayout";
import type { Progress } from "@/lib/types";
import { LevelNode, type NodeState } from "./LevelNode";
import { MapPath } from "./MapPath";
import { themeFor } from "./themes";
import { WordListSheet } from "./WordListSheet";
import { WorldBand } from "./WorldBand";

const LEVELS = buildLevels(WEEKS);
const LAYOUT = layoutMap(LEVELS);
const WORLD_INDEX = new Map(LAYOUT.worlds.map((world) => [world.week, world.index]));
const MAP_CENTER = 50;
const GOOSE_OFFSET_PX = 72;

function nodeState(progress: Progress, index: number): NodeState {
  if (isLevelDone(progress, LEVELS[index])) return "done";
  return isLevelUnlocked(progress, { levels: LEVELS, index }) ? "open" : "locked";
}

function GooseMarker({ position, outfit }: { position: NodePosition; outfit: string | null }) {
  const offset = position.x > MAP_CENTER ? `- ${GOOSE_OFFSET_PX}px` : `+ ${GOOSE_OFFSET_PX}px`;
  return (
    <div
      className="pointer-events-none absolute z-20 w-16 -translate-x-1/2 -translate-y-2/3"
      style={{ left: `calc(${position.x}% ${offset})`, top: position.y }}
    >
      <Goose outfit={outfit} className="w-16 animate-goose-bob drop-shadow-md" />
    </div>
  );
}

export function WorldMap({ progress }: { progress: Progress }) {
  const [openWeek, setOpenWeek] = useState<number | null>(null);
  const currentRef = useRef<HTMLDivElement>(null);
  const current = currentLevelIndex(progress, LEVELS);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: LAYOUT.height }}>
      {LAYOUT.worlds.map((world) => (
        <WorldBand key={world.week} world={world} onShowWords={() => setOpenWeek(world.week)} />
      ))}
      <MapPath nodes={LAYOUT.nodes} height={LAYOUT.height} reached={current} />
      {LEVELS.map((level, index) => (
        <LevelNode
          key={level.key}
          ref={index === current ? currentRef : undefined}
          level={level}
          position={LAYOUT.nodes[index]}
          state={nodeState(progress, index)}
          isCurrent={index === current}
          stars={progress.stars[level.key] ?? 0}
          theme={themeFor(WORLD_INDEX.get(level.week) ?? 0)}
        />
      ))}
      <GooseMarker position={LAYOUT.nodes[current]} outfit={progress.outfit} />
      {openWeek !== null && <WordListSheet week={openWeek} onClose={() => setOpenWeek(null)} />}
    </div>
  );
}
