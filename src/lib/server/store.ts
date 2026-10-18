import type { Redis } from "@upstash/redis";
import { emptyProgress } from "@/lib/progress";
import type { Progress } from "@/lib/types";
import type { PasswordRecord } from "./passwords";
import { redisClient } from "./redis";

export interface UserRecord extends PasswordRecord {
  name: string;
}

interface StoredProgress extends Partial<Progress> {
  outfit?: string | null;
}

interface Store {
  load: (profile: string) => Promise<StoredProgress | null>;
  save: (profile: string, progress: Progress) => Promise<void>;
  loadUser: (profile: string) => Promise<UserRecord | null>;
  createUser: (profile: string, user: UserRecord) => Promise<boolean>;
}

const memoryProgress = new Map<string, Progress>();
const memoryUsers = new Map<string, UserRecord>();

const memoryStore: Store = {
  load: async (profile) => memoryProgress.get(profile) ?? null,
  save: async (profile, progress) => {
    memoryProgress.set(profile, progress);
  },
  loadUser: async (profile) => memoryUsers.get(profile) ?? null,
  createUser: async (profile, user) => {
    if (memoryUsers.has(profile)) return false;
    memoryUsers.set(profile, user);
    return true;
  },
};

function progressKey(profile: string): string {
  return `progress:${profile}`;
}

function userKey(profile: string): string {
  return `user:${profile}`;
}

function redisStore(redis: Redis): Store {
  return {
    load: (profile) => redis.get<StoredProgress>(progressKey(profile)),
    save: async (profile, progress) => {
      await redis.set(progressKey(profile), progress);
    },
    loadUser: (profile) => redis.get<UserRecord>(userKey(profile)),
    createUser: async (profile, user) => (await redis.set(userKey(profile), user, { nx: true })) === "OK",
  };
}

function store(): Store {
  const redis = redisClient();
  return redis ? redisStore(redis) : memoryStore;
}

export function migrateProgress(stored: StoredProgress | null): Progress {
  const { outfit, ...rest } = stored ?? {};
  return { ...emptyProgress(), ...rest, outfits: rest.outfits ?? (outfit ? [outfit] : []) };
}

export async function loadProgress(profile: string): Promise<Progress> {
  return migrateProgress(await store().load(profile));
}

export async function saveProgress(profile: string, progress: Progress): Promise<void> {
  await store().save(profile, progress);
}

export async function loadUser(profile: string): Promise<UserRecord | null> {
  return store().loadUser(profile);
}

export async function createUser(profile: string, user: UserRecord): Promise<boolean> {
  return store().createUser(profile, user);
}
