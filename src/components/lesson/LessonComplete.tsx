"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Goose } from "@/components/goose/Goose";
import { useAccount } from "@/components/ProgressProvider";
import { celebrate } from "@/lib/client/celebrate";
import { playFanfare } from "@/lib/client/sounds";
import { useToday } from "@/lib/client/useToday";
import { applyLessonResult, MAX_STARS, PERFECT_BONUS_XP, todaysXp } from "@/lib/progress";
import { newlyUnlockedOutfits } from "@/lib/outfits";
import { DAILY_GOAL_XP, levelFor } from "@/lib/rewards";
import type { LessonResult } from "@/lib/types";
import { wornLook } from "@/lib/outfits";

const PERCENT = 100;
const STAR_DELAY_MS = 250;

function EarnedStars({ stars }: { stars: number }) {
  return (
    <div className="flex gap-2 text-6xl">
      {Array.from({ length: MAX_STARS }, (_, index) => (
        <span
          key={index}
          className={`animate-pop-in drop-shadow ${index < stars ? "text-bee" : "text-swan"}`}
          style={{ animationDelay: `${index * STAR_DELAY_MS}ms` }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`flex-1 animate-pop-in overflow-hidden rounded-2xl border-2 ${color}`}>
      <p className="py-1 text-center text-xs font-black text-white uppercase">{label}</p>
      <p className="bg-white py-3 text-center text-2xl font-black">{value}</p>
    </div>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <p className="w-full animate-pop-in rounded-2xl border-2 border-b-4 border-bee bg-bee-light p-3 text-center text-lg font-black">
      {children}
    </p>
  );
}

function accuracyOf(result: LessonResult): number {
  const correct = result.events.filter((event) => event.correct).length;
  return result.events.length === 0 ? PERCENT : Math.round((correct / result.events.length) * PERCENT);
}

export function LessonComplete({ result, homeHref }: { result: LessonResult; homeHref: string }) {
  const { progress, updateProgress } = useAccount();
  const today = useToday();
  const [before] = useState(progress);
  const [report] = useState(() => applyLessonResult(progress, { result, today }));
  const after = report.progress;
  const levelUp = levelFor(after.xp) > levelFor(before.xp);
  const goalJustReached = todaysXp(before, today) < DAILY_GOAL_XP && after.dailyXp >= DAILY_GOAL_XP;

  const saved = useRef(false);

  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    void updateProgress(report.progress);
    celebrate();
    playFanfare();
  }, [report, updateProgress]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-5 px-4 py-10">
      <Goose mood="cheer" look={wornLook(after)} themes={after.seasonThemes} className="w-40 animate-goose-jump" />
      <EarnedStars stars={report.stars} />
      <h1 className="text-center text-4xl font-black text-bee-dark">Banan klar!</h1>
      <div className="flex w-full gap-3">
        <StatCard label="XP" value={`+${report.earnedXp}`} color="border-bee bg-bee" />
        <StatCard label="Träff" value={`${accuracyOf(result)}%`} color="border-feather bg-feather" />
        <StatCard label="Kombo" value={`🔥${result.bestCombo}`} color="border-fox bg-fox" />
      </div>
      {result.mistakes === 0 && <Highlight>⭐ Felfri lektion! +{PERFECT_BONUS_XP} bonus-XP</Highlight>}
      {goalJustReached && <Highlight>🎯 Dagsmålet klart! Svit: {after.streak} 🔥</Highlight>}
      {levelUp && <Highlight>⬆️ Ny nivå: {levelFor(after.xp)}!</Highlight>}
      {newlyUnlockedOutfits(before.xp, after.xp).map((outfit) => (
        <Highlight key={outfit.id}>🎁 Ny gåsgrej: {outfit.name}! Testa den under Gåsen.</Highlight>
      ))}
      {report.newBadges.map((badge) => (
        <Highlight key={badge.id}>
          {badge.emoji} Nytt märke: {badge.title}!
        </Highlight>
      ))}
      <Link href={homeHref} className="btn btn-green mt-4 w-full">
        Fortsätt
      </Link>
    </main>
  );
}
