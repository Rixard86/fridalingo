"use client";

import { useRouter } from "next/navigation";
import { Fragment, type ReactNode } from "react";
import { Goose } from "./goose/Goose";
import { LoginScreen } from "./LoginScreen";
import { useProgressContext } from "./ProgressProvider";

export function LoadingScreen() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <Goose className="w-32 animate-goose-bob" />
      <p className="text-lg font-extrabold text-hare">Laddar…</p>
    </div>
  );
}

export function RequireLogin({ children }: { children: ReactNode }) {
  const { session } = useProgressContext();
  const { bfcacheId } = useRouter();
  if (session.status === "loading") return <LoadingScreen />;
  if (session.status === "loggedOut") return <LoginScreen />;
  return <Fragment key={bfcacheId}>{children}</Fragment>;
}
