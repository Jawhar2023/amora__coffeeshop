import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PartyPopper, Gamepad2, Star, Gift, Copy, Check } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { OrderRepository } from '@/services/storage/orderStorage';
import { SettingsRepository } from '@/services/storage/settingsStorage';
import { ReviewTrackingRepository } from '@/services/storage/gameStorage';
import { ReviewRewardRepository } from '@/services/storage/reviewRewardStorage';
import { formatMoney } from '@/services/calculations/money';
import Button from '@/components/ui/Button';
import { FacebookIcon, InstagramIcon } from '@/components/ui/SocialIcons';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [tick, setTick] = useState(0);
  const settings = SettingsRepository.get();
  const [rewardCode, setRewardCode] = useState<string | null>(() => ReviewRewardRepository.getExistingCode());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => setTick((n) => n + 1), 3000);
    return () => window.clearInterval(interval);
  }, []);

  const order = useMemo(() => (id ? OrderRepository.getById(id) : undefined), [id, tick]);

  useEffect(() => {
    if (order) ReviewTrackingRepository.recordCtaShown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id]);

  const handleReview = () => {
    ReviewTrackingRepository.recordCtaClicked();
    setRewardCode(ReviewRewardRepository.getOrCreateCode());
    window.open(settings.googleReviewUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = async () => {
    if (!rewardCode) return;
    try {
      await navigator.clipboard.writeText(rewardCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — the code is still visible to copy manually
    }
  };

  if (!order) {
    return (
      <div className="p-6 text-center text-ink-600">
        Order not found.
        <button onClick={() => navigate('/menu')} className="mt-2 block text-brand-600 underline">
          Back to menu
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-5 pb-8 pt-8 text-center">
      <span className="animate-fade-up inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 shadow-card">
        <img src="/amora-logo.png" alt={settings.restaurantName} className="h-12 w-auto" />
      </span>
      <p className="animate-fade-up mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-400">
        {settings.restaurantName}
      </p>

      <div className="animate-check-pop mt-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <PartyPopper size={26} />
      </div>
      <h1 className="mt-3 font-[var(--font-display)] text-2xl font-bold text-ink-900">{t('orderConfirmed')}</h1>
      <p className="mt-1 text-sm text-ink-500">
        {t('orderNumber')} #{order.orderNumber}
      </p>

      <div className="animate-circle-pop relative mt-8 flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 text-white shadow-elevated">
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-white/30" />
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-100">{t('total')}</p>
          <p className="mt-1 font-[var(--font-display)] text-4xl font-extrabold">{formatMoney(order.total)}</p>
        </div>
      </div>

      <div className="mt-6 w-full max-w-sm rounded-2xl border border-brand-200 bg-brand-50 px-5 py-5 text-center shadow-card">
        <p className="font-[var(--font-display)] text-2xl font-bold leading-tight text-brand-800 sm:text-3xl">
          ☕ Coffee is self-service
        </p>
        <p className="mt-2 text-base font-semibold leading-relaxed text-brand-700 sm:text-lg">
          please pick it up at the coffee counter.
        </p>
      </div>

      <div className="mt-6 w-full max-w-sm rounded-2xl border border-ink-100 bg-white p-4 text-left shadow-card">
        <p className="mb-2 text-lg font-extrabold text-ink-900">Your Order</p>
        <div className="divide-y divide-ink-100">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 text-sm">
              <span className="text-ink-700">
                {item.name} × {item.quantity}
              </span>
              <span className="font-semibold text-ink-800">{formatMoney(item.lineTotal)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-ink-900 to-ink-800 p-5 text-white">
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
          <span className="animate-ring-pulse absolute inset-0 rounded-full bg-brand-400/40" />
          <span
            className="animate-ring-pulse absolute inset-0 rounded-full bg-brand-400/40"
            style={{ animationDelay: '0.7s' }}
          />
          <div className="animate-float-bounce relative flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <Gamepad2 size={26} />
          </div>
        </div>
        <p className="mt-3 text-base font-bold">{t('playGame')}</p>
        <p className="mt-1 text-sm text-ink-200">{t('gameCenter')}</p>
        <Button
          variant="primary"
          size="lg"
          full
          className="mt-4"
          icon={<Gamepad2 size={18} />}
          onClick={() => navigate('/games')}
        >
          {t('gameCenter')}
        </Button>
      </div>

      <div className="mt-6 w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 p-5 text-white">
        {!rewardCode ? (
          <>
            <p className="text-sm font-semibold text-brand-50">{t('enjoyingExperience')}</p>
            <p className="mt-0.5 text-base font-bold">{t('leaveUsReview')} ❤️</p>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-50">
              <Gift size={14} /> Get a 1 DT reward code just for trying
            </p>
            <Button
              variant="secondary"
              full
              size="lg"
              className="mt-4 !bg-white !text-brand-700"
              icon={<Star size={18} className="fill-brand-500 text-brand-500" />}
              onClick={handleReview}
            >
              {t('leaveReview')}
            </Button>
          </>
        ) : (
          <>
            <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-50">
              <Gift size={16} /> Thank you! Here's your reward
            </p>
            <p className="mt-1 text-xs text-brand-100">1 DT off your next order — one-time use</p>
            <button
              onClick={handleCopy}
              className="mt-3 flex w-full items-center justify-between gap-3 rounded-xl bg-white/15 px-4 py-3 backdrop-blur transition-colors hover:bg-white/25"
            >
              <span className="font-mono text-xl font-extrabold tracking-widest">{rewardCode}</span>
              <span className="flex items-center gap-1 text-xs font-bold">
                {copied ? (
                  <>
                    <Check size={15} /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={15} /> Copy
                  </>
                )}
              </span>
            </button>
            <p className="mt-2 text-[11px] text-brand-100">Enter this code at checkout in "Have a promo code?"</p>
          </>
        )}
      </div>

      {(settings.facebookUrl || settings.instagramUrl || settings.tiktokUrl) && (
        <div className="mt-6 w-full max-w-sm">
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink-400">{t('followUs')}</p>
          <div className="mt-2 flex gap-2.5">
            {settings.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1877F2] py-2.5 text-sm font-semibold text-white transition-transform active:scale-95"
              >
                <FacebookIcon size={16} /> Facebook
              </a>
            )}
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] py-2.5 text-sm font-semibold text-white transition-transform active:scale-95"
              >
                <InstagramIcon size={16} /> Instagram
              </a>
            )}
            {settings.tiktokUrl && (
              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-ink-900 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95"
              >
                ♪ TikTok
              </a>
            )}
          </div>
        </div>
      )}

      <button onClick={() => navigate('/menu')} className="mt-6 text-sm font-semibold text-ink-500 underline">
        {t('menu')}
      </button>
    </div>
  );
}
