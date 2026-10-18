import { BOARDS, type Board } from "@/lib/scores";
import { leaderboard } from "@/lib/server/leaderboard";
import { HTTP_BAD_REQUEST, HTTP_UNAUTHORIZED, readSessionName } from "@/lib/server/session";
import { profileKey } from "@/lib/server/signing";

function isBoard(value: string | null): value is Board {
  return value !== null && (BOARDS as string[]).includes(value);
}

export async function GET(request: Request) {
  const name = await readSessionName();
  if (!name) return Response.json({ error: "Inte inloggad" }, { status: HTTP_UNAUTHORIZED });
  const board = new URL(request.url).searchParams.get("board");
  if (!isBoard(board)) return Response.json({ error: "Okänd topplista" }, { status: HTTP_BAD_REQUEST });
  return Response.json(await leaderboard(board, profileKey(name)));
}
