import { useState } from 'react';
import { ChevronRight, Gamepad2, Menu, Star, Wifi, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SettingsRepository } from '@/services/storage/settingsStorage';
import { InstagramIcon } from '@/components/ui/SocialIcons';

const reviewUrl = 'https://search.google.com/local/writereview?placeid=ChIJAWXNDKOL_RIRPGxFqdLfS-0';

export default function HomePage() {
  const navigate = useNavigate();
  const settings = SettingsRepository.get();
  const [wifiOpen, setWifiOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#241e1b] text-white">
      <section className="relative h-[56vh] min-h-[440px] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/amora-cover.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/amora-logo.png"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-[#241e1b]" />
        <div className="relative flex h-full flex-col items-center justify-between px-6 pb-10 pt-8 text-center">
          <div className="flex w-full items-center justify-between">
            <span className="rounded-full border border-white/30 bg-black/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] backdrop-blur">
              Coffee &amp; more
            </span>
            <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-brand-700 shadow-lg">
              Amora
            </span>
          </div>
          <div>
            <img src="/amora-logo.png" alt={settings.restaurantName} className="mx-auto mb-5 h-20 w-auto rounded-xl bg-white/95 px-4 py-2 shadow-2xl" />
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/75">Welcome to Amora</p>
            <h1 className="mt-2 font-[var(--font-display)] text-4xl leading-tight text-white drop-shadow-lg sm:text-5xl">Brew. Twist. Enjoy.</h1>
          </div>
        </div>
      </section>

      <section className="relative -mt-5 rounded-t-[2rem] bg-[#241e1b] px-5 pb-10 pt-7">
        <div className="mx-auto max-w-md">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-300">Your Amora place</p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight">What are you looking for?</h2>
            </div>
            <span className="mb-1 h-2 w-2 rounded-full bg-brand-300 shadow-[0_0_18px_4px_rgba(233,139,114,0.35)]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <HomeAction icon={<Menu size={24} />} title="Our menu" detail="Drinks & food" onClick={() => navigate('/menu')} tone="coral" />
            <HomeAction icon={<Gamepad2 size={24} />} title="Play games" detail="Have fun while you wait" onClick={() => navigate('/games')} tone="gold" />
            <HomeAction icon={<Star size={24} />} title="Leave a review" detail="Tell us what you think" href={reviewUrl} tone="cream" />
            <HomeAction icon={<Wifi size={24} />} title="Free Wi-Fi" detail="Scan to connect" onClick={() => setWifiOpen(true)} tone="mint" />
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-white/55">
            <span>Follow the Amora feeling</span>
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-semibold text-white/80 hover:text-white">
                <InstagramIcon size={14} /> @amora__coffeeshop
              </a>
            )}
          </div>
        </div>
      </section>

      {wifiOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="wifi-title">
          <div className="w-full max-w-sm rounded-3xl bg-[#fbf6f1] p-6 text-center text-[#241e1b] shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600"><Wifi size={22} /></span>
              <button onClick={() => setWifiOpen(false)} aria-label="Close Wi-Fi dialog" className="rounded-full p-2 text-ink-500 hover:bg-ink-100"><X size={20} /></button>
            </div>
            <h2 id="wifi-title" className="mt-5 text-2xl font-extrabold">Connect to Wi-Fi</h2>
            <p className="mt-2 text-sm text-ink-500">Scan the QR code to connect to Amora Wi-Fi.</p>
            <img src="/wifi-qr.png" alt="Wi-Fi QR code for Ooredoo 319958" className="mx-auto mt-5 h-56 w-56 rounded-xl bg-white object-contain p-2 shadow-card" />
            <div className="mt-5 rounded-xl bg-white px-4 py-3 text-left text-sm shadow-card">
              <p><span className="font-semibold text-ink-500">Network:</span> Ooredoo 319958</p>
              <p className="mt-1"><span className="font-semibold text-ink-500">Security:</span> WPA2</p>
              <p className="mt-1"><span className="font-semibold text-ink-500">Password:</span> Amir.51767038</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function HomeAction({
  icon,
  title,
  detail,
  onClick,
  href,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  onClick?: () => void;
  href?: string;
  tone: 'coral' | 'gold' | 'cream' | 'mint';
}) {
  const className = `group relative min-h-36 overflow-hidden rounded-2xl p-4 text-left shadow-lg transition-transform hover:-translate-y-1 active:scale-[0.98] ${
    tone === 'coral' ? 'bg-brand-600 text-white' : tone === 'gold' ? 'bg-[#c9a46a] text-[#241e1b]' : tone === 'cream' ? 'bg-[#fbf6f1] text-[#241e1b]' : 'bg-[#d7e4d6] text-[#241e1b]'
  }`;
  const content = <><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/10">{icon}</span><span className="mt-8 block text-lg font-extrabold leading-tight">{title}</span><span className="mt-1 block max-w-[130px] text-xs opacity-70">{detail}</span><ChevronRight className="absolute bottom-4 right-4 opacity-60 transition-transform group-hover:translate-x-1" size={18} /></>;
  return href ? <a className={className} href={href} target="_blank" rel="noopener noreferrer">{content}</a> : <button className={className} onClick={onClick}>{content}</button>;
}
