"use client";

import { useState, type FormEvent } from "react";
import { Goose } from "./goose/Goose";
import { useProgressContext } from "./ProgressProvider";

export function LoginScreen() {
  const { login } = useProgressContext();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(await login({ name, password }));
    setBusy(false);
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-6 px-4 py-10">
      <Goose className="w-40 animate-goose-bob" mood={error ? "sad" : "happy"} />
      <div className="text-center">
        <h1 className="text-4xl font-black text-feather">fridalingo</h1>
        <p className="mt-2 font-bold text-wolf">Öva veckans glosor med gåsen!</p>
      </div>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
        <input
          className="field"
          placeholder="Ditt namn"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="username"
        />
        <input
          className="field"
          type="password"
          placeholder="Familjelösenord"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />
        {error && <p className="text-center font-bold text-cardinal">{error}</p>}
        <button className="btn btn-green mt-2" disabled={busy || !name.trim() || !password}>
          Kör igång!
        </button>
      </form>
    </main>
  );
}
