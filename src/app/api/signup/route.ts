import { signupSchema } from "@/lib/schemas";
import { hashPassword } from "@/lib/server/passwords";
import { HTTP_BAD_REQUEST, HTTP_CONFLICT, startSession } from "@/lib/server/session";
import { profileKey } from "@/lib/server/signing";
import { createUser } from "@/lib/server/store";

export async function POST(request: Request) {
  const parsed = signupSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: HTTP_BAD_REQUEST });
  }
  const { name, password } = parsed.data;
  const created = await createUser(profileKey(name), { name, ...(await hashPassword(password)) });
  if (!created) {
    return Response.json({ error: "Användarnamnet är redan taget. Välj ett annat!" }, { status: HTTP_CONFLICT });
  }
  await startSession(name);
  return Response.json({ name });
}
