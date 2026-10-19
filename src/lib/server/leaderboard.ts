import type { Redis } from "@upstash/redis";
import { BOARDS, type Board } from "@/lib/scores";
import { loadLooks } from "./looks";
import { redisClient } from "./redis";
import { loadUser } from "./store";

export const LEADERBOARD_SIZE = 20;
const SCORE_PAIR = 2;

interface Ranked {
  profile: string;
  score: number;
}

export interface ScoreEntry {
  rank: number;
  name: string;
  score: number;
  isMe: boolean;
  look: string | null;
}

export interface Leaderboard {
  entries: ScoreEntry[];
  me: { rank: number; score: number } | null;
}

const memoryBoards = new Map<Board, Map<string, number>>(BOARDS.map((board) => [board, new Map()]));

function boardKey(board: Board): string {
  return `lb:${board}`;
}

function memoryRanking(board: Board): Ranked[] {
  return [...(memoryBoards.get(board) ?? new Map<string, number>()).entries()]
    .map(([profile, score]) => ({ profile, score }))
    .sort((a, b) => b.score - a.score || a.profile.localeCompare(b.profile));
}

async function redisTop(redis: Redis, board: Board): Promise<Ranked[]> {
  const raw = await redis.zrange<(string | number)[]>(boardKey(board), 0, LEADERBOARD_SIZE - 1, { rev: true, withScores: true });
  const ranked: Ranked[] = [];
  for (let index = 0; index < raw.length; index += SCORE_PAIR) ranked.push({ profile: String(raw[index]), score: Number(raw[index + 1]) });
  return ranked;
}

async function redisPosition(redis: Redis, ranking: { board: Board; profile: string }) {
  const key = boardKey(ranking.board);
  const [rank, score] = await Promise.all([redis.zrevrank(key, ranking.profile), redis.zscore(key, ranking.profile)]);
  return rank === null || score === null ? null : { rank: rank + 1, score: Number(score) };
}

export async function saveScores(profile: string, scores: Record<Board, number>): Promise<void> {
  const redis = redisClient();
  if (!redis) {
    for (const board of BOARDS) memoryBoards.get(board)?.set(profile, scores[board]);
    return;
  }
  await Promise.all(BOARDS.map((board) => redis.zadd(boardKey(board), { score: scores[board], member: profile })));
}

async function rankingFor(board: Board, profile: string): Promise<{ top: Ranked[]; me: Leaderboard["me"] }> {
  const redis = redisClient();
  if (redis) return { top: await redisTop(redis, board), me: await redisPosition(redis, { board, profile }) };
  const all = memoryRanking(board);
  const index = all.findIndex((entry) => entry.profile === profile);
  return { top: all.slice(0, LEADERBOARD_SIZE), me: index === -1 ? null : { rank: index + 1, score: all[index].score } };
}

export async function leaderboard(board: Board, profile: string): Promise<Leaderboard> {
  const { top, me } = await rankingFor(board, profile);
  const [users, looks] = await Promise.all([
    Promise.all(top.map((entry) => loadUser(entry.profile))),
    loadLooks(top.map((entry) => entry.profile)),
  ]);
  const entries = top.map((entry, index) => ({
    rank: index + 1,
    name: users[index]?.name ?? entry.profile,
    score: entry.score,
    isMe: entry.profile === profile,
    look: looks[index],
  }));
  return { entries, me };
}
