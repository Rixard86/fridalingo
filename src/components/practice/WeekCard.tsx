import Link from "next/link";
import { LESSON_KINDS, LESSON_TITLES, PRACTICE_HREF, type LessonKind } from "@/lib/lessons";
import type { Week } from "@/lib/types";

const ACTIVITY_ICONS: Record<LessonKind, string> = { "lar-dig": "📚", stava: "✏️", meningar: "💬", prov: "📝" };

interface WeekCardProps {
  week: Week;
  newest: boolean;
  open: boolean;
  hardWords: number;
  onToggle: () => void;
  onShowWords: () => void;
}

export function WeekCard({ week, newest, open, hardWords, onToggle, onShowWords }: WeekCardProps) {
  return (
    <section className={`overflow-hidden rounded-2xl border-2 border-b-4 ${open ? "border-sky bg-sky-light" : "border-swan bg-white"}`}>
      <button onClick={onToggle} className="flex w-full items-center justify-between px-4 py-3 text-left">
        <span>
          <span className="flex items-center gap-2 text-xl font-black">
            Vecka {week.week}
            {newest && <span className="rounded-full bg-feather px-2 py-0.5 text-xs text-white">Den här veckan</span>}
          </span>
          <span className="text-sm font-bold text-wolf">
            {week.words.length} ord{hardWords > 0 ? ` · ${hardWords} svåra` : ""}
          </span>
        </span>
        <span className="text-xl text-hare">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-2 px-4 pb-4">
          {LESSON_KINDS.map((kind) => (
            <Link key={kind} href={`${PRACTICE_HREF}/${week.week}/${kind}`} className="btn btn-white px-2 normal-case">
              {ACTIVITY_ICONS[kind]} {LESSON_TITLES[kind]}
            </Link>
          ))}
          <button onClick={onShowWords} className="col-span-2 pt-1 text-sm font-bold text-sky">
            📖 Visa glosorna
          </button>
        </div>
      )}
    </section>
  );
}
