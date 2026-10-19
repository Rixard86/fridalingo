"use client";

import Link from "next/link";
import { WorldMap } from "@/components/map/WorldMap";
import { useAccount } from "@/components/ProgressProvider";
import { PRACTICE_HREF } from "@/lib/lessons";

function ReviewButton({ hardWords }: { hardWords: number }) {
  return (
    <Link
      href={PRACTICE_HREF}
      aria-label="Öva"
      className="fixed right-4 bottom-24 z-20 flex h-16 w-16 items-center justify-center rounded-full border-b-4 border-sky-dark bg-sky text-3xl shadow-lg transition active:translate-y-0.5"
    >
      🧠
      {hardWords > 0 && (
        <span className="absolute -top-1 -right-1 flex h-7 min-w-7 items-center justify-center rounded-full bg-cardinal px-1 text-sm font-black text-white">
          {hardWords}
        </span>
      )}
    </Link>
  );
}

export function LearnTab() {
  const { progress, saveFailed } = useAccount();
  return (
    <div className="-mx-4 -mt-6 -mb-30">
      {saveFailed && (
        <p className="m-4 rounded-2xl bg-cardinal-light p-3 text-center font-bold text-cardinal-dark">
          Kunde inte spara. Kolla internet så sparas det nästa gång!
        </p>
      )}
      <WorldMap progress={progress} />
      <ReviewButton hardWords={Object.keys(progress.pendingReviews).length} />
    </div>
  );
}
