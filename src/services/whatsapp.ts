import type { Order, RestaurantSettings } from '@/types';
import { formatMoney } from '@/services/calculations/money';

export function buildOrderMessage(order: Order, settings: RestaurantSettings): string {
  const lines = [
    `🍽️ *New order* — ${settings.restaurantName}`,
    `Order #${order.orderNumber}`,
    '',
    ...order.items.map((item) => {
      const optionsText = item.options.length ? ` (${item.options.map((o) => o.optionName).join(', ')})` : '';
      const notesText = item.notes ? ` — "${item.notes}"` : '';
      return `• ${item.name} x${item.quantity}${optionsText}${notesText} — ${formatMoney(item.lineTotal)}`;
    }),
    '',
    `Subtotal: ${formatMoney(order.subtotal + order.addonsTotal)}`,
    order.discount > 0 ? `Discount: -${formatMoney(order.discount)}` : null,
    `*Total: ${formatMoney(order.total)}*`,
  ].filter((line): line is string => line !== null);

  return lines.join('\n');
}
