import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MixLesson } from "@/components/lesson/MixLesson";
import { LoadingScreen, RequireLogin } from "@/components/RequireLogin";
import { findWeek, WEEKS } from "@/data/weeks";

type MixParams = Promise<{ vecka: string; nummer: string }>;

export function generateStaticParams() {
  return WEEKS.map((week) => ({ vecka: String(week.week), nummer: "1" }));
}

async function MixFromParams({ params }: { params: MixParams }) {
  const { vecka, nummer } = await params;
  const week = findWeek(Number(vecka));
  const number = Number(nummer);
  if (!week || !Number.isInteger(number) || number < 1) notFound();
  return (
    <RequireLogin>
      <MixLesson week={week.week} number={number} />
    </RequireLogin>
  );
}

export default function MixPage({ params }: { params: MixParams }) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <MixFromParams params={params} />
    </Suspense>
  );
}
