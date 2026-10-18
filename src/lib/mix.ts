import { buildLesson, pickReviewWords, type LessonContext } from "./lessons";
import { mixKind } from "./levels";
import { shuffle, type RandomSource } from "./random";
import type { Exercise, Week, Word } from "./types";

const MIX_WORD_COUNT = 12;
const MIX_SENTENCE_COUNT = 4;

export interface MixRequest {
  anchorWeek: number;
  number: number;
  pendingReviews: Record<string, number>;
  random: RandomSource;
}

export function mixPool(weeks: Week[], anchorWeek: number): Word[] {
  return weeks.filter((week) => week.week <= anchorWeek).flatMap((week) => week.words);
}

function mixWords(request: MixRequest, context: LessonContext): Word[] {
  if (mixKind(request.number) !== "meningar") {
    return pickReviewWords(request.pendingReviews, { ...context, count: MIX_WORD_COUNT });
  }
  const sentences = shuffle(
    context.pool.filter((word) => word.sentence),
    context.random,
  ).slice(0, MIX_SENTENCE_COUNT);
  const others = pickReviewWords(request.pendingReviews, {
    ...context,
    pool: context.pool.filter((word) => !sentences.includes(word)),
    count: MIX_WORD_COUNT - sentences.length,
  });
  return [...sentences, ...others];
}

export function buildMixLesson(request: MixRequest, weeks: Week[]): Exercise[] {
  const context: LessonContext = { words: [], pool: mixPool(weeks, request.anchorWeek), random: request.random };
  return buildLesson(mixKind(request.number), { ...context, words: mixWords(request, context) });
}
