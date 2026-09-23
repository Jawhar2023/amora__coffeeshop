import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Layers,
  PlusCircle,
  Tags,
  Gamepad2,
  BarChart3,
  Star,
  Settings,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { AuthRepository } from '@/services/storage/authStorage';
import { SettingsRepository } from '@/services/storage/settingsStorage';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/products', label: 'Products', icon: UtensilsCrossed },
  { to: '/admin/categories', label: 'Categories', icon: Layers },
  { to: '/admin/addons', label: 'Add-ons', icon: PlusCircle },
  { to: '/admin/promotions', label: 'Promotions', icon: Tags },
  { to: '/admin/games', label: 'Games', icon: Gamepad2 },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const settings = SettingsRepository.get();

  const handleLogout = () => {
    AuthRepository.logout();
    navigate('/admin/login');
  };

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-lg text-white">🍽️</div>
        <div>
          <p className="text-sm font-extrabold text-white">{settings.restaurantName}</p>
          <p className="text-[11px] text-ink-400">Admin Console</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-600 text-white' : 'text-ink-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="mx-3 mb-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-300 hover:bg-white/5 hover:text-white"
      >
        <LogOut size={17} /> Log out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-ink-900 lg:block">{SidebarContent}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-ink-900">{SidebarContent}</div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink-200 bg-white px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(true)} className="rounded-lg p-1.5 hover:bg-ink-100">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <p className="text-sm font-bold text-ink-900">Admin Console</p>
        </header>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
