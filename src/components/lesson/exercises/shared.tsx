"use client";

import type { ReactNode } from "react";
import { speak } from "@/lib/client/speech";
import type { Exercise, ExerciseOutcome } from "@/lib/types";

export interface ExerciseProps<K extends Exercise["kind"]> {
  exercise: Extract<Exercise, { kind: K }>;
  locked: boolean;
  onSubmit: (outcome: ExerciseOutcome) => void;
}

export function ExerciseTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-6 text-2xl font-black">{children}</h2>;
}

export function SpeakButton({ text, slow = false }: { text: string; slow?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => speak(text, slow)}
      aria-label={slow ? "Lyssna långsamt" : "Lyssna"}
      className={`btn btn-blue shrink-0 ${slow ? "h-12 w-12 p-0 text-xl" : "h-16 w-16 p-0 text-3xl"}`}
    >
      {slow ? "🐢" : "🔊"}
    </button>
  );
}

export function CheckBar({ disabled, onCheck }: { disabled: boolean; onCheck: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 border-t-2 border-swan bg-white p-4">
      <div className="mx-auto max-w-xl">
        <button className="btn btn-green w-full" disabled={disabled} onClick={onCheck}>
          Kontrollera
        </button>
      </div>
    </div>
  );
}
