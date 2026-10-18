"use client";

import { useEffect, useRef, useState } from "react";
import { answersFor, isAcceptedAnswer, promptFor, sentenceParts, solutionFor } from "@/lib/answers";
import { speak } from "@/lib/client/speech";
import type { Exercise } from "@/lib/types";
import { CheckBar, ExerciseTitle, SpeakButton, type ExerciseProps } from "./shared";

type WriteKind = "write" | "listen" | "sentence";
type WritingExercise = Extract<Exercise, { kind: WriteKind }>;

function expectedAnswers(exercise: WritingExercise): string[] {
  return exercise.kind === "write" ? answersFor(exercise.word, exercise.direction) : exercise.word.en;
}

function SentencePrompt({ exercise }: { exercise: WritingExercise }) {
  const sentence = exercise.word.sentence;
  if (!sentence) return null;
  const [before, after] = sentenceParts(sentence.en);
  return (
    <div className="mb-6">
      <p className="text-2xl font-black">
        {before}
        <span className="mx-1 inline-block w-24 border-b-4 border-sky align-bottom" />
        {after}
      </p>
      <p className="mt-3 font-bold text-wolf">{sentence.sv}</p>
    </div>
  );
}

function WritePrompt({ exercise }: { exercise: WritingExercise }) {
  if (exercise.kind === "sentence") return <SentencePrompt exercise={exercise} />;
  if (exercise.kind === "listen") {
    return (
      <div className="mb-6 flex items-center gap-3">
        <SpeakButton text={exercise.word.en[0]} />
        <SpeakButton text={exercise.word.en[0]} slow />
      </div>
    );
  }
  return (
    <div className="mb-6 flex items-center gap-4">
      {exercise.direction === "en-sv" && <SpeakButton text={exercise.word.en[0]} />}
      <p className="text-3xl font-black">{promptFor(exercise.word, exercise.direction)}</p>
    </div>
  );
}

const TITLES: Record<string, string> = {
  "write-sv-en": "Skriv på engelska",
  "write-en-sv": "Skriv på svenska",
  listen: "Skriv det du hör",
  sentence: "Fyll i det som fattas",
};

function titleFor(exercise: WritingExercise): string {
  return TITLES[exercise.kind === "write" ? `write-${exercise.direction}` : exercise.kind];
}

export function WriteExercise({ exercise, locked, onSubmit }: ExerciseProps<WriteKind>) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const answerInEnglish = exercise.kind !== "write" || exercise.direction === "sv-en";

  useEffect(() => {
    inputRef.current?.focus();
    if (exercise.kind === "listen") speak(exercise.word.en[0]);
  }, [exercise]);

  function check() {
    if (!text.trim() || locked) return;
    const correct = isAcceptedAnswer(text, expectedAnswers(exercise));
    onSubmit({ events: [{ wordId: exercise.word.id, correct }], solution: solutionFor(exercise) });
  }

  return (
    <div>
      <ExerciseTitle>{titleFor(exercise)}</ExerciseTitle>
      <WritePrompt exercise={exercise} />
      <input
        ref={inputRef}
        className="field"
        value={text}
        disabled={locked}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => event.key === "Enter" && check()}
        placeholder={answerInEnglish ? "Skriv på engelska…" : "Skriv på svenska…"}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        lang={answerInEnglish ? "en" : "sv"}
      />
      {!locked && <CheckBar disabled={!text.trim()} onCheck={check} />}
    </div>
  );
}
