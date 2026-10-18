import { notFound } from "next/navigation";
import { Suspense } from "react";
import { WeekLesson } from "@/components/lesson/WeekLesson";
import { LoadingScreen, RequireLogin } from "@/components/RequireLogin";
import { findWeek, WEEKS } from "@/data/weeks";
import { isLessonKind, LESSON_KINDS } from "@/lib/lessons";

type LessonParams = Promise<{ vecka: string; typ: string }>;

export function generateStaticParams() {
  return WEEKS.flatMap((week) => LESSON_KINDS.map((kind) => ({ vecka: String(week.week), typ: kind })));
}

async function LessonFromParams({ params }: { params: LessonParams }) {
  const { vecka, typ } = await params;
  const week = findWeek(Number(vecka));
  if (!week || !isLessonKind(typ)) notFound();
  return (
    <RequireLogin>
      <WeekLesson week={week.week} kind={typ} />
    </RequireLogin>
  );
}

export default function LessonPage({ params }: { params: LessonParams }) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <LessonFromParams params={params} />
    </Suspense>
  );
}
