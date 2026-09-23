/**
 * 3-star rating relative to a per-level par (`targetMoves`). Without a full
 * solver we can't guarantee `targetMoves` is truly optimal, so it's a tuned
 * heuristic (see getLevelConfig) — good enough to reward efficient play
 * without punishing players for not finding the one perfect solution.
 */
export function calculateStars(moves: number, targetMoves: number): 1 | 2 | 3 {
  if (moves <= targetMoves + 2) return 3;
  if (moves <= targetMoves + 6) return 2;
  return 1;
}
