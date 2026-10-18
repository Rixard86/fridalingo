import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const HASH = "sha256";
const ENCODING = "base64url";

function digest(text: string): Buffer {
  return createHash(HASH).update(text).digest();
}

export function safeEqual(given: string, expected: string): boolean {
  return timingSafeEqual(digest(given), digest(expected));
}

function signatureFor(name: string, secret: string): string {
  return createHmac(HASH, secret).update(name).digest(ENCODING);
}

export function signName(name: string, secret: string): string {
  return `${Buffer.from(name).toString(ENCODING)}.${signatureFor(name, secret)}`;
}

export function verifySignedName(token: string, secret: string): string | null {
  const [encodedName, signature] = token.split(".");
  if (!encodedName || !signature) return null;
  const name = Buffer.from(encodedName, ENCODING).toString();
  return safeEqual(signature, signatureFor(name, secret)) ? name : null;
}

export function profileKey(name: string): string {
  return name.trim().toLowerCase();
}
