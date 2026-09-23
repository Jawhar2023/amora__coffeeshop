import { readKey, writeKey, StorageKeys } from './storageService';
import type { GameConfig, GameScore, QuizQuestion, ReviewTracking } from '@/types';

export const GameRepository = {
  getAll(): GameConfig[] {
    return readKey<GameConfig[]>(StorageKeys.games, []).sort((a, b) => a.order - b.order);
  },
  save(all: GameConfig[]): void {
    writeKey(StorageKeys.games, all);
  },
  update(id: string, patch: Partial<GameConfig>): void {
    this.save(this.getAll().map((g) => (g.id === id ? { ...g, ...patch } : g)));
  },
};

export const GameScoreRepository = {
  getAll(): GameScore[] {
    return readKey<GameScore[]>(StorageKeys.gameScores, []);
  },
  getBest(gameId: string): number {
    const scores = this.getAll().filter((s) => s.gameId === gameId);
    if (scores.length === 0) return 0;
    return Math.max(...scores.map((s) => s.score));
  },
  getBestReactionMs(): number {
    const scores = this.getAll().filter((s) => s.gameId === 'reaction' && s.score > 0);
    if (scores.length === 0) return 0;
    return Math.min(...scores.map((s) => s.score));
  },
  record(gameId: string, score: number): void {
    const all = this.getAll();
    all.push({ gameId, score, playedAt: new Date().toISOString() });
    writeKey(StorageKeys.gameScores, all);
  },
};

export const QuizRepository = {
  getAll(): QuizQuestion[] {
    return readKey<QuizQuestion[]>(StorageKeys.quizQuestions, []);
  },
  save(all: QuizQuestion[]): void {
    writeKey(StorageKeys.quizQuestions, all);
  },
};

export const ReviewTrackingRepository = {
  get(): ReviewTracking {
    return readKey<ReviewTracking>(StorageKeys.reviewTracking, {
      ctaShown: 0,
      ctaClicked: 0,
      gameLosses: 0,
    });
  },
  recordGameLoss(): void {
    const t = this.get();
    writeKey(StorageKeys.reviewTracking, { ...t, gameLosses: t.gameLosses + 1 });
  },
  recordCtaShown(): void {
    const t = this.get();
    writeKey(StorageKeys.reviewTracking, { ...t, ctaShown: t.ctaShown + 1 });
  },
  recordCtaClicked(): void {
    const t = this.get();
    writeKey(StorageKeys.reviewTracking, { ...t, ctaClicked: t.ctaClicked + 1 });
  },
};
