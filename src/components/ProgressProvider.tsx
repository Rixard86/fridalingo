"use client";

import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  fetchAccount,
  postCredentials,
  postLogout,
  putProgress,
  type Account,
  type AuthMode,
  type Credentials,
} from "@/lib/client/api";
import type { Progress } from "@/lib/types";

type Session =
  | { status: "loading" }
  | { status: "loggedOut" }
  | { status: "ready"; name: string; progress: Progress; saveFailed: boolean };

interface ProgressContextValue {
  session: Session;
  authenticate: (mode: AuthMode, credentials: Credentials) => Promise<string | null>;
  logout: () => Promise<void>;
  updateProgress: (progress: Progress) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function sessionFrom(account: Account | null): Session {
  return account ? { status: "ready", ...account, saveFailed: false } : { status: "loggedOut" };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>({ status: "loading" });

  useEffect(() => {
    let active = true;
    void fetchAccount().then((account) => {
      if (active) setSession(sessionFrom(account));
    });
    return () => {
      active = false;
    };
  }, []);

  const authenticate = useCallback(async (mode: AuthMode, credentials: Credentials) => {
    const error = await postCredentials(mode, credentials);
    if (!error) setSession(sessionFrom(await fetchAccount()));
    return error;
  }, []);

  const logout = useCallback(async () => {
    await postLogout();
    setSession({ status: "loggedOut" });
  }, []);

  const updateProgress = useCallback(async (progress: Progress) => {
    setSession((current) => (current.status === "ready" ? { ...current, progress } : current));
    const saved = await putProgress(progress);
    setSession((current) => (current.status === "ready" ? { ...current, saveFailed: !saved } : current));
  }, []);

  const value = useMemo(
    () => ({ session, authenticate, logout, updateProgress }),
    [session, authenticate, logout, updateProgress],
  );
  return <ProgressContext value={value}>{children}</ProgressContext>;
}

export function useProgressContext(): ProgressContextValue {
  const context = use(ProgressContext);
  if (!context) throw new Error("useProgressContext måste användas inuti ProgressProvider");
  return context;
}

export function useAccount() {
  const { session, logout, updateProgress } = useProgressContext();
  if (session.status !== "ready") throw new Error("useAccount kräver inloggning");
  return { name: session.name, progress: session.progress, saveFailed: session.saveFailed, logout, updateProgress };
}
