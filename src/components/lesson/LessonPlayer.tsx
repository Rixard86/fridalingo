"use client";

import { useState } from "react";
import { smallBurst } from "@/lib/client/celebrate";
import { playCorrect, playWrong } from "@/lib/client/sounds";
import {
  completionRatio,
  currentExercise,
  isLessonFinished,
  isOutcomeCorrect,
  nextExercise,
  startLesson,
  submitOutcome,
} from "@/lib/lessonState";
import { comboCheer } from "@/lib/messages";
import type { Exercise, ExerciseOutcome } from "@/lib/types";
import { ExerciseView } from "./exercises/ExerciseView";
import { FeedbackBar } from "./FeedbackBar";
import { LessonComplete } from "./LessonComplete";
import { LessonHeader } from "./LessonHeader";

interface LessonPlayerProps {
  exercises: Exercise[];
  lessonKey: string;
  homeHref?: string;
}

export function LessonPlayer({ exercises, lessonKey, homeHref = "/" }: LessonPlayerProps) {
  const [state, setState] = useState(() => startLesson(exercises));
  const exercise = currentExercise(state);

  if (isLessonFinished(state) || !exercise) {
    return (
      <LessonComplete
        result={{ lessonKey, events: state.events, mistakes: state.mistakes, bestCombo: state.bestCombo }}
        homeHref={homeHref}
      />
    );
  }

  function handleSubmit(outcome: ExerciseOutcome) {
    const next = submitOutcome(state, outcome);
    if (exercise?.kind === "match") {
      playCorrect();
      return setState(nextExercise(next));
    }
    const correct = isOutcomeCorrect(outcome);
    if (correct) playCorrect();
    else playWrong();
    if (correct && comboCheer(next.combo)) smallBurst();
    setState(next);
  }

  const outcome = state.lastOutcome;
  return (
    <div className="flex min-h-dvh flex-col pb-48">
      <LessonHeader ratio={completionRatio(state)} combo={state.combo} homeHref={homeHref} />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
        <ExerciseView key={state.position} exercise={exercise} locked={outcome !== null} onSubmit={handleSubmit} />
      </main>
      {outcome && (
        <FeedbackBar
          key={state.position}
          correct={isOutcomeCorrect(outcome)}
          solution={outcome.solution}
          combo={state.combo}
          onContinue={() => setState(nextExercise(state))}
        />
      )}
    </div>
  );
}
