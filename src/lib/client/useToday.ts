import { useState } from "react";
import { dayKey } from "@/lib/days";

export function useToday(): string {
  const [today] = useState(() => dayKey(new Date()));
  return today;
}
