function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Miljövariabeln ${name} saknas`);
  return value;
}

export function sessionSecret(): string {
  return requiredEnv("SESSION_SECRET");
}

export function familyPassword(): string {
  return requiredEnv("FAMILY_PASSWORD");
}

export function redisCredentials(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

export const isProduction = process.env.NODE_ENV === "production";
