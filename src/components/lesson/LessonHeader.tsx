"use client";

import Link from "next/link";
import { useState } from "react";
import { isMuted, setMuted } from "@/lib/client/sounds";

const PERCENT = 100;
const COMBO_SHOWN_FROM = 2;

export function LessonHeader({ ratio, combo, homeHref }: { ratio: number; combo: number; homeHref: string }) {
  const [muted, setMutedState] = useState(isMuted);

  function toggleMute() {
    setMuted(!muted);
    setMutedState(!muted);
  }

  return (
    <header className="mx-auto flex w-full max-w-xl items-center gap-4 px-4 pt-5">
      <Link href={homeHref} aria-label="Avsluta lektionen" className="text-3xl font-black text-hare hover:text-wolf">
        ✕
      </Link>
      <div className="h-4 flex-1 overflow-hidden rounded-full bg-swan">
        <div
          className="h-full rounded-full bg-feather transition-all duration-500"
          style={{ width: `${ratio * PERCENT}%` }}
        />
      </div>
      {combo >= COMBO_SHOWN_FROM && (
        <span key={combo} className="animate-pop-in text-lg font-black text-fox">
          🔥{combo}
        </span>
      )}
      <button onClick={toggleMute} aria-label={muted ? "Slå på ljud" : "Stäng av ljud"} className="text-2xl">
        {muted ? "🔇" : "🔊"}
      </button>
    </header>
  );
}
