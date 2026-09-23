import { readKey, writeKey, StorageKeys, uid } from './storageService';
import type { PromoCode } from '@/types';

export const PromoRepository = {
  getAll(): PromoCode[] {
    return readKey<PromoCode[]>(StorageKeys.promoCodes, []);
  },
  getByCode(code: string): PromoCode | undefined {
    return this.getAll().find((p) => p.code.toLowerCase() === code.trim().toLowerCase());
  },
  save(all: PromoCode[]): void {
    writeKey(StorageKeys.promoCodes, all);
  },
  create(data: Omit<PromoCode, 'id' | 'usageCount'>): PromoCode {
    const item: PromoCode = { ...data, id: uid('promo'), usageCount: 0 };
    this.save([...this.getAll(), item]);
    return item;
  },
  update(id: string, patch: Partial<PromoCode>): void {
    this.save(this.getAll().map((p) => (p.id === id ? { ...p, ...patch } : p)));
  },
  remove(id: string): void {
    this.save(this.getAll().filter((p) => p.id !== id));
  },
  incrementUsage(id: string): void {
    this.save(
      this.getAll().map((p) => (p.id === id ? { ...p, usageCount: p.usageCount + 1 } : p))
    );
  },
  validate(code: string, orderBase: number): { valid: boolean; reason?: string; promo?: PromoCode } {
    const promo = this.getByCode(code);
    if (!promo) return { valid: false, reason: 'not_found' };
    if (!promo.active) return { valid: false, reason: 'inactive' };
    const now = Date.now();
    if (now < new Date(promo.startDate).getTime() || now > new Date(promo.endDate).getTime()) {
      return { valid: false, reason: 'expired' };
    }
    if (promo.usageCount >= promo.usageLimit) return { valid: false, reason: 'limit_reached' };
    if (orderBase < promo.minimumOrder) return { valid: false, reason: 'minimum_not_met' };
    return { valid: true, promo };
  },
};
