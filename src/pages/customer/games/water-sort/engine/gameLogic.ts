import type { Tube } from '../types';

export const TUBE_CAPACITY = 4;

export function getTopColor(tube: Tube) {
  return tube.layers.length > 0 ? tube.layers[tube.layers.length - 1] : null;
}

/** how many consecutive layers of the same color sit on top of the tube */
export function getTopColorCount(tube: Tube): number {
  const top = getTopColor(tube);
  if (!top) return 0;
  let count = 0;
  for (let i = tube.layers.length - 1; i >= 0 && tube.layers[i] === top; i--) count++;
  return count;
}

export function getAvailableSpace(tube: Tube): number {
  return TUBE_CAPACITY - tube.layers.length;
}

export function cloneTubes(tubes: Tube[]): Tube[] {
  return tubes.map((t) => ({ id: t.id, layers: [...t.layers] }));
}

/**
 * How many layers would legally move from `source` into `destination`.
 * Returns 0 when the move is not allowed.
 */
export function canPour(source: Tube, destination: Tube): number {
  if (source.id === destination.id) return 0;
  if (source.layers.length === 0) return 0;

  const space = getAvailableSpace(destination);
  if (space <= 0) return 0;

  const sourceTop = getTopColor(source);
  const destTop = getTopColor(destination);
  if (destTop !== null && destTop !== sourceTop) return 0;

  return Math.min(getTopColorCount(source), space);
}

/** Pours as much as legally possible from source into destination. Returns new tube array (immutable) plus the amount moved. */
export function pour(tubes: Tube[], sourceId: string, destinationId: string): { tubes: Tube[]; amount: number; color: Tube['layers'][number] | null } {
  const source = tubes.find((t) => t.id === sourceId);
  const destination = tubes.find((t) => t.id === destinationId);
  if (!source || !destination) return { tubes, amount: 0, color: null };

  const amount = canPour(source, destination);
  if (amount <= 0) return { tubes, amount: 0, color: null };

  const color = getTopColor(source)!;
  const next = cloneTubes(tubes);
  const nextSource = next.find((t) => t.id === sourceId)!;
  const nextDestination = next.find((t) => t.id === destinationId)!;

  nextSource.layers.splice(nextSource.layers.length - amount, amount);
  for (let i = 0; i < amount; i++) nextDestination.layers.push(color);

  return { tubes: next, amount, color };
}

export function isTubeSolved(tube: Tube): boolean {
  if (tube.layers.length === 0) return true;
  if (tube.layers.length !== TUBE_CAPACITY) return false;
  const top = tube.layers[0];
  return tube.layers.every((c) => c === top);
}

export function isSolved(tubes: Tube[]): boolean {
  return tubes.every(isTubeSolved);
}
