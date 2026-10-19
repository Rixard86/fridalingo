"use client";

import { useState } from "react";
import { useAccount } from "@/components/ProgressProvider";
import { ALL_WORDS } from "@/data/weeks";
import { buildReviewLesson, pickReviewWords, PRACTICE_HREF, REVIEW_KEY } from "@/lib/lessons";
import { LessonPlayer } from "./LessonPlayer";

export function ReviewLesson() {
  const { progress } = useAccount();
  const [exercises] = useState(() => {
    const context = { words: [], pool: ALL_WORDS, random: Math.random };
    const words = pickReviewWords(progress.pendingReviews, context);
    return buildReviewLesson({ ...context, words });
  });
  return <LessonPlayer exercises={exercises} lessonKey={REVIEW_KEY} homeHref={PRACTICE_HREF} />;
}
