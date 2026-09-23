import type { ReactNode } from 'react';

export default function EmptyState({
  icon,
  title,
  subtitle,
  action,
}: {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      {icon && <div className="text-4xl">{icon}</div>}
      <p className="text-base font-bold text-ink-900">{title}</p>
      {subtitle && <p className="max-w-xs text-sm text-ink-400">{subtitle}</p>}
      {action}
    </div>
  );
}
