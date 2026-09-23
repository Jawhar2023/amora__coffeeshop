import { Star } from 'lucide-react';
import type { RestaurantSettings } from '@/types';
import { InstagramIcon } from '@/components/ui/SocialIcons';

export default function Footer({ settings }: { settings: RestaurantSettings }) {
  return (
    <footer className="mt-8 px-4">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 px-6 py-7 text-center text-white shadow-elevated">
        <span className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 shadow-md">
          <img src="/amora-logo.png" alt={settings.restaurantName} className="h-14 w-auto" />
        </span>
        <p className="mt-3 text-xs font-medium text-brand-100">Brew. Twist. Enjoy.</p>

        <div className="mt-5 flex flex-col gap-2.5">
          {settings.instagramUrl && (
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-white/15 py-2.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/25 active:scale-[0.98]"
            >
              <InstagramIcon size={16} />
              Follow us · @amora__coffeeshop
            </a>
          )}
          {settings.tiktokUrl && (
            <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-white/15 py-2.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/25 active:scale-[0.98]">
              TikTok · @amora.coffee.shop
            </a>
          )}
          {settings.googleReviewUrl && (
            <a
              href={settings.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-white py-2.5 text-sm font-semibold text-brand-700 shadow-sm transition-transform hover:opacity-90 active:scale-[0.98]"
            >
              <Star size={16} className="fill-brand-700" />
              Leave us a Google review
            </a>
          )}
        </div>
      </div>
      <p className="py-5 text-center text-[11px] text-ink-400">© {new Date().getFullYear()} {settings.restaurantName}</p>
    </footer>
  );
}
