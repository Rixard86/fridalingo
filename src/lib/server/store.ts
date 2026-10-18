import { Redis } from "@upstash/redis";
import { emptyProgress } from "@/lib/progress";
import type { Progress } from "@/lib/types";
import { isProduction, redisCredentials } from "./config";

interface ProgressStore {
  load: (profile: string) => Promise<Progress | null>;
  save: (profile: string, progress: Progress) => Promise<void>;
}

const memory = new Map<string, Progress>();

const memoryStore: ProgressStore = {
  load: async (profile) => memory.get(profile) ?? null,
  save: async (profile, progress) => {
    memory.set(profile, progress);
  },
};

function keyFor(profile: string): string {
  return `progress:${profile}`;
}

function redisStore(redis: Redis): ProgressStore {
  return {
    load: (profile) => redis.get<Progress>(keyFor(profile)),
    save: async (profile, progress) => {
      await redis.set(keyFor(profile), progress);
    },
  };
}

function progressStore(): ProgressStore {
  const credentials = redisCredentials();
  if (credentials) return redisStore(new Redis(credentials));
  if (isProduction) throw new Error("Databasen är inte kopplad: KV_REST_API_URL saknas");
  return memoryStore;
}

export async function loadProgress(profile: string): Promise<Progress> {
  const stored = await progressStore().load(profile);
  return { ...emptyProgress(), ...stored };
}

export async function saveProgress(profile: string, progress: Progress): Promise<void> {
  await progressStore().save(profile, progress);
}
