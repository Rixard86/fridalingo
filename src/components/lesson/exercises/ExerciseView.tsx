"use client";

import type { Exercise, ExerciseOutcome } from "@/lib/types";
import { ChoiceExercise } from "./ChoiceExercise";
import { MatchExercise } from "./MatchExercise";
import { WriteExercise } from "./WriteExercise";

interface ExerciseViewProps {
  exercise: Exercise;
  locked: boolean;
  onSubmit: (outcome: ExerciseOutcome) => void;
}

export function ExerciseView({ exercise, locked, onSubmit }: ExerciseViewProps) {
  switch (exercise.kind) {
    case "choice":
      return <ChoiceExercise exercise={exercise} locked={locked} onSubmit={onSubmit} />;
    case "match":
      return <MatchExercise exercise={exercise} locked={locked} onSubmit={onSubmit} />;
    default:
      return <WriteExercise exercise={exercise} locked={locked} onSubmit={onSubmit} />;
  }
}
