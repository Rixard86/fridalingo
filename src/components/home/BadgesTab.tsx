"use client";

import { useAccount } from "@/components/ProgressProvider";
import { BADGES } from "@/lib/badges";

export function BadgesTab() {
  const { progress } = useAccount();
  const earned = BADGES.filter((badge) => progress.badges.includes(badge.id)).length;
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <h2 className="text-3xl font-black">Märken</h2>
        <p className="font-bold text-wolf">
          {earned} av {BADGES.length} samlade
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {BADGES.map((badge) => {
          const isEarned = progress.badges.includes(badge.id);
          return (
            <div
              key={badge.id}
              className={`flex flex-col items-center gap-1 rounded-3xl border-2 border-b-4 p-4 text-center ${
                isEarned ? "border-bee bg-bee-light" : "border-swan bg-polar"
              }`}
            >
              <span className={`text-5xl ${isEarned ? "" : "opacity-30 grayscale"}`}>{badge.emoji}</span>
              <span className={`font-black ${isEarned ? "" : "text-hare"}`}>{badge.title}</span>
              <span className="text-sm font-bold text-wolf">{badge.description}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
