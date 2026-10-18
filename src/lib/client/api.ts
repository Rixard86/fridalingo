import type { Progress } from "@/lib/types";

export interface Account {
  name: string;
  progress: Progress;
}

export interface Credentials {
  name: string;
  password: string;
}

const JSON_HEADERS = { "Content-Type": "application/json" };
const FALLBACK_ERROR = "Något gick fel, försök igen";

export async function fetchAccount(): Promise<Account | null> {
  const response = await fetch("/api/progress", { cache: "no-store" }).catch(() => null);
  return response?.ok ? response.json() : null;
}

export type AuthMode = "login" | "signup";

export async function postCredentials(mode: AuthMode, credentials: Credentials): Promise<string | null> {
  const response = await fetch(`/api/${mode}`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(credentials),
  }).catch(() => null);
  if (response?.ok) return null;
  const body = await response?.json().catch(() => null);
  return body?.error ?? FALLBACK_ERROR;
}

export async function putProgress(progress: Progress): Promise<boolean> {
  const response = await fetch("/api/progress", {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify(progress),
  }).catch(() => null);
  return response?.ok ?? false;
}

export async function postLogout(): Promise<void> {
  await fetch("/api/logout", { method: "POST" }).catch(() => null);
}
