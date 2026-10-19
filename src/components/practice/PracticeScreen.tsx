"use client";

import Link from "next/link";
import { useState } from "react";
import { WordListSheet } from "@/components/map/WordListSheet";
import { useAccount } from "@/components/ProgressProvider";
import { WEEKS } from "@/data/weeks";
import type { Progress, Week } from "@/lib/types";
import { WeekCard } from "./WeekCard";

function hardWordsIn(week: Week, progress: Progress): number {
  return week.words.filter((word) => progress.pendingReviews[word.id] !== undefined).length;
}

function ReviewCard({ hardWords }: { hardWords: number }) {
  if (hardWords === 0) {
    return <p className="rounded-2xl border-2 border-swan bg-polar p-4 text-center font-bold text-hare">🧠 Inga svåra ord just nu. Bra jobbat!</p>;
  }
  return (
    <Link href="/repetera" className="tile flex items-center gap-4 border-sky">
      <span className="text-4xl">🧠</span>
      <span>
        <span className="block text-xl font-black">Repetera svåra ord</span>
        <span className="text-sm font-bold text-wolf">{hardWords} ord att öva mer på</span>
      </span>
    </Link>
  );
}

export function PracticeScreen() {
  const { progress } = useAccount();
  const [openWeek, setOpenWeek] = useState<number | null>(WEEKS[0]?.week ?? null);
  const [wordsWeek, setWordsWeek] = useState<number | null>(null);

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-6">
      <header className="flex items-center gap-3">
        <Link href="/" aria-label="Tillbaka till kartan" className="text-3xl font-black text-hare hover:text-wolf">
          ←
        </Link>
        <h1 className="text-3xl font-black">🧠 Öva</h1>
      </header>
      <ReviewCard hardWords={Object.keys(progress.pendingReviews).length} />
      <h2 className="mt-2 text-xl font-black">Välj vecka</h2>
      {WEEKS.map((week, index) => (
        <WeekCard
          key={week.week}
          week={week}
          newest={index === 0}
          open={openWeek === week.week}
          hardWords={hardWordsIn(week, progress)}
          onToggle={() => setOpenWeek(openWeek === week.week ? null : week.week)}
          onShowWords={() => setWordsWeek(week.week)}
        />
      ))}
      {wordsWeek !== null && <WordListSheet week={wordsWeek} onClose={() => setWordsWeek(null)} />}
    </main>
  );
}
