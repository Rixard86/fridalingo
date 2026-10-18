import { progressSchema } from "@/lib/schemas";
import { HTTP_BAD_REQUEST, HTTP_UNAUTHORIZED, readSessionName } from "@/lib/server/session";
import { profileKey } from "@/lib/server/signing";
import { loadProgress, saveProgress } from "@/lib/server/store";

function unauthorized() {
  return Response.json({ error: "Inte inloggad" }, { status: HTTP_UNAUTHORIZED });
}

export async function GET() {
  const name = await readSessionName();
  if (!name) return unauthorized();
  return Response.json({ name, progress: await loadProgress(profileKey(name)) });
}

export async function PUT(request: Request) {
  const name = await readSessionName();
  if (!name) return unauthorized();
  const parsed = progressSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Ogiltiga framsteg" }, { status: HTTP_BAD_REQUEST });
  }
  await saveProgress(profileKey(name), parsed.data);
  return Response.json({ ok: true });
}
