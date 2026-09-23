import type { ReactNode } from 'react';

export default function StatCard({
  label,
  value,
  icon,
  tone = 'brand',
}: {
  label: string;
  value: string;
  icon: ReactNode;
  tone?: 'brand' | 'emerald' | 'amber' | 'sky';
}) {
  const toneClasses: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    sky: 'bg-sky-50 text-sky-600',
  };
  return (
    <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink-100">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneClasses[tone]}`}>{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-extrabold text-ink-900">{value}</p>
    </div>
  );
}
