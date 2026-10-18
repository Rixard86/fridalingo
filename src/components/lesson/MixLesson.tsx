"use client";

import { useState } from "react";
import { useAccount } from "@/components/ProgressProvider";
import { WEEKS } from "@/data/weeks";
import { mixKey } from "@/lib/levels";
import { buildMixLesson } from "@/lib/mix";
import { LessonPlayer } from "./LessonPlayer";

export function MixLesson({ week, number }: { week: number; number: number }) {
  const { progress } = useAccount();
  const [exercises] = useState(() =>
    buildMixLesson({ anchorWeek: week, number, pendingReviews: progress.pendingReviews, random: Math.random }, WEEKS),
  );
  return <LessonPlayer exercises={exercises} lessonKey={mixKey(week, number)} />;
}
