"use client";

import { findWeek } from "@/data/weeks";

export function WordListSheet({ week, onClose }: { week: number; onClose: () => void }) {
  const words = findWeek(week)?.words ?? [];
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="max-h-[75dvh] w-full max-w-xl animate-slide-up overflow-y-auto rounded-t-3xl bg-white p-5 pb-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-black">Glosor vecka {week}</h2>
          <button onClick={onClose} aria-label="Stäng" className="text-3xl font-black text-hare">
            ✕
          </button>
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-lg">
          {words.map((word) => (
            <li key={word.id} className="contents">
              <span className={word.sentence ? "font-black underline" : "font-bold"}>{word.en.join(" / ")}</span>
              <span className="text-wolf">{word.sv.join(" / ")}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm font-bold text-hare">Understrukna ord övar du i meningar.</p>
      </div>
    </div>
  );
}
