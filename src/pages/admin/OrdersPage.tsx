import { useMemo, useState } from 'react';
import { Search, Trash2, Eye, Copy, Check } from 'lucide-react';
import { OrderRepository } from '@/services/storage/orderStorage';
import { SettingsRepository } from '@/services/storage/settingsStorage';
import { formatMoney } from '@/services/calculations/money';
import { buildOrderMessage } from '@/services/whatsapp';
import type { Order, OrderStatus } from '@/types';
import PageHeader from '@/components/admin/PageHeader';
import { Select } from '@/components/ui/FormField';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import BottomSheet from '@/components/ui/BottomSheet';

const STATUSES: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'];

const STATUS_TONE: Record<OrderStatus, 'brand' | 'success' | 'warning' | 'danger' | 'neutral'> = {
  pending: 'warning',
  confirmed: 'neutral',
  preparing: 'brand',
  ready: 'success',
  served: 'success',
  cancelled: 'danger',
};

export default function OrdersPage() {
  const [refresh, setRefresh] = useState(0);
  const orders = useMemo(() => OrderRepository.getAll(), [refresh]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selected, setSelected] = useState<Order | null>(null);
  const [toDelete, setToDelete] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);
  const settings = SettingsRepository.get();

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (query && !String(o.orderNumber).includes(query)) return false;
    return true;
  });

  const updateStatus = (id: string, status: OrderStatus) => {
    OrderRepository.updateStatus(id, status);
    setRefresh((n) => n + 1);
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
  };

  const remove = (id: string) => {
    OrderRepository.remove(id);
    setRefresh((n) => n + 1);
    setToDelete(null);
  };

  const copyOrderText = async (order: Order) => {
    try {
      await navigator.clipboard.writeText(buildOrderMessage(order, settings));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — the text is still visible to copy manually
    }
  };

  return (
    <div>
      <PageHeader title="Orders" subtitle="Manage incoming and past orders" />

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order #"
            className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-400"
          />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')} className="w-44">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-card ring-1 ring-ink-100">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-xs font-semibold uppercase text-ink-400">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/50">
                <td className="px-4 py-3 font-bold text-ink-900">#{o.orderNumber}</td>
                <td className="px-4 py-3 text-ink-600">{o.items.length} items</td>
                <td className="px-4 py-3 font-semibold text-ink-900">{formatMoney(o.total)}</td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                    className="rounded-lg border border-ink-200 bg-white px-2 py-1 text-xs font-semibold"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-xs text-ink-400">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button onClick={() => setSelected(o)} className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => setToDelete(o)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-ink-400">
                  No orders yet. Orders will appear here once customers place them.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <BottomSheet open={!!selected} onClose={() => setSelected(null)} title={selected ? `Order #${selected.orderNumber}` : ''}>
        {selected && (
          <div className="px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-500">Status</span>
              <Badge tone={STATUS_TONE[selected.status]}>{selected.status}</Badge>
            </div>
            <div className="mt-4 divide-y divide-ink-100 border-t border-ink-100 pt-2">
              {selected.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <p className="font-semibold text-ink-800">
                      {item.name} × {item.quantity}
                    </p>
                    {item.options.length > 0 && (
                      <p className="text-xs text-ink-400">{item.options.map((o) => o.optionName).join(', ')}</p>
                    )}
                  </div>
                  <span className="font-semibold text-ink-900">{formatMoney(item.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1.5 border-t border-ink-100 pt-3 text-sm">
              <div className="flex justify-between"><span className="text-ink-500">Subtotal</span><span>{formatMoney(selected.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Discount</span><span>-{formatMoney(selected.discount)}</span></div>
              <div className="flex justify-between font-bold"><span>Total</span><span>{formatMoney(selected.total)}</span></div>
            </div>
            <p className="mt-3 text-xs text-ink-400">Created: {new Date(selected.createdAt).toLocaleString()}</p>

            <div className="mt-5 border-t border-ink-100 pt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">Order text</p>
              <pre className="whitespace-pre-wrap rounded-xl bg-ink-50 p-3 font-mono text-xs leading-relaxed text-ink-700">
                {buildOrderMessage(selected, settings)}
              </pre>
              <Button
                variant="outline"
                full
                className="mt-3"
                icon={copied ? <Check size={16} /> : <Copy size={16} />}
                onClick={() => copyOrderText(selected)}
              >
                {copied ? 'Copied' : 'Copy order text'}
              </Button>
            </div>
          </div>
        )}
      </BottomSheet>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete order"
        message={toDelete ? `Delete order #${toDelete.orderNumber}? This cannot be undone.` : ''}
        confirmLabel="Delete"
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove(toDelete.id)}
      />
    </div>
  );
}
