import { loginSchema } from "@/lib/schemas";
import { verifyPassword } from "@/lib/server/passwords";
import { HTTP_BAD_REQUEST, HTTP_UNAUTHORIZED, startSession } from "@/lib/server/session";
import { profileKey } from "@/lib/server/signing";
import { loadUser } from "@/lib/server/store";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: HTTP_BAD_REQUEST });
  }
  const user = await loadUser(profileKey(parsed.data.name));
  if (!user || !(await verifyPassword(parsed.data.password, user))) {
    return Response.json({ error: "Fel användarnamn eller lösenord" }, { status: HTTP_UNAUTHORIZED });
  }
  await startSession(user.name);
  return Response.json({ name: user.name });
}
