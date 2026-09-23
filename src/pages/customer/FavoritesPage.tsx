import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Clock3, Layers, Wallet } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { ProductRepository, CategoryRepository } from '@/services/storage/menuStorage';
import { FavoritesRepository, RecentlyViewedRepository } from '@/services/storage/favoritesStorage';
import { formatMoney, sumMoney } from '@/services/calculations/money';
import ProductCard from '@/components/menu/ProductCard';
import BottomNav from '@/components/menu/BottomNav';
import Button from '@/components/ui/Button';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { t, field } = useLanguage();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [refresh, setRefresh] = useState(0);

  const favoriteIds = useMemo(() => FavoritesRepository.getAll(), [refresh]);
  const products = useMemo(() => ProductRepository.getAll(), []);
  const categories = useMemo(() => CategoryRepository.getAll(), []);
  const favorites = products.filter((p) => favoriteIds.includes(p.id));

  const recentIds = useMemo(() => RecentlyViewedRepository.getAll(), []);
  const recent = products.filter((p) => recentIds.includes(p.id));

  const totalValue = sumMoney(favorites.map((p) => p.discountPrice ?? p.price));
  const categoryCount = new Set(favorites.map((p) => p.categoryId)).size;

  const grouped = categories
    .map((cat) => ({ category: cat, items: favorites.filter((p) => p.categoryId === cat.id) }))
    .filter((g) => g.items.length > 0);
  const uncategorized = favorites.filter((p) => !categories.some((c) => c.id === p.categoryId));

  const handleQuickAdd = (p: (typeof favorites)[number]) => {
    addItem({
      productId: p.id,
      name: field(p, 'name'),
      image: p.image,
      unitPrice: p.discountPrice ?? p.price,
      quantity: 1,
      options: [],
      notes: '',
    });
    showToast(t('added'));
  };

  return (
    <div className="min-h-screen pb-8">
      <header className="relative overflow-hidden rounded-b-[2rem] bg-gradient-to-br from-rose-600 via-brand-600 to-brand-700 px-5 pb-9 pt-5 text-white">
        <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10 blur-xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-white/10 blur-xl" />

        <div className="relative flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <ArrowLeft size={18} />
          </button>
        </div>

        <div className="relative mt-4 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Heart size={22} className="fill-white" />
          </span>
          <div>
            <h1 className="font-[var(--font-display)] text-2xl font-extrabold leading-tight">{t('favorites')}</h1>
            <p className="text-sm text-white/75">
              {favorites.length > 0 ? `${favorites.length} dish${favorites.length > 1 ? 'es' : ''} saved` : 'Your personal shortlist'}
            </p>
          </div>
        </div>
      </header>

      {favorites.length > 0 && (
        <div className="relative -mt-6 mx-4 grid grid-cols-3 gap-2.5">
          <StatChip icon={<Heart size={14} className="text-rose-500" />} value={String(favorites.length)} label="Saved" />
          <StatChip icon={<Wallet size={14} className="text-emerald-500" />} value={formatMoney(totalValue)} label="Total value" />
          <StatChip icon={<Layers size={14} className="text-sky-500" />} value={String(categoryCount)} label="Categories" />
        </div>
      )}

      <div className="mt-6 px-4">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl bg-white px-6 py-12 text-center shadow-card ring-1 ring-ink-100">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-brand-100">
              <Heart size={34} className="text-rose-400" />
              <span className="absolute -right-1 -top-1 text-xl">✨</span>
            </div>
            <div>
              <p className="text-base font-extrabold text-ink-900">{t('noFavorites')}</p>
              <p className="mt-1 max-w-[220px] text-sm text-ink-400">
                Tap the ♡ on any dish to save it here for next time.
              </p>
            </div>
            <Button onClick={() => navigate('/menu')} icon={<Heart size={15} />}>
              {t('menu')}
            </Button>
          </div>
        ) : (
          <div onClick={() => setRefresh((n) => n + 1)} className="space-y-7">
            {grouped.map(({ category, items }) => (
              <section key={category.id}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <h2 className="text-base font-extrabold text-ink-900">{field(category, 'name')}</h2>
                  <span className="text-xs font-semibold text-ink-400">({items.length})</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} onOpen={() => navigate(`/product/${p.id}`)} onQuickAdd={() => handleQuickAdd(p)} />
                  ))}
                </div>
              </section>
            ))}

            {uncategorized.length > 0 && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg">🍽️</span>
                  <h2 className="text-base font-extrabold text-ink-900">Other favorites</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {uncategorized.map((p) => (
                    <ProductCard key={p.id} product={p} onOpen={() => navigate(`/product/${p.id}`)} onQuickAdd={() => handleQuickAdd(p)} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {recent.length > 0 && (
        <div className="mt-8 px-4">
          <div className="mb-3 flex items-center gap-2">
            <Clock3 size={16} className="text-ink-400" />
            <h2 className="text-base font-extrabold text-ink-900">{t('recentlyViewed')}</h2>
          </div>
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
            {recent.map((p) => (
              <div key={p.id} className="w-36 shrink-0">
                <ProductCard product={p} onOpen={() => navigate(`/product/${p.id}`)} onQuickAdd={() => handleQuickAdd(p)} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-16" />
      <BottomNav />
    </div>
  );
}

function StatChip({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-white px-2 py-3 text-center shadow-card ring-1 ring-ink-100">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-50">{icon}</span>
      <span className="truncate text-sm font-extrabold text-ink-900">{value}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">{label}</span>
    </div>
  );
}
