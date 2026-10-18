"use client";

import { useState, type FormEvent } from "react";
import type { AuthMode } from "@/lib/client/api";
import { MAX_NAME_LENGTH, MIN_PASSWORD_LENGTH } from "@/lib/schemas";
import { Goose } from "./goose/Goose";
import { useProgressContext } from "./ProgressProvider";

const MODES: { id: AuthMode; label: string }[] = [
  { id: "login", label: "Logga in" },
  { id: "signup", label: "Ny spelare" },
];

interface AuthFormProps {
  mode: AuthMode;
  error: string | null;
  onError: (error: string | null) => void;
}

function AuthForm({ mode, error, onError }: AuthFormProps) {
  const { authenticate } = useProgressContext();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [busy, setBusy] = useState(false);
  const isSignup = mode === "signup";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isSignup && password !== repeat) return onError("Lösenorden är inte likadana");
    setBusy(true);
    onError(await authenticate(mode, { name, password }));
    setBusy(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
      <input className="field" placeholder={isSignup ? "Välj ett användarnamn" : "Användarnamn"} value={name} maxLength={MAX_NAME_LENGTH} onChange={(event) => setName(event.target.value)} autoComplete="username" />
      <input className="field" type="password" placeholder={isSignup ? `Välj ett lösenord (minst ${MIN_PASSWORD_LENGTH} tecken)` : "Lösenord"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isSignup ? "new-password" : "current-password"} />
      {isSignup && (
        <input className="field" type="password" placeholder="Skriv lösenordet igen" value={repeat} onChange={(event) => setRepeat(event.target.value)} autoComplete="new-password" />
      )}
      {error && <p className="text-center font-bold text-cardinal">{error}</p>}
      <button className="btn btn-green mt-2" disabled={busy || !name.trim() || !password || (isSignup && !repeat)}>
        {isSignup ? "Skapa konto" : "Kör igång!"}
      </button>
    </form>
  );
}

export function LoginScreen() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState<string | null>(null);

  function switchMode(next: AuthMode) {
    setMode(next);
    setError(null);
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-6 px-4 py-10">
      <Goose className="w-40 animate-goose-bob" mood={error ? "sad" : "happy"} />
      <div className="text-center">
        <h1 className="text-4xl font-black text-feather">fridalingo</h1>
        <p className="mt-2 font-bold text-wolf">Öva veckans glosor med gåsen!</p>
      </div>
      <div className="grid w-full grid-cols-2 gap-2">
        {MODES.map((item) => (
          <button key={item.id} type="button" onClick={() => switchMode(item.id)} className={`tile py-2 text-base ${mode === item.id ? "tile-selected" : ""}`}>
            {item.label}
          </button>
        ))}
      </div>
      <AuthForm key={mode} mode={mode} error={error} onError={setError} />
    </main>
  );
}
