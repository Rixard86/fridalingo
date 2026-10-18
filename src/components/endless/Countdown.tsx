"use client";

import { useEffect, useRef, useState } from "react";

const TICK_MS = 100;
const MS_PER_SECOND = 1000;
const PERCENT = 100;
const WARNING_RATIO = 0.3;

interface CountdownProps {
  seconds: number;
  paused: boolean;
  onTimeout: () => void;
}

export function Countdown({ seconds, paused, onTimeout }: CountdownProps) {
  const [remaining, setRemaining] = useState(1);
  const timeoutRef = useRef(onTimeout);

  useEffect(() => {
    timeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    if (paused) return;
    const startedAt = Date.now();
    const total = seconds * MS_PER_SECOND;
    const timer = setInterval(() => {
      const left = Math.max(0, 1 - (Date.now() - startedAt) / total);
      setRemaining(left);
      if (left === 0) {
        clearInterval(timer);
        timeoutRef.current();
      }
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [seconds, paused]);

  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-swan">
      <div
        className={`h-full rounded-full transition-[width] duration-100 ease-linear ${remaining < WARNING_RATIO ? "bg-cardinal" : "bg-fox"}`}
        style={{ width: `${remaining * PERCENT}%` }}
      />
    </div>
  );
}
