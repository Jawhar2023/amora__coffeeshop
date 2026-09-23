import { useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import { ReviewTrackingRepository } from '@/services/storage/gameStorage';
import { SettingsRepository } from '@/services/storage/settingsStorage';
import PageHeader from '@/components/admin/PageHeader';
import StatCard from '@/components/admin/StatCard';

export default function ReviewsPage() {
  const tracking = useMemo(() => ReviewTrackingRepository.get(), []);
  const settings = SettingsRepository.get();
  const conversion = tracking.ctaShown > 0 ? (tracking.ctaClicked / tracking.ctaShown) * 100 : 0;

  return (
    <div>
      <PageHeader title="Reviews" subtitle="Track engagement with the post-game review call-to-action" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Game Losses" value={String(tracking.gameLosses)} icon={<span>🎮</span>} />
        <StatCard label="CTA Impressions" value={String(tracking.ctaShown)} icon={<span>👁️</span>} tone="sky" />
        <StatCard label="CTA Clicks" value={String(tracking.ctaClicked)} icon={<span>⭐</span>} tone="amber" />
        <StatCard label="Conversion Rate" value={`${conversion.toFixed(1)}%`} icon={<span>📈</span>} tone="emerald" />
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100">
        <p className="text-sm font-bold text-ink-900">Google Review destination</p>
        <a
          href={settings.googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center gap-1.5 break-all text-sm text-brand-600 hover:underline"
        >
          {settings.googleReviewUrl} <ExternalLink size={14} className="shrink-0" />
        </a>
        <p className="mt-3 text-xs text-ink-400">
          This is only click tracking on the CTA — no reviews are fabricated or scraped. Actual review content lives on Google.
        </p>
      </div>
    </div>
  );
}
