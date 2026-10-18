export interface WorldTheme {
  name: string;
  emoji: string;
  skyTop: string;
  skyBottom: string;
  node: string;
  nodeDark: string;
  decor: string[];
}

export const WORLD_THEMES: WorldTheme[] = [
  { name: "Godislandet", emoji: "🍭", skyTop: "#ffe3f1", skyBottom: "#ffc2df", node: "#ff5fa8", nodeDark: "#d93d86", decor: ["🍭", "🍬", "🧁", "🍩"] },
  { name: "Trollskogen", emoji: "🌲", skyTop: "#e4f9d6", skyBottom: "#b9eb9b", node: "#3fb950", nodeDark: "#2c8a3a", decor: ["🌲", "🍄", "🌳", "🦔"] },
  { name: "Pärlhavet", emoji: "🏝️", skyTop: "#dff6ff", skyBottom: "#a8e3fb", node: "#1cb0f6", nodeDark: "#1488c2", decor: ["🐠", "🐚", "🌴", "🐙"] },
  { name: "Fjällriket", emoji: "🏔️", skyTop: "#f1f5ff", skyBottom: "#d3defa", node: "#6c8cff", nodeDark: "#4a67d6", decor: ["⛄", "🏔️", "❄️", "🦌"] },
  { name: "Ökenriket", emoji: "🏜️", skyTop: "#fff6e0", skyBottom: "#ffe0a3", node: "#ff9600", nodeDark: "#d17800", decor: ["🌵", "🐪", "☀️", "🦂"] },
  { name: "Vulkanön", emoji: "🌋", skyTop: "#ffe8df", skyBottom: "#ffc4ad", node: "#ff4b4b", nodeDark: "#d23232", decor: ["🌋", "🦖", "🔥", "🦕"] },
  { name: "Rymden", emoji: "🚀", skyTop: "#5a48a8", skyBottom: "#2c2160", node: "#ce82ff", nodeDark: "#9a4fd6", decor: ["🪐", "⭐", "🚀", "🌙"] },
];

export function themeFor(worldIndex: number): WorldTheme {
  return WORLD_THEMES[worldIndex % WORLD_THEMES.length];
}
