import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, Heart, Gamepad2, ChevronRight, Star } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import type { RestaurantSettings } from '@/types';
import BottomSheet from '@/components/ui/BottomSheet';
import { FacebookIcon, InstagramIcon } from '@/components/ui/SocialIcons';

export default function RestaurantInfoSheet({
  open,
  onClose,
  settings,
}: {
  open: boolean;
  onClose: () => void;
  settings: RestaurantSettings;
}) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="relative -mt-[1px] overflow-hidden rounded-t-3xl bg-gradient-to-br from-brand-800 via-brand-600 to-brand-500 px-5 pb-6 pt-8 text-white">
        <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -left-6 bottom-0 h-20 w-20 rounded-full bg-white/10" />
        <div className="relative flex flex-col items-start gap-3">
          <span className="flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 shadow-md">
            <img src="/amora-logo.png" alt={settings.restaurantName} className="h-14 w-auto" />
          </span>
          <p className="text-xs font-medium text-brand-100">Brew. Twist. Enjoy.</p>
        </div>

        <div className="relative mt-5 flex gap-2.5">
          {settings.facebookUrl && <SocialButton href={settings.facebookUrl} icon={<FacebookIcon />} label="Facebook" />}
          {settings.instagramUrl && <SocialButton href={settings.instagramUrl} icon={<InstagramIcon />} label="Instagram" />}
          {settings.tiktokUrl && <SocialButton href={settings.tiktokUrl} icon={<span aria-hidden="true">♪</span>} label="TikTok" />}
        </div>
      </div>

      <div className="px-5 py-5">
        {(settings.address || settings.phone || settings.openingHours) && (
          <div className="mb-6 space-y-1 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
            {settings.address && <InfoRow icon={<MapPin size={16} />} label="Address" text={settings.address} />}
            {settings.phone && (
              <InfoRow icon={<Phone size={16} />} label="Phone" text={settings.phone} href={`tel:${settings.phone.replace(/\s+/g, '')}`} />
            )}
            {settings.openingHours && <InfoRow icon={<Clock size={16} />} label="Opening hours" text={settings.openingHours} last />}
          </div>
        )}

        <a
          href={settings.googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-6 flex items-center gap-3 rounded-2xl border border-ink-100 bg-white px-4 py-3.5 shadow-card transition-colors hover:bg-brand-50"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <Star size={17} />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-ink-900">Your opinion matters</span>
            <span className="block text-xs text-ink-500">Leave us a Google review</span>
          </span>
          <ChevronRight size={16} className="text-ink-300" />
        </a>

        <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-ink-400">Quick links</p>
        <div className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
          <NavRow icon={<Heart size={17} />} label={t('favorites')} onClick={() => go('/favorites')} />
          <NavRow icon={<Gamepad2 size={17} />} label={t('gameCenter')} onClick={() => go('/games')} />
        </div>
      </div>
    </BottomSheet>
  );
}

function SocialButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/15 py-2.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/25"
    >
      {icon}
      {label}
    </a>
  );
}

function InfoRow({
  icon,
  label,
  text,
  href,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
  href?: string;
  last?: boolean;
}) {
  const content = (
    <div className={`flex items-center gap-3 px-4 py-3.5 ${last ? '' : 'border-b border-ink-100'}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{label}</p>
        <p className="truncate text-sm font-semibold text-ink-800">{text}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block hover:bg-ink-50">
      {content}
    </a>
  ) : (
    content
  );
}

function NavRow({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-semibold text-ink-800 hover:bg-ink-50">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      <ChevronRight size={16} className="text-ink-300" />
    </button>
  );
}
