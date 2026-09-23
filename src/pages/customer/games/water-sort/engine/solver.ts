import type { Tube } from '../types';
import { canPour, isSolved, pour } from './gameLogic';

function serialize(tubes: Tube[]): string {
  return tubes.map((t) => t.layers.join('.')).join('|');
}

/**
 * Breadth-first search for the shortest legal-move solution, bounded by a
 * node budget so it stays fast on small/medium boards and bails out
 * cleanly (returns null = "unknown", not "unsolvable") on larger ones —
 * callers should fall back to a heuristic target in that case.
 */
export function findShortestSolutionLength(start: Tube[], maxStates = 12000): number | null {
  if (isSolved(start)) return 0;

  const seen = new Set<string>([serialize(start)]);
  let frontier: Tube[][] = [start];
  let depth = 0;
  let explored = 0;

  while (frontier.length > 0) {
    depth++;
    const next: Tube[][] = [];

    for (const state of frontier) {
      for (const source of state) {
        for (const destination of state) {
          if (canPour(source, destination) <= 0) continue;
          const result = pour(state, source.id, destination.id);
          const key = serialize(result.tubes);
          if (seen.has(key)) continue;
          seen.add(key);
          explored++;

          if (isSolved(result.tubes)) return depth;
          next.push(result.tubes);

          if (explored >= maxStates) return null;
        }
      }
    }

    frontier = next;
  }

  return null;
}
