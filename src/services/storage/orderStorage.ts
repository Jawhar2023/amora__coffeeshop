import { readKey, writeKey, StorageKeys, uid } from './storageService';
import type { Order, OrderStatus, CartItem, PromoCode } from '@/types';
import { calcOrderTotals } from '@/services/calculations/order';

export const OrderRepository = {
  getAll(): Order[] {
    return readKey<Order[]>(StorageKeys.orders, []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  getById(id: string): Order | undefined {
    return this.getAll().find((o) => o.id === id);
  },
  save(all: Order[]): void {
    writeKey(StorageKeys.orders, all);
  },
  nextOrderNumber(): number {
    const seq = readKey<number>(StorageKeys.orderSeq, 1000);
    const next = seq + 1;
    writeKey(StorageKeys.orderSeq, next);
    return next;
  },
  create(items: CartItem[], promo?: PromoCode | null): Order {
    const totals = calcOrderTotals(items, promo);
    const now = new Date().toISOString();
    const order: Order = {
      id: uid('order'),
      orderNumber: this.nextOrderNumber(),
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        image: i.image,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        options: i.options,
        notes: i.notes,
        lineTotal:
          (i.unitPrice + i.options.reduce((s, o) => s + o.price, 0)) * i.quantity,
      })),
      subtotal: totals.subtotal,
      addonsTotal: totals.addonsTotal,
      discount: totals.discount,
      promoCode: promo?.code,
      total: totals.total,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    this.save([...this.getAll(), order]);
    return order;
  },
  updateStatus(id: string, status: OrderStatus): void {
    this.save(
      this.getAll().map((o) =>
        o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
      )
    );
  },
  remove(id: string): void {
    this.save(this.getAll().filter((o) => o.id !== id));
  },
};
