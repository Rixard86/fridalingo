"use client";

import { useState } from "react";
import { findWeek } from "@/data/weeks";
import { buildLesson, lessonKey, type LessonKind } from "@/lib/lessons";
import { LessonPlayer } from "./LessonPlayer";

export function WeekLesson({ week, kind }: { week: number; kind: LessonKind }) {
  const [exercises] = useState(() => {
    const words = findWeek(week)?.words ?? [];
    return buildLesson(kind, { words, pool: words, random: Math.random });
  });
  return <LessonPlayer exercises={exercises} lessonKey={lessonKey(week, kind)} />;
}
