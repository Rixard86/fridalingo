"use client";

import { useState } from "react";
import { BadgesTab } from "./BadgesTab";
import { EndlessTab } from "./EndlessTab";
import { LeaderboardTab } from "./LeaderboardTab";
import { LearnTab } from "./LearnTab";
import { StatsBar } from "./StatsBar";
import { WardrobeTab } from "./WardrobeTab";

type TabId = "learn" | "endless" | "top" | "badges" | "goose";

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: "learn", icon: "🗺️", label: "Karta" },
  { id: "endless", icon: "♾️", label: "Endless" },
  { id: "top", icon: "🏆", label: "Topp" },
  { id: "badges", icon: "🏅", label: "Märken" },
  { id: "goose", icon: "🪿", label: "Gåsen" },
];

const TAB_CONTENT: Record<TabId, () => React.JSX.Element> = {
  learn: LearnTab,
  endless: EndlessTab,
  top: LeaderboardTab,
  badges: BadgesTab,
  goose: WardrobeTab,
};

export function HomeScreen() {
  const [tab, setTab] = useState<TabId>("learn");
  const Content = TAB_CONTENT[tab];
  return (
    <div className="flex min-h-dvh flex-col pb-24">
      <StatsBar />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
        <Content />
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-swan bg-white">
        <div className="mx-auto flex max-w-xl justify-around py-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex flex-col items-center rounded-2xl border-2 px-2 py-1 font-extrabold ${
                tab === item.id ? "border-sky bg-sky-light text-sky-dark" : "border-transparent text-hare"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs uppercase">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
