"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Goose } from "@/components/goose/Goose";
import { WEEKS } from "@/data/weeks";
import { buildMap, currentLevelIndex, isLevelDone, isLevelUnlocked, type Level } from "@/lib/levels";
import { layoutMap, type NodePosition } from "@/lib/mapLayout";
import type { Progress } from "@/lib/types";
import { LevelNode, type NodeState } from "./LevelNode";
import { MapPath } from "./MapPath";
import { themeFor } from "./themes";
import { WordListSheet } from "./WordListSheet";
import { WorldBand } from "./WorldBand";
import { wornLook } from "@/lib/outfits";

const MAP_CENTER = 50;
const GOOSE_OFFSET_PX = 72;

function nodeState(progress: Progress, position: { levels: Level[]; index: number }): NodeState {
  if (isLevelDone(progress, position.levels[position.index])) return "done";
  return isLevelUnlocked(progress, position) ? "open" : "locked";
}

function GooseMarker({ position, progress }: { position: NodePosition; progress: Progress }) {
  const onLeft = position.x > MAP_CENTER;
  const offset = onLeft ? `- ${GOOSE_OFFSET_PX}px` : `+ ${GOOSE_OFFSET_PX}px`;
  return (
    <div
      className="pointer-events-none absolute z-20 w-16 -translate-x-1/2 -translate-y-2/3"
      style={{ left: `calc(${position.x}% ${offset})`, top: position.y }}
    >
      <div className={onLeft ? "-scale-x-100" : undefined}>
        <Goose look={wornLook(progress)} themes={progress.seasonThemes} className="w-16 animate-goose-bob drop-shadow-lg" />
      </div>
    </div>
  );
}

export function WorldMap({ progress }: { progress: Progress }) {
  const [openWeek, setOpenWeek] = useState<number | null>(null);
  const currentRef = useRef<HTMLDivElement>(null);
  const map = useMemo(() => buildMap(WEEKS, progress), [progress]);
  const layout = useMemo(() => layoutMap(map), [map]);
  const worldIndex = useMemo(() => new Map(map.worlds.map((world) => [world.id, world.index])), [map]);
  const current = currentLevelIndex(progress, map.levels);
  const topWorld = map.worlds.length - 1;

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: layout.height }}>
      {layout.worlds.map((area) => (
        <WorldBand key={area.world.id} area={area} isTop={area.world.index === topWorld} onShowWords={setOpenWeek} />
      ))}
      <MapPath nodes={layout.nodes} height={layout.height} reached={current} />
      {map.levels.map((level, index) => (
        <LevelNode
          key={level.key}
          ref={index === current ? currentRef : undefined}
          level={level}
          position={layout.nodes[index]}
          state={nodeState(progress, { levels: map.levels, index })}
          isCurrent={index === current}
          stars={progress.stars[level.key] ?? 0}
          theme={themeFor(worldIndex.get(level.worldId) ?? 0)}
        />
      ))}
      <GooseMarker position={layout.nodes[current]} progress={progress} />
      {openWeek !== null && <WordListSheet week={openWeek} onClose={() => setOpenWeek(null)} />}
    </div>
  );
}
