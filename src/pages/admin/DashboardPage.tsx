import { useMemo } from 'react';
import { DollarSign, ClipboardList, Receipt, Flame } from 'lucide-react';
import { OrderRepository } from '@/services/storage/orderStorage';
import { ProductRepository, CategoryRepository } from '@/services/storage/menuStorage';
import { formatMoney } from '@/services/calculations/money';
import PageHeader from '@/components/admin/PageHeader';
import StatCard from '@/components/admin/StatCard';

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export default function DashboardPage() {
  const orders = useMemo(() => OrderRepository.getAll(), []);
  const products = useMemo(() => ProductRepository.getAll(), []);
  const categories = useMemo(() => CategoryRepository.getAll(), []);

  const todayOrders = orders.filter((o) => isToday(o.createdAt) && o.status !== 'cancelled');
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrder = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0;

  const productCounts = new Map<string, number>();
  orders.forEach((o) => o.items.forEach((i) => productCounts.set(i.name, (productCounts.get(i.name) ?? 0) + i.quantity)));
  const popular = [...productCounts.entries()].sort((a, b) => b[1] - a[1])[0];

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const revenueByDay = last7Days.map((d) => {
    const total = orders
      .filter((o) => new Date(o.createdAt).toDateString() === d.toDateString() && o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
    return { label: d.toLocaleDateString(undefined, { weekday: 'short' }), total };
  });
  const maxRevenue = Math.max(1, ...revenueByDay.map((d) => d.total));

  const topProducts = [...productCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCount = Math.max(1, ...topProducts.map((p) => p[1]));

  const statusCounts: Record<string, number> = {};
  orders.forEach((o) => (statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1));

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your restaurant's performance today" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Today's Revenue" value={formatMoney(todayRevenue)} icon={<DollarSign size={16} />} tone="brand" />
        <StatCard label="Today's Orders" value={String(todayOrders.length)} icon={<ClipboardList size={16} />} tone="sky" />
        <StatCard label="Average Order" value={formatMoney(avgOrder)} icon={<Receipt size={16} />} tone="emerald" />
        <StatCard label="Popular Product" value={popular ? popular[0] : '—'} icon={<Flame size={16} />} tone="brand" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100">
          <p className="text-sm font-bold text-ink-900">Revenue — last 7 days</p>
          <div className="mt-5 flex items-end justify-between gap-2" style={{ height: 140 }}>
            {revenueByDay.map((d) => (
              <div key={d.label} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className="w-full rounded-t-lg bg-brand-500"
                  style={{ height: `${Math.max(4, (d.total / maxRevenue) * 120)}px` }}
                  title={formatMoney(d.total)}
                />
                <span className="text-[10px] font-semibold text-ink-400">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100">
          <p className="text-sm font-bold text-ink-900">Top products</p>
          <div className="mt-4 space-y-3">
            {topProducts.length === 0 && <p className="text-sm text-ink-400">No data yet.</p>}
            {topProducts.map(([name, count]) => (
              <div key={name}>
                <div className="flex items-center justify-between text-xs font-semibold text-ink-600">
                  <span>{name}</span>
                  <span>{count}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-ink-100">
                  <div className="h-2 rounded-full bg-brand-500" style={{ width: `${(count / maxCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100">
          <p className="text-sm font-bold text-ink-900">Order status distribution</p>
          <div className="mt-4 space-y-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="capitalize text-ink-600">{status}</span>
                <span className="font-bold text-ink-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100">
          <p className="text-sm font-bold text-ink-900">Category performance</p>
          <div className="mt-4 space-y-2">
            {categories.slice(0, 6).map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length;
              return (
                <div key={cat.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink-600">
                    {cat.icon} {cat.name}
                  </span>
                  <span className="font-bold text-ink-900">{count} items</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
