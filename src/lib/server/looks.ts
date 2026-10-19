import { SCARF_ID } from "@/lib/outfits";
import { redisClient } from "./redis";

const LOOKS_KEY = "lb:looks";
const NO_LOOK = "ingen";

const memoryLooks = new Map<string, string>();

function decode(stored: unknown): string | null {
  if (typeof stored !== "string") return SCARF_ID;
  return stored === NO_LOOK ? null : stored;
}

export async function saveLook(profile: string, look: string | null): Promise<void> {
  const stored = look ?? NO_LOOK;
  const redis = redisClient();
  if (!redis) return void memoryLooks.set(profile, stored);
  await redis.hset(LOOKS_KEY, { [profile]: stored });
}

export async function loadLooks(profiles: string[]): Promise<(string | null)[]> {
  const redis = redisClient();
  if (!redis) return profiles.map((profile) => decode(memoryLooks.get(profile)));
  if (profiles.length === 0) return [];
  const stored = await redis.hmget<Record<string, string>>(LOOKS_KEY, ...profiles);
  return profiles.map((profile) => decode(stored?.[profile]));
}
