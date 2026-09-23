import { readKey, writeKey, StorageKeys } from '@/services/storage/storageService';
import type { WaterSortProgress } from './types';

const DEFAULT_PROGRESS: WaterSortProgress = {
  currentLevel: 1,
  bestMoves: {},
  soundEnabled: true,
};

// Thin, namespaced wrapper around the app's shared LocalStorage utility —
// keeps Water Sort's save data isolated under its own key, never touching
// anything else the app has written to storage.
export const WaterSortProgressRepository = {
  get(): WaterSortProgress {
    return readKey<WaterSortProgress>(StorageKeys.waterSortProgress, DEFAULT_PROGRESS);
  },
  save(progress: WaterSortProgress): void {
    writeKey(StorageKeys.waterSortProgress, progress);
  },
  setCurrentLevel(level: number): void {
    const progress = this.get();
    this.save({ ...progress, currentLevel: level });
  },
  recordBestMoves(level: number, moves: number): void {
    const progress = this.get();
    const existing = progress.bestMoves[level];
    if (existing !== undefined && existing <= moves) return;
    this.save({ ...progress, bestMoves: { ...progress.bestMoves, [level]: moves } });
  },
  setSoundEnabled(enabled: boolean): void {
    const progress = this.get();
    this.save({ ...progress, soundEnabled: enabled });
  },
};
