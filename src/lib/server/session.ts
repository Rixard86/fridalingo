import { cookies } from "next/headers";
import { isProduction, sessionSecret } from "./config";
import { signName, verifySignedName } from "./signing";

const SESSION_COOKIE = "fridalingo_session";
const ONE_YEAR_IN_SECONDS = 31_536_000;

export const HTTP_BAD_REQUEST = 400;
export const HTTP_UNAUTHORIZED = 401;
export const HTTP_CONFLICT = 409;

export async function readSessionName(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? verifySignedName(token, sessionSecret()) : null;
}

export async function startSession(name: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, signName(name, sessionSecret()), {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: ONE_YEAR_IN_SECONDS,
    path: "/",
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
