"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Goose } from "@/components/goose/Goose";
import { useAccount } from "@/components/ProgressProvider";
import { celebrate } from "@/lib/client/celebrate";
import { playFanfare, playWrong } from "@/lib/client/sounds";
import { useToday } from "@/lib/client/useToday";
import { applyEndlessResult, type EndlessState } from "@/lib/endless";

export function EndlessGameOver({ state, onRestart }: { state: EndlessState; onRestart: () => void }) {
  const { progress, updateProgress } = useAccount();
  const today = useToday();
  const [previousRecord] = useState(progress.endlessRecord);
  const [report] = useState(() => applyEndlessResult(progress, { state, today }));
  const newRecord = state.score > previousRecord;

  useEffect(() => {
    void updateProgress(report.progress);
    if (newRecord) {
      celebrate();
      playFanfare();
    } else {
      playWrong();
    }
  }, [report, updateProgress, newRecord]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-5 px-4 py-10 text-center">
      <Goose mood={newRecord ? "cheer" : "sad"} outfits={progress.outfits} className={`w-40 ${newRecord ? "animate-goose-jump" : "animate-goose-shake"}`} />
      <h1 className="text-4xl font-black text-fox">{newRecord ? "NYTT REKORD!" : "Slut på hjärtan!"}</h1>
      <p className="animate-pop-in text-7xl font-black">⭐ {state.score}</p>
      <p className="text-lg font-bold text-wolf">
        Rekord: {Math.max(previousRecord, state.score)} · +{report.earnedXp} XP
      </p>
      {report.newBadges.map((badge) => (
        <p key={badge.id} className="w-full animate-pop-in rounded-2xl border-2 border-b-4 border-bee bg-bee-light p-3 text-lg font-black">
          {badge.emoji} Nytt märke: {badge.title}!
        </p>
      ))}
      <button onClick={onRestart} className="btn btn-green mt-4 w-full">
        Spela igen
      </button>
      <Link href="/" className="btn btn-white w-full">
        Till kartan
      </Link>
    </main>
  );
}
