import { Redis } from "@upstash/redis";
import { isProduction, redisCredentials } from "./config";

export function redisClient(): Redis | null {
  const credentials = redisCredentials();
  if (credentials) return new Redis(credentials);
  if (isProduction) throw new Error("Databasen är inte kopplad: KV_REST_API_URL saknas");
  return null;
}
