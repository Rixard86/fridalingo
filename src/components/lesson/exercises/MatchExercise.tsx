"use client";

import { useState } from "react";
import { playPop, playWrong } from "@/lib/client/sounds";
import { speak } from "@/lib/client/speech";
import { shuffle } from "@/lib/random";
import type { ExerciseOutcome, Word } from "@/lib/types";
import { ExerciseTitle, type ExerciseProps } from "./shared";

const WRONG_FLASH_MS = 600;

type Side = "en" | "sv";

interface Tile {
  wordId: string;
  text: string;
}

interface TilePick {
  side: Side;
  wordId: string;
}

function tilesFor(words: Word[], side: Side): Tile[] {
  return shuffle(
    words.map((word) => ({ wordId: word.id, text: word[side][0] })),
    Math.random,
  );
}

function useMatchGame(words: Word[], onComplete: (outcome: ExerciseOutcome) => void) {
  const [picked, setPicked] = useState<TilePick | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [missed, setMissed] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<TilePick[]>([]);

  function pick(next: TilePick) {
    if (!picked || picked.side === next.side) return setPicked(next);
    setPicked(null);
    if (picked.wordId === next.wordId) {
      playPop();
      const nowMatched = [...matched, next.wordId];
      setMatched(nowMatched);
      if (nowMatched.length === words.length) {
        onComplete({ events: words.map((word) => ({ wordId: word.id, correct: !missed.includes(word.id) })), solution: "" });
      }
      return;
    }
    playWrong();
    setMissed([...missed, picked.wordId, next.wordId]);
    setWrongPair([picked, next]);
    setTimeout(() => setWrongPair([]), WRONG_FLASH_MS);
  }

  return { picked, matched, wrongPair, pick };
}

export function MatchExercise({ exercise, onSubmit }: ExerciseProps<"match">) {
  const [columns] = useState(() => ({ en: tilesFor(exercise.words, "en"), sv: tilesFor(exercise.words, "sv") }));
  const game = useMatchGame(exercise.words, onSubmit);

  function tileClass(side: Side, tile: Tile): string {
    if (game.matched.includes(tile.wordId)) return "tile-done";
    if (game.picked?.side === side && game.picked.wordId === tile.wordId) return "tile-selected";
    const isWrong = game.wrongPair.some((pick) => pick.side === side && pick.wordId === tile.wordId);
    return isWrong ? "tile-wrong animate-goose-shake" : "";
  }

  function choose(side: Side, tile: Tile) {
    if (side === "en") speak(tile.text);
    game.pick({ side, wordId: tile.wordId });
  }

  return (
    <div>
      <ExerciseTitle>Para ihop orden</ExerciseTitle>
      <div className="grid grid-cols-2 gap-3">
        {(["en", "sv"] as const).map((side) => (
          <div key={side} className="flex flex-col gap-3">
            {columns[side].map((tile) => (
              <button
                key={tile.wordId}
                disabled={game.matched.includes(tile.wordId)}
                onClick={() => choose(side, tile)}
                className={`tile text-base ${tileClass(side, tile)}`}
              >
                {tile.text}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
