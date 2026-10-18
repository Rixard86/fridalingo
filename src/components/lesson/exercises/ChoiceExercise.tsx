"use client";

import { useState } from "react";
import { answersFor, isAcceptedAnswer, promptFor } from "@/lib/answers";
import { speak } from "@/lib/client/speech";
import { CheckBar, ExerciseTitle, SpeakButton, type ExerciseProps } from "./shared";

export function ChoiceExercise({ exercise, locked, onSubmit }: ExerciseProps<"choice">) {
  const [selected, setSelected] = useState<string | null>(null);
  const { word, direction, options } = exercise;
  const answers = answersFor(word, direction);
  const englishOptions = direction === "sv-en";

  function tileClass(option: string): string {
    if (locked && isAcceptedAnswer(option, answers)) return "tile-correct";
    if (locked && option === selected) return "tile-wrong";
    return option === selected ? "tile-selected" : "";
  }

  function choose(option: string) {
    setSelected(option);
    if (englishOptions) speak(option);
  }

  function check() {
    if (!selected) return;
    onSubmit({ events: [{ wordId: word.id, correct: isAcceptedAnswer(selected, answers) }], solution: answers[0] });
  }

  return (
    <div>
      <ExerciseTitle>{englishOptions ? "Hur säger man på engelska?" : "Vad betyder ordet?"}</ExerciseTitle>
      <div className="mb-8 flex items-center gap-4">
        {!englishOptions && <SpeakButton text={word.en[0]} />}
        <p className="text-3xl font-black">{promptFor(word, direction)}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <button key={option} disabled={locked} onClick={() => choose(option)} className={`tile text-left ${tileClass(option)}`}>
            {option}
          </button>
        ))}
      </div>
      {!locked && <CheckBar disabled={!selected} onCheck={check} />}
    </div>
  );
}
