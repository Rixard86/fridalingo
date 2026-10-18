import { progressSchema } from "@/lib/schemas";
import { scoresFor } from "@/lib/scores";
import { saveScores } from "@/lib/server/leaderboard";
import { HTTP_BAD_REQUEST, HTTP_UNAUTHORIZED, readSessionName } from "@/lib/server/session";
import { profileKey } from "@/lib/server/signing";
import { loadProgress, loadUser, saveProgress } from "@/lib/server/store";

function unauthorized() {
  return Response.json({ error: "Inte inloggad" }, { status: HTTP_UNAUTHORIZED });
}

async function currentUserName(): Promise<string | null> {
  const name = await readSessionName();
  return name && (await loadUser(profileKey(name))) ? name : null;
}

export async function GET() {
  const name = await currentUserName();
  if (!name) return unauthorized();
  const progress = await loadProgress(profileKey(name));
  await saveScores(profileKey(name), scoresFor(progress));
  return Response.json({ name, progress });
}

export async function PUT(request: Request) {
  const name = await currentUserName();
  if (!name) return unauthorized();
  const parsed = progressSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Ogiltiga framsteg" }, { status: HTTP_BAD_REQUEST });
  }
  await saveProgress(profileKey(name), parsed.data);
  await saveScores(profileKey(name), scoresFor(parsed.data));
  return Response.json({ ok: true });
}
