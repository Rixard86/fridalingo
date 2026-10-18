"use client";

import { useEffect, useState } from "react";
import { COMFORT, comboCheer, PRAISE, pickOne } from "@/lib/messages";

interface FeedbackBarProps {
  correct: boolean;
  solution: string;
  combo: number;
  onContinue: () => void;
}

function useEnterToContinue(onContinue: () => void) {
  useEffect(() => {
    const mountedAt = performance.now();
    function handleKey(event: KeyboardEvent) {
      const isFreshEnter = event.key === "Enter" && !event.repeat && event.timeStamp > mountedAt;
      if (isFreshEnter && !(event.target instanceof HTMLButtonElement)) onContinue();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onContinue]);
}

export function FeedbackBar({ correct, solution, combo, onContinue }: FeedbackBarProps) {
  const [headline] = useState(() => (correct ? comboCheer(combo) ?? pickOne(PRAISE) : pickOne(COMFORT)));
  useEnterToContinue(onContinue);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 animate-slide-up p-4 ${correct ? "bg-feather-light" : "bg-cardinal-light"}`}
      role="status"
    >
      <div className="mx-auto flex max-w-xl flex-col gap-3">
        <div className={correct ? "text-feather-dark" : "text-cardinal-dark"}>
          <p className="text-2xl font-black">
            {correct ? "✅" : "❌"} {headline}
          </p>
          {!correct && solution && (
            <p className="mt-1 text-lg font-bold">
              Rätt svar: <span className="font-black">{solution}</span>
            </p>
          )}
        </div>
        <button onClick={onContinue} className={`btn w-full ${correct ? "btn-green" : "btn-red"}`}>
          Fortsätt
        </button>
      </div>
    </div>
  );
}
