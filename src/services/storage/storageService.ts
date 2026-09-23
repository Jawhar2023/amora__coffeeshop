// Generic, type-safe LocalStorage abstraction. All repositories build on this
// so no component ever touches window.localStorage directly.

const PREFIX = 'flavorlab:';

export function readKey<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeKey<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode, quota) — fail silently, app still works in-memory for the session
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}

export function clearAll(): void {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

export const StorageKeys = {
  categories: 'categories',
  products: 'products',
  addOnGroups: 'addOnGroups',
  promoCodes: 'promoCodes',
  orders: 'orders',
  orderSeq: 'orderSeq',
  customers: 'customers',
  games: 'games',
  gameScores: 'gameScores',
  quizQuestions: 'quizQuestions',
  reviewTracking: 'reviewTracking',
  settings: 'settings',
  favorites: 'favorites',
  recentlyViewed: 'recentlyViewed',
  language: 'language',
  adminAuth: 'adminAuth',
  seeded: 'seeded',
  seedVersion: 'seedVersion',
  currentOrderId: 'currentOrderId',
  reviewRewardCode: 'reviewRewardCode',
  waterSortProgress: 'waterSortProgress',
} as const;

export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}
