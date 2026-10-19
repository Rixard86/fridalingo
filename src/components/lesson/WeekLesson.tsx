"use client";

import { useState } from "react";
import { findWeek } from "@/data/weeks";
import { buildLesson, lessonKey, PRACTICE_HREF, practiceKey, type LessonKind } from "@/lib/lessons";
import { LessonPlayer } from "./LessonPlayer";

interface WeekLessonProps {
  week: number;
  kind: LessonKind;
  practice?: boolean;
}

export function WeekLesson({ week, kind, practice = false }: WeekLessonProps) {
  const [exercises] = useState(() => {
    const words = findWeek(week)?.words ?? [];
    return buildLesson(kind, { words, pool: words, random: Math.random });
  });
  if (practice) return <LessonPlayer exercises={exercises} lessonKey={practiceKey(week, kind)} homeHref={PRACTICE_HREF} />;
  return <LessonPlayer exercises={exercises} lessonKey={lessonKey(week, kind)} />;
}
