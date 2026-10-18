"use client";

import { useState } from "react";
import { EndlessGame } from "@/components/endless/EndlessGame";
import { RequireLogin } from "@/components/RequireLogin";

export default function EndlessPage() {
  const [game, setGame] = useState(0);
  return (
    <RequireLogin>
      <EndlessGame key={game} onRestart={() => setGame(game + 1)} />
    </RequireLogin>
  );
}
