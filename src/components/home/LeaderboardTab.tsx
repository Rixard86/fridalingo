"use client";

import { useEffect, useState } from "react";
import { Goose } from "@/components/goose/Goose";
import { fetchLeaderboard, type LeaderboardData, type LeaderboardEntry } from "@/lib/client/api";
import { levelFor } from "@/lib/rewards";
import type { Board } from "@/lib/scores";

const BOARD_TABS: { id: Board; label: string }[] = [
  { id: "xp", label: "⭐ Nivå" },
  { id: "map", label: "🗺️ Karta" },
  { id: "endless", label: "♾️ Endless" },
];

const MEDALS = ["🥇", "🥈", "🥉"];

function scoreText(board: Board, score: number): string {
  if (board === "xp") return `Nivå ${levelFor(score)} · ${score} XP`;
  return board === "map" ? `${score} banor` : `${score} poäng`;
}

function Row({ entry, board }: { entry: LeaderboardEntry; board: Board }) {
  return (
    <li
      className={`flex items-center gap-3 rounded-2xl border-2 border-b-4 px-4 py-3 ${
        entry.isMe ? "border-sky bg-sky-light" : "border-swan bg-white"
      }`}
    >
      <span className="w-8 text-center text-2xl font-black text-wolf">{MEDALS[entry.rank - 1] ?? entry.rank}</span>
      <Goose look={entry.look} seasonal={false} className="w-12 shrink-0" />
      <span className="flex-1 truncate text-lg font-black">
        {entry.name}
        {entry.isMe && <span className="ml-1 text-sm text-sky-dark">(du)</span>}
      </span>
      <span className="text-sm font-extrabold text-wolf">{scoreText(board, entry.score)}</span>
    </li>
  );
}

function BoardList({ board, data }: { board: Board; data: LeaderboardData }) {
  const meListed = data.entries.some((entry) => entry.isMe);
  if (data.entries.length === 0) {
    return <p className="text-center font-bold text-hare">Ingen har poäng här än. Bli först!</p>;
  }
  return (
    <ol className="flex flex-col gap-2">
      {data.entries.map((entry) => (
        <Row key={entry.rank} entry={entry} board={board} />
      ))}
      {!meListed && data.me && (
        <p className="mt-2 text-center font-bold text-wolf">
          Du är på plats {data.me.rank} med {scoreText(board, data.me.score)}
        </p>
      )}
    </ol>
  );
}

export function LeaderboardTab() {
  const [board, setBoard] = useState<Board>("xp");
  const [loaded, setLoaded] = useState<{ board: Board; data: LeaderboardData | null } | null>(null);

  useEffect(() => {
    let active = true;
    void fetchLeaderboard(board).then((data) => {
      if (active) setLoaded({ board, data });
    });
    return () => {
      active = false;
    };
  }, [board]);

  const current = loaded?.board === board ? loaded : null;
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-center text-3xl font-black">🏆 Topplista</h2>
      <div className="grid grid-cols-3 gap-2">
        {BOARD_TABS.map((tab) => (
          <button key={tab.id} onClick={() => setBoard(tab.id)} className={`tile px-2 py-2 text-sm ${board === tab.id ? "tile-selected" : ""}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {!current && <p className="text-center font-bold text-hare">Laddar…</p>}
      {current && !current.data && <p className="text-center font-bold text-cardinal">Kunde inte hämta topplistan.</p>}
      {current?.data && <BoardList board={board} data={current.data} />}
    </div>
  );
}
