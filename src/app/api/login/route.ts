import { loginSchema } from "@/lib/schemas";
import { familyPassword } from "@/lib/server/config";
import { HTTP_BAD_REQUEST, HTTP_UNAUTHORIZED, startSession } from "@/lib/server/session";
import { safeEqual } from "@/lib/server/signing";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Skriv ditt namn och lösenordet" }, { status: HTTP_BAD_REQUEST });
  }
  if (!safeEqual(parsed.data.password, familyPassword())) {
    return Response.json({ error: "Fel lösenord, försök igen!" }, { status: HTTP_UNAUTHORIZED });
  }
  await startSession(parsed.data.name);
  return Response.json({ name: parsed.data.name });
}
