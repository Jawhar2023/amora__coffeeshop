import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, RotateCcw, ArrowLeft, Copy, Check, Gift } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { SettingsRepository } from '@/services/storage/settingsStorage';
import { ReviewTrackingRepository } from '@/services/storage/gameStorage';
import { ReviewRewardRepository } from '@/services/storage/reviewRewardStorage';
import Button from '@/components/ui/Button';
import { FacebookIcon, InstagramIcon } from '@/components/ui/SocialIcons';

export default function GameOverScreen({
  score,
  scoreLabel,
  onRestart,
}: {
  score: number;
  scoreLabel?: string;
  onRestart: () => void;
}) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const settings = SettingsRepository.get();

  const [rewardCode, setRewardCode] = useState<string | null>(() => ReviewRewardRepository.getExistingCode());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    ReviewTrackingRepository.recordGameLoss();
    ReviewTrackingRepository.recordCtaShown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-ink-400">{t('gameOver')}</p>
      <p className="mt-2 font-[var(--font-display)] text-5xl font-extrabold text-ink-900">{score}</p>
      <p className="text-sm text-ink-500">{scoreLabel ?? t('score')}</p>

      <div className="mt-8 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 p-5 text-white">
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

      {(settings.facebookUrl || settings.instagramUrl) && (
        <div className="mt-6 w-full">
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink-400">Follow us</p>
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
          </div>
        </div>
      )}

      <div className="mt-6 flex w-full gap-3">
        <Button variant="ghost" full icon={<ArrowLeft size={16} />} onClick={() => navigate('/games')}>
          {t('backToGames')}
        </Button>
        <Button variant="primary" full icon={<RotateCcw size={16} />} onClick={onRestart}>
          {t('playAgain')}
        </Button>
      </div>
    </div>
  );
}
