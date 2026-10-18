"use client";

import { useAccount } from "@/components/ProgressProvider";
import { useToday } from "@/lib/client/useToday";
import { currentStreak, todaysXp } from "@/lib/progress";
import { DAILY_GOAL_XP, levelFor, levelRatio } from "@/lib/rewards";

const PERCENT = 100;

function Bar({ ratio, color }: { ratio: number; color: string }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-swan">
      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${Math.min(1, ratio) * PERCENT}%` }} />
    </div>
  );
}

export function StatsBar() {
  const { progress } = useAccount();
  const today = useToday();
  const streak = currentStreak(progress, today);
  const practicedToday = progress.lastPracticeDay === today;
  const dailyXp = todaysXp(progress, today);
  return (
    <header className="sticky top-0 z-10 border-b-2 border-swan bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-xl items-center gap-4 px-4 py-3">
        <div className={`flex items-center gap-1 text-xl font-black ${practicedToday ? "text-fox" : "text-hare"}`} title="Dagar i rad">
          <span className={practicedToday ? "animate-flame" : "grayscale"}>🔥</span>
          {streak}
        </div>
        <div className="flex flex-1 flex-col gap-1" title="Nivå">
          <span className="text-xs font-extrabold text-wolf uppercase">Nivå {levelFor(progress.xp)} · {progress.xp} XP</span>
          <Bar ratio={levelRatio(progress.xp)} color="bg-bee" />
        </div>
        <div className="flex flex-1 flex-col gap-1" title="Dagens mål">
          <span className="text-xs font-extrabold text-wolf uppercase">
            🎯 {Math.min(dailyXp, DAILY_GOAL_XP)}/{DAILY_GOAL_XP} XP
          </span>
          <Bar ratio={dailyXp / DAILY_GOAL_XP} color="bg-feather" />
        </div>
      </div>
    </header>
  );
}
