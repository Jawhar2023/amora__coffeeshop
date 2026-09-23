import { readKey, writeKey, StorageKeys, uid } from './storageService';
import type { Customer } from '@/types';

const GUEST_ID_KEY = 'guestCustomerId';

export const CustomerRepository = {
  getAll(): Customer[] {
    return readKey<Customer[]>(StorageKeys.customers, []);
  },
  getById(id: string): Customer | undefined {
    return this.getAll().find((c) => c.id === id);
  },
  save(all: Customer[]): void {
    writeKey(StorageKeys.customers, all);
  },
  getOrCreateGuest(): Customer {
    const existingId = readKey<string | null>(GUEST_ID_KEY, null);
    if (existingId) {
      const found = this.getById(existingId);
      if (found) return found;
    }
    const customer: Customer = {
      id: uid('cust'),
      totalOrders: 0,
      totalSpending: 0,
      favoriteProductIds: [],
      createdAt: new Date().toISOString(),
    };
    this.save([...this.getAll(), customer]);
    writeKey(GUEST_ID_KEY, customer.id);
    return customer;
  },
  recordOrder(customerId: string, orderTotal: number): void {
    this.save(
      this.getAll().map((c) =>
        c.id === customerId
          ? {
              ...c,
              totalOrders: c.totalOrders + 1,
              totalSpending: c.totalSpending + orderTotal,
              lastOrderAt: new Date().toISOString(),
            }
          : c
      )
    );
  },
  update(id: string, patch: Partial<Customer>): void {
    this.save(this.getAll().map((c) => (c.id === id ? { ...c, ...patch } : c)));
  },
};
