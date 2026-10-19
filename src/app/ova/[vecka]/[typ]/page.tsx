import { notFound } from "next/navigation";
import { Suspense } from "react";
import { WeekLesson } from "@/components/lesson/WeekLesson";
import { LoadingScreen, RequireLogin } from "@/components/RequireLogin";
import { findWeek, WEEKS } from "@/data/weeks";
import { isLessonKind, LESSON_KINDS } from "@/lib/lessons";

type PracticeParams = Promise<{ vecka: string; typ: string }>;

export function generateStaticParams() {
  return WEEKS.flatMap((week) => LESSON_KINDS.map((kind) => ({ vecka: String(week.week), typ: kind })));
}

async function PracticeFromParams({ params }: { params: PracticeParams }) {
  const { vecka, typ } = await params;
  const week = findWeek(Number(vecka));
  if (!week || !isLessonKind(typ)) notFound();
  return (
    <RequireLogin>
      <WeekLesson week={week.week} kind={typ} practice />
    </RequireLogin>
  );
}

export default function PracticeLessonPage({ params }: { params: PracticeParams }) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <PracticeFromParams params={params} />
    </Suspense>
  );
}
