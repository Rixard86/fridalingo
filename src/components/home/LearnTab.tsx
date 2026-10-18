"use client";

import Link from "next/link";
import { GooseSays } from "@/components/goose/GooseSays";
import { useAccount } from "@/components/ProgressProvider";
import { WEEKS } from "@/data/weeks";
import { useToday } from "@/lib/client/useToday";
import { homeGreeting } from "@/lib/messages";
import { currentStreak, todaysXp } from "@/lib/progress";
import { DAILY_GOAL_XP } from "@/lib/rewards";
import { WeekCard } from "./WeekCard";

function ReviewCard({ hardWords }: { hardWords: number }) {
  return (
    <Link
      href="/repetera"
      className="flex items-center gap-4 rounded-3xl border-2 border-b-4 border-sky-dark bg-sky p-4 text-white transition active:translate-y-0.5"
    >
      <span className="text-4xl">🧠</span>
      <span className="flex-1">
        <span className="block text-xl font-black">Repetera</span>
        <span className="block font-bold opacity-90">
          {hardWords > 0 ? `${hardWords} svåra ord väntar på dig` : "Blanda glosor från alla veckor"}
        </span>
      </span>
      <span className="text-2xl font-black">›</span>
    </Link>
  );
}

export function LearnTab() {
  const { name, progress, saveFailed } = useAccount();
  const today = useToday();
  const dailyXp = todaysXp(progress, today);
  const greeting = homeGreeting({ name, streak: currentStreak(progress, today), todaysXp: dailyXp, goalXp: DAILY_GOAL_XP });
  return (
    <div className="flex flex-col gap-5">
      <GooseSays message={greeting} mood={dailyXp >= DAILY_GOAL_XP ? "cheer" : "happy"} outfit={progress.outfit} />
      {saveFailed && (
        <p className="rounded-2xl bg-cardinal-light p-3 text-center font-bold text-cardinal-dark">
          Kunde inte spara. Kolla internet så sparas det nästa gång!
        </p>
      )}
      <ReviewCard hardWords={Object.keys(progress.pendingReviews).length} />
      {WEEKS.map((week, index) => (
        <WeekCard key={week.week} week={week} progress={progress} isNewest={index === 0} />
      ))}
    </div>
  );
}
