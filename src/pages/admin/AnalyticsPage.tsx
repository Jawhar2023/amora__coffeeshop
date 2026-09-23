import { useMemo } from 'react';
import { OrderRepository } from '@/services/storage/orderStorage';
import { ProductRepository, CategoryRepository } from '@/services/storage/menuStorage';
import { CustomerRepository } from '@/services/storage/customerStorage';
import { calcProfit } from '@/services/calculations/profit';
import { formatMoney } from '@/services/calculations/money';
import PageHeader from '@/components/admin/PageHeader';
import StatCard from '@/components/admin/StatCard';
import { DollarSign, TrendingUp, Repeat, Percent } from 'lucide-react';

function withinDays(iso: string, days: number): boolean {
  return Date.now() - new Date(iso).getTime() <= days * 86400000;
}

export default function AnalyticsPage() {
  const orders = useMemo(() => OrderRepository.getAll(), []);
  const products = useMemo(() => ProductRepository.getAll(), []);
  const categories = useMemo(() => CategoryRepository.getAll(), []);
  const customers = useMemo(() => CustomerRepository.getAll(), []);

  const validOrders = orders.filter((o) => o.status !== 'cancelled');
  const revenueToday = validOrders.filter((o) => withinDays(o.createdAt, 1)).reduce((s, o) => s + o.total, 0);
  const revenueWeek = validOrders.filter((o) => withinDays(o.createdAt, 7)).reduce((s, o) => s + o.total, 0);
  const revenueMonth = validOrders.filter((o) => withinDays(o.createdAt, 30)).reduce((s, o) => s + o.total, 0);

  const totalOrders = orders.length;
  const completed = orders.filter((o) => o.status === 'served').length;
  const cancelled = orders.filter((o) => o.status === 'cancelled').length;
  const pending = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length;

  const productStats = new Map<string, { qty: number; revenue: number; profit: number }>();
  validOrders.forEach((o) =>
    o.items.forEach((i) => {
      const product = products.find((p) => p.id === i.productId);
      const current = productStats.get(i.name) ?? { qty: 0, revenue: 0, profit: 0 };
      current.qty += i.quantity;
      current.revenue += i.lineTotal;
      current.profit += product ? calcProfit(product.price, product.cost) * i.quantity : 0;
      productStats.set(i.name, current);
    })
  );
  const bestSeller = [...productStats.entries()].sort((a, b) => b[1].qty - a[1].qty)[0];
  const mostProfitable = [...productStats.entries()].sort((a, b) => b[1].profit - a[1].profit)[0];

  const categoryRevenue = new Map<string, number>();
  validOrders.forEach((o) =>
    o.items.forEach((i) => {
      const product = products.find((p) => p.id === i.productId);
      const category = categories.find((c) => c.id === product?.categoryId);
      if (!category) return;
      categoryRevenue.set(category.name, (categoryRevenue.get(category.name) ?? 0) + i.lineTotal);
    })
  );
  const bestCategory = [...categoryRevenue.entries()].sort((a, b) => b[1] - a[1])[0];

  const avgOrderValue = validOrders.length > 0 ? validOrders.reduce((s, o) => s + o.total, 0) / validOrders.length : 0;
  const repeatCustomers = customers.filter((c) => c.totalOrders > 1).length;

  const estimatedRevenue = validOrders.reduce((s, o) => s + o.total, 0);
  const estimatedCost = validOrders.reduce(
    (s, o) =>
      s +
      o.items.reduce((sum, i) => {
        const product = products.find((p) => p.id === i.productId);
        return sum + (product ? product.cost * i.quantity : 0);
      }, 0),
    0
  );
  const grossProfit = estimatedRevenue - estimatedCost;
  const profitMargin = estimatedRevenue > 0 ? (grossProfit / estimatedRevenue) * 100 : 0;

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Revenue, orders, products, and profitability insights" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Revenue Today" value={formatMoney(revenueToday)} icon={<DollarSign size={16} />} />
        <StatCard label="Revenue This Week" value={formatMoney(revenueWeek)} icon={<DollarSign size={16} />} tone="sky" />
        <StatCard label="Revenue This Month" value={formatMoney(revenueMonth)} icon={<DollarSign size={16} />} tone="emerald" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Orders" value={String(totalOrders)} icon={<TrendingUp size={16} />} />
        <StatCard label="Completed" value={String(completed)} icon={<TrendingUp size={16} />} tone="emerald" />
        <StatCard label="Cancelled" value={String(cancelled)} icon={<TrendingUp size={16} />} tone="amber" />
        <StatCard label="Pending" value={String(pending)} icon={<TrendingUp size={16} />} tone="sky" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100">
          <p className="text-sm font-bold text-ink-900">Products</p>
          <div className="mt-3 space-y-2 text-sm">
            <Row label="Best Seller" value={bestSeller ? `${bestSeller[0]} (${bestSeller[1].qty})` : '—'} />
            <Row label="Most Profitable" value={mostProfitable ? `${mostProfitable[0]} (${formatMoney(mostProfitable[1].profit)})` : '—'} />
            <Row label="Best Performing Category" value={bestCategory ? bestCategory[0] : '—'} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100">
          <p className="text-sm font-bold text-ink-900">Customers</p>
          <div className="mt-3 space-y-2 text-sm">
            <Row label="Average Order Value" value={formatMoney(avgOrderValue)} />
            <Row label="Repeat Customers" value={`${repeatCustomers} / ${customers.length}`} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100 lg:col-span-2">
          <p className="flex items-center gap-2 text-sm font-bold text-ink-900">
            <Percent size={15} /> Profit Overview
          </p>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MiniStat label="Revenue" value={formatMoney(estimatedRevenue)} />
            <MiniStat label="Estimated Costs" value={formatMoney(estimatedCost)} />
            <MiniStat label="Gross Profit" value={formatMoney(grossProfit)} tone="text-emerald-600" />
            <MiniStat label="Profit Margin" value={`${profitMargin.toFixed(1)}%`} tone="text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-500">{label}</span>
      <span className="font-semibold text-ink-900">{value}</span>
    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</p>
      <p className={`mt-1 text-lg font-extrabold text-ink-900 ${tone ?? ''}`}>{value}</p>
    </div>
  );
}
