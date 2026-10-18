export type Ground = "hills" | "sea" | "snow" | "desert" | "volcano" | "space";
export type Particle = "sparkle" | "firefly" | "bubble" | "snow" | "sand" | "ember" | "star";

export interface WorldTheme {
  name: string;
  emoji: string;
  skyTop: string;
  skyBottom: string;
  node: string;
  nodeDark: string;
  layers: [string, string, string];
  ground: Ground;
  particle: Particle;
  props: string[];
  landmark: string;
  night: boolean;
}

export const WORLD_THEMES: WorldTheme[] = [
  {
    name: "Godislandet", emoji: "🍭", skyTop: "#ffe6f4", skyBottom: "#ffd0e8", node: "#ff5fa8", nodeDark: "#d93d86",
    layers: ["#e9d5ff", "#fbcfe8", "#a7f3d0"], ground: "hills", particle: "sparkle",
    props: ["🍭", "🍬", "🧁", "🍩", "🍫", "🍪", "🍦", "🎂"], landmark: "🏰", night: false,
  },
  {
    name: "Trollskogen", emoji: "🌲", skyTop: "#eafbdc", skyBottom: "#cdeeb4", node: "#3fb950", nodeDark: "#2c8a3a",
    layers: ["#b5e19c", "#82c96b", "#4fa64a"], ground: "hills", particle: "firefly",
    props: ["🌲", "🌳", "🍄", "🦔", "🦊", "🌿", "🐿️", "🌲"], landmark: "🏕️", night: false,
  },
  {
    name: "Pärlhavet", emoji: "🏝️", skyTop: "#e3f8ff", skyBottom: "#b8e8fb", node: "#1cb0f6", nodeDark: "#1488c2",
    layers: ["#9be1fb", "#5cc8f5", "#22a6e6"], ground: "sea", particle: "bubble",
    props: ["🐠", "🐚", "🐙", "🦀", "🐬", "🐳", "🪸", "🐡"], landmark: "🏝️", night: false,
  },
  {
    name: "Fjällriket", emoji: "🏔️", skyTop: "#f0f5ff", skyBottom: "#d6e2fa", node: "#6c8cff", nodeDark: "#4a67d6",
    layers: ["#b8c6f0", "#94a7e3", "#f4f7ff"], ground: "snow", particle: "snow",
    props: ["⛄", "🌲", "❄️", "🦌", "🐧", "🎿", "🛷", "🌲"], landmark: "🏔️", night: false,
  },
  {
    name: "Ökenriket", emoji: "🏜️", skyTop: "#fff8e6", skyBottom: "#ffe6b3", node: "#ff9600", nodeDark: "#d17800",
    layers: ["#fcd99a", "#f6c26e", "#eba84a"], ground: "desert", particle: "sand",
    props: ["🌵", "🐪", "🦂", "🐍", "🏺", "🌴", "🦎", "🌵"], landmark: "🐫", night: false,
  },
  {
    name: "Vulkanön", emoji: "🌋", skyTop: "#ffece4", skyBottom: "#ffc9b3", node: "#ff4b4b", nodeDark: "#d23232",
    layers: ["#b9a9a3", "#8f7d76", "#5f514c"], ground: "volcano", particle: "ember",
    props: ["🦖", "🦕", "🥚", "🌴", "🪨", "🦴", "🌿", "🦖"], landmark: "🌋", night: false,
  },
  {
    name: "Rymden", emoji: "🚀", skyTop: "#2a1f63", skyBottom: "#4b3c9e", node: "#ce82ff", nodeDark: "#9a4fd6",
    layers: ["#6a58c9", "#5444b5", "#3b2f8a"], ground: "space", particle: "star",
    props: ["🪐", "🚀", "🛸", "☄️", "👽", "🌙", "⭐", "🛰️"], landmark: "🪐", night: true,
  },
];

export function themeFor(worldIndex: number): WorldTheme {
  return WORLD_THEMES[worldIndex % WORLD_THEMES.length];
}

export function worldName(worldIndex: number): string {
  const lap = Math.floor(worldIndex / WORLD_THEMES.length) + 1;
  const name = themeFor(worldIndex).name;
  return lap > 1 ? `${name} ${lap}` : name;
}
