import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const ENCODING = "base64url";

export interface PasswordRecord {
  salt: string;
  hash: string;
}

function deriveKey(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (error, key) => (error ? reject(error) : resolve(key)));
  });
}

export async function hashPassword(password: string): Promise<PasswordRecord> {
  const salt = randomBytes(SALT_BYTES).toString(ENCODING);
  const hash = (await deriveKey(password, salt)).toString(ENCODING);
  return { salt, hash };
}

export async function verifyPassword(password: string, record: PasswordRecord): Promise<boolean> {
  const candidate = await deriveKey(password, record.salt);
  const expected = Buffer.from(record.hash, ENCODING);
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}
