import { NavLink } from 'react-router-dom';
import { Home, Heart, Gamepad2 } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

export default function BottomNav() {
  const { t } = useLanguage();
  const items = [
    { to: '/menu', icon: Home, label: t('home') },
    { to: '/favorites', icon: Heart, label: t('favorites') },
    { to: '/games', icon: Gamepad2, label: t('games') },
  ];
  return (
    <nav className="sticky bottom-0 z-30 flex items-center justify-around border-t border-ink-100 bg-white/95 py-2 backdrop-blur">
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-brand-600' : 'text-ink-400'
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
