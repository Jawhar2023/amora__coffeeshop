import { readKey, writeKey, StorageKeys } from './storageService';

export const FavoritesRepository = {
  getAll(): string[] {
    return readKey<string[]>(StorageKeys.favorites, []);
  },
  isFavorite(productId: string): boolean {
    return this.getAll().includes(productId);
  },
  toggle(productId: string): string[] {
    const all = this.getAll();
    const next = all.includes(productId)
      ? all.filter((id) => id !== productId)
      : [...all, productId];
    writeKey(StorageKeys.favorites, next);
    return next;
  },
};

const MAX_RECENT = 10;

export const RecentlyViewedRepository = {
  getAll(): string[] {
    return readKey<string[]>(StorageKeys.recentlyViewed, []);
  },
  add(productId: string): void {
    const all = this.getAll().filter((id) => id !== productId);
    all.unshift(productId);
    writeKey(StorageKeys.recentlyViewed, all.slice(0, MAX_RECENT));
  },
};
