import type { ReactNode } from 'react';

type Tone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral';

const toneClasses: Record<Tone, string> = {
  brand: 'bg-brand-600 text-white',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  neutral: 'bg-ink-100 text-ink-600',
};

export default function Badge({ tone = 'neutral', children, className = '' }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${toneClasses[tone]} ${className}`}>
      {children}
    </span>
  );
}
