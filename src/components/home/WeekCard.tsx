"use client";

import Link from "next/link";
import { LESSON_KINDS, LESSON_TITLES, type LessonKind } from "@/lib/lessons";
import { isLessonDone, isLessonUnlocked } from "@/lib/progress";
import type { Progress, Week } from "@/lib/types";

const LESSON_ICONS: Record<LessonKind, string> = {
  "lar-dig": "📖",
  stava: "✏️",
  meningar: "💬",
};

interface LessonNodeProps {
  week: number;
  kind: LessonKind;
  progress: Progress;
}

function LessonNode({ week, kind, progress }: LessonNodeProps) {
  const done = isLessonDone(progress, { week, kind });
  const unlocked = isLessonUnlocked(progress, { week, kind });
  const circle = done
    ? "border-bee-dark bg-bee"
    : unlocked
      ? "border-feather-dark bg-feather animate-goose-bob"
      : "border-hare bg-swan grayscale";
  const content = (
    <>
      <span className={`relative flex h-16 w-16 items-center justify-center rounded-full border-b-[6px] text-3xl ${circle}`}>
        {unlocked ? LESSON_ICONS[kind] : "🔒"}
        {done && <span className="absolute -right-1 -top-1 rounded-full bg-white text-base">✅</span>}
      </span>
      <span className="text-sm font-extrabold">{LESSON_TITLES[kind]}</span>
    </>
  );
  if (!unlocked) return <div className="flex flex-col items-center gap-1 text-hare">{content}</div>;
  return (
    <Link href={`/lektion/${week}/${kind}`} className="flex flex-col items-center gap-1 transition active:translate-y-0.5">
      {content}
    </Link>
  );
}

function WordList({ week }: { week: Week }) {
  return (
    <details className="mt-3 text-sm">
      <summary className="cursor-pointer font-bold text-sky">Visa glosorna</summary>
      <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
        {week.words.map((word) => (
          <li key={word.id} className="contents">
            <span className={word.sentence ? "font-extrabold underline" : "font-bold"}>{word.en.join(" / ")}</span>
            <span className="text-wolf">{word.sv.join(" / ")}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function WeekCard({ week, progress, isNewest }: { week: Week; progress: Progress; isNewest: boolean }) {
  const allDone = LESSON_KINDS.every((kind) => isLessonDone(progress, { week: week.week, kind }));
  return (
    <section className={`rounded-3xl border-2 border-b-4 p-4 ${allDone ? "border-bee bg-bee-light" : "border-swan bg-white"}`}>
      <header className="mb-4 flex items-center justify-between">
        <div>
          {isNewest && <span className="text-xs font-black tracking-wide text-feather uppercase">Veckans glosor</span>}
          <h2 className="text-2xl font-black">Vecka {week.week}</h2>
        </div>
        {allDone && <span className="text-lg font-black text-bee-dark">👑 Klar!</span>}
      </header>
      <div className="flex justify-around">
        {LESSON_KINDS.map((kind) => (
          <LessonNode key={kind} week={week.week} kind={kind} progress={progress} />
        ))}
      </div>
      <WordList week={week} />
    </section>
  );
}
