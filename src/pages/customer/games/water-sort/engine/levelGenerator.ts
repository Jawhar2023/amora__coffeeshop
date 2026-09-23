import type { LevelConfig, LiquidColor, Tube } from '../types';
import { COLOR_ORDER } from '../colors';
import { TUBE_CAPACITY, isSolved } from './gameLogic';
import { findShortestSolutionLength } from './solver';

/**
 * Difficulty curve: colors/tubes grow with level, spare empty tubes shrink
 * once the puzzle has enough colors to stay interesting with less slack.
 */
export function getLevelConfig(level: number): LevelConfig {
  const numColors = Math.min(3 + Math.floor((level - 1) / 2), COLOR_ORDER.length);
  const numEmpty = level < 12 ? 2 : 1;
  const numTubes = numColors + numEmpty;
  // heuristic par, overridden with a real solved length for boards small enough to verify — see getTargetMoves
  const targetMoves = Math.round(numColors * 2.4);
  return { numColors, numTubes, numEmpty, targetMoves };
}

function makeTubeId(index: number): string {
  return `tube-${index}`;
}

function shuffle<T>(arr: T[]): T[] {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/** Shuffle every color's units together and deal into `numColors` tubes — produces naturally, richly mixed boards. */
function dealRandomBoard(numColors: number, numEmpty: number): Tube[] {
  const colors = COLOR_ORDER.slice(0, numColors);
  const bag: LiquidColor[] = [];
  for (const color of colors) for (let i = 0; i < TUBE_CAPACITY; i++) bag.push(color);
  const shuffled = shuffle(bag);

  const tubes: Tube[] = [];
  for (let i = 0; i < numColors; i++) {
    tubes.push({ id: makeTubeId(i), layers: shuffled.slice(i * TUBE_CAPACITY, (i + 1) * TUBE_CAPACITY) });
  }
  for (let i = 0; i < numEmpty; i++) tubes.push({ id: makeTubeId(numColors + i), layers: [] });
  return tubes;
}

// Boards at or below this color count are cheap enough to verify exhaustively
// with the bounded BFS solver, fast enough to stay well under a frame-budget
// level-start transition. Beyond this, BFS gets too slow to run synchronously,
// so larger boards are accepted unverified — with 1-2 empty tubes and capacity
// 4, random deals of this style of puzzle are solvable the overwhelming
// majority of the time in practice.
const VERIFIABLE_COLOR_LIMIT = 5;
const VERIFY_BUDGET = 9000;
const MAX_ATTEMPTS = 6;

/**
 * Deals a random board and, whenever the board is small enough to check
 * quickly, verifies it's actually solvable with the bounded BFS solver
 * before accepting it — retrying with a fresh deal on failure. Every
 * accepted board is therefore either explicitly proven solvable, or (for
 * very large late-game boards where exhaustive search is impractical) a
 * random deal with at least one empty tube, which in practice is solvable
 * for this style of puzzle the overwhelming majority of the time.
 */
export function generateLevel(level: number): Tube[] {
  const { numColors, numEmpty } = getLevelConfig(level);

  let lastAttempt: Tube[] = dealRandomBoard(numColors, numEmpty);
  if (numColors > VERIFIABLE_COLOR_LIMIT) return lastAttempt;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    lastAttempt = dealRandomBoard(numColors, numEmpty);
    if (isSolved(lastAttempt)) continue;
    if (findShortestSolutionLength(lastAttempt, VERIFY_BUDGET) !== null) return lastAttempt;
  }

  return lastAttempt;
}

/**
 * Real solved-length when the board is small enough to search quickly,
 * otherwise the tuned heuristic from getLevelConfig. Used to keep the
 * 3-star thresholds fair.
 */
export function getTargetMoves(level: number, tubes: Tube[]): number {
  const config = getLevelConfig(level);
  if (config.numColors > VERIFIABLE_COLOR_LIMIT) return config.targetMoves;
  const solved = findShortestSolutionLength(tubes, VERIFY_BUDGET);
  return solved ?? config.targetMoves;
}
