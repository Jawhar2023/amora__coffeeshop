import type { CartItem, PromoCode } from '@/types';
import { sumMoney, percentOf } from './money';

export interface OrderTotals {
  subtotal: number;
  addonsTotal: number;
  discount: number;
  total: number;
}

export function lineTotal(item: CartItem): number {
  const optionsTotal = sumMoney(item.options.map((o) => o.price));
  return sumMoney([item.unitPrice, optionsTotal]) * item.quantity;
}

export function calcSubtotal(items: CartItem[]): number {
  return sumMoney(items.map((i) => i.unitPrice * i.quantity));
}

export function calcAddonsTotal(items: CartItem[]): number {
  return sumMoney(
    items.flatMap((i) => i.options.map((o) => o.price * i.quantity))
  );
}

export function calcDiscount(
  baseAmount: number,
  promo: PromoCode | null | undefined
): number {
  if (!promo) return 0;
  if (baseAmount < promo.minimumOrder) return 0;
  let discount =
    promo.discountType === 'percentage'
      ? percentOf(baseAmount, promo.discountValue)
      : promo.discountValue;
  if (promo.maximumDiscount) discount = Math.min(discount, promo.maximumDiscount);
  return Math.min(discount, baseAmount);
}

export function calcOrderTotals(items: CartItem[], promo?: PromoCode | null): OrderTotals {
  const subtotal = calcSubtotal(items);
  const addonsTotal = calcAddonsTotal(items);
  const base = sumMoney([subtotal, addonsTotal]);
  const discount = calcDiscount(base, promo);
  const total = base - discount;
  return { subtotal, addonsTotal, discount, total };
}
