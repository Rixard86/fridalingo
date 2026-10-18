"use client";

import Link from "next/link";
import { useState } from "react";
import { ExerciseView } from "@/components/lesson/exercises/ExerciseView";
import { FeedbackBar } from "@/components/lesson/FeedbackBar";
import { useAccount } from "@/components/ProgressProvider";
import { ALL_WORDS } from "@/data/weeks";
import { solutionFor } from "@/lib/answers";
import { smallBurst } from "@/lib/client/celebrate";
import { playCorrect, playWrong } from "@/lib/client/sounds";
import {
  answerEndless,
  exerciseWordId,
  isEndlessOver,
  nextEndlessExercise,
  nextEndlessRound,
  secondsFor,
  startEndless,
  START_LIVES,
  type EndlessState,
} from "@/lib/endless";
import { isOutcomeCorrect } from "@/lib/lessonState";
import { comboCheer } from "@/lib/messages";
import type { ExerciseOutcome } from "@/lib/types";
import { Countdown } from "./Countdown";
import { EndlessGameOver } from "./EndlessGameOver";

const CONTEXT = { words: [], pool: ALL_WORDS, random: Math.random };
const TIMEOUT_HEADLINE = "⏰ Tiden tog slut!";

function EndlessHeader({ state }: { state: EndlessState }) {
  return (
    <div className="flex items-center gap-4">
      <Link href="/" aria-label="Avsluta" className="text-3xl font-black text-hare">
        ✕
      </Link>
      <span className="text-2xl tracking-tight">
        {Array.from({ length: START_LIVES }, (_, index) => (index < state.lives ? "❤️" : "🤍")).join("")}
      </span>
      <span className="ml-auto text-2xl font-black text-fox">⭐ {state.score}</span>
    </div>
  );
}

export function EndlessGame({ onRestart }: { onRestart: () => void }) {
  const { progress } = useAccount();
  const [state, setState] = useState(() =>
    startEndless(nextEndlessExercise({ pendingReviews: progress.pendingReviews, previousWordId: null }, CONTEXT)),
  );

  if (isEndlessOver(state) && !state.lastOutcome) return <EndlessGameOver state={state} onRestart={onRestart} />;

  function handleSubmit(outcome: ExerciseOutcome) {
    const next = answerEndless(state, outcome);
    const correct = isOutcomeCorrect(outcome);
    if (correct) playCorrect();
    else playWrong();
    if (correct && comboCheer(next.combo)) smallBurst();
    setState(next);
  }

  function handleTimeout() {
    const wordId = exerciseWordId(state.exercise) ?? "";
    handleSubmit({ events: [{ wordId, correct: false }], solution: solutionFor(state.exercise), timedOut: true });
  }

  function handleContinue() {
    if (isEndlessOver(state)) return setState({ ...state, lastOutcome: null });
    const pick = { pendingReviews: progress.pendingReviews, previousWordId: exerciseWordId(state.exercise) };
    setState(nextEndlessRound(state, nextEndlessExercise(pick, CONTEXT)));
  }

  const outcome = state.lastOutcome;
  return (
    <div className="flex min-h-dvh flex-col pb-48">
      <header className="mx-auto flex w-full max-w-xl flex-col gap-3 px-4 pt-5">
        <EndlessHeader state={state} />
        <Countdown key={state.round} seconds={secondsFor(state.score)} paused={outcome !== null} onTimeout={handleTimeout} />
      </header>
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
        <ExerciseView key={state.round} exercise={state.exercise} locked={outcome !== null} onSubmit={handleSubmit} />
      </main>
      {outcome && (
        <FeedbackBar
          key={state.round}
          correct={isOutcomeCorrect(outcome)}
          solution={outcome.solution}
          combo={state.combo}
          headline={outcome.timedOut ? TIMEOUT_HEADLINE : undefined}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
