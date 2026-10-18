"use client";

import Link from "next/link";
import { Goose } from "@/components/goose/Goose";
import { useAccount } from "@/components/ProgressProvider";
import { START_LIVES } from "@/lib/endless";
import { wornLook } from "@/lib/outfits";

export function EndlessTab() {
  const { progress } = useAccount();
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <Goose mood="cheer" look={wornLook(progress)} className="w-36 animate-goose-jump" />
      <h2 className="text-4xl font-black text-fox">♾️ Endless</h2>
      <p className="text-lg font-bold text-wolf">
        Svara på ord efter ord från alla veckor. Du har {START_LIVES} hjärtan och tiden går fortare ju bättre det går!
      </p>
      <div className="w-full rounded-3xl border-2 border-b-4 border-bee bg-bee-light p-4">
        <p className="text-sm font-black tracking-wide text-bee-dark uppercase">Ditt rekord</p>
        <p className="text-5xl font-black">⭐ {progress.endlessRecord}</p>
      </div>
      <Link href="/endless" className="btn btn-green w-full text-lg">
        Starta
      </Link>
    </div>
  );
}
