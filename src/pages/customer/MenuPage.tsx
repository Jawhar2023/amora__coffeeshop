import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu as MenuIcon } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { CategoryRepository, ProductRepository } from '@/services/storage/menuStorage';
import { SettingsRepository } from '@/services/storage/settingsStorage';
import CategoryNav from '@/components/menu/CategoryNav';
import SearchBar from '@/components/menu/SearchBar';
import ProductCard from '@/components/menu/ProductCard';
import LanguageSelector from '@/components/menu/LanguageSelector';
import RestaurantInfoSheet from '@/components/menu/RestaurantInfoSheet';
import BottomNav from '@/components/menu/BottomNav';
import StickyCartButton from '@/components/cart/StickyCartButton';
import EmptyState from '@/components/ui/EmptyState';
import Footer from '@/components/menu/Footer';

export default function MenuPage() {
  const { t, field } = useLanguage();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const settings = SettingsRepository.get();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);

  const categories = useMemo(() => CategoryRepository.getAll().filter((c) => c.isActive), []);
  const products = useMemo(() => ProductRepository.getAll(), []);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory) list = list.filter((p) => p.categoryId === activeCategory);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return list;
  }, [products, activeCategory, query]);

  const featured = useMemo(() => products.filter((p) => p.featured).slice(0, 5), [products]);
  const groupedProducts = useMemo(
    () => categories.map((category) => ({ category, products: products.filter((product) => product.categoryId === category.id) })),
    [categories, products]
  );

  return (
    <div className="pb-4">
      <header className="relative overflow-hidden rounded-b-[2rem] bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 px-5 pb-8 pt-6 text-white">
        <div className="flex items-start justify-between">
          <div className="inline-flex items-center rounded-2xl bg-white px-5 py-3 shadow-md">
            <img src="/amora-logo.png" alt={settings.restaurantName} className="h-16 w-auto sm:h-20" />
          </div>
          <h1 className="sr-only">{settings.restaurantName}</h1>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <button
              onClick={() => setInfoOpen(true)}
              aria-label="Restaurant info"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-colors hover:bg-white/25"
            >
              <MenuIcon size={18} />
            </button>
          </div>
        </div>
        <p className="mt-6 font-[var(--font-display)] text-3xl font-extrabold leading-none">
          {t('heroLine1')}
          <br />
          {t('heroLine2')}
        </p>
        <div className="mt-6">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </header>

      <div className="mt-5 px-4">
        <CategoryNav categories={categories} activeId={activeCategory} onSelect={setActiveCategory} />
      </div>

      {!activeCategory && !query && featured.length > 0 && (
        <div className="mt-6 px-4">
          <h2 className="mb-3 text-base font-extrabold text-ink-900">{t('chefRecommendation')}</h2>
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
            {featured.map((p) => (
              <div key={p.id} className="w-40 shrink-0">
                <ProductCard
                  product={p}
                  onOpen={() => navigate(`/product/${p.id}`)}
                  onQuickAdd={() => {
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
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 px-4">
        <h2 className="mb-3 text-base font-extrabold text-ink-900">{t('menu')}</h2>
        {filtered.length === 0 ? (
          <EmptyState icon="☕" title={t('noProductsFound')} subtitle={t('tryAnotherSearch')} />
        ) : !activeCategory && !query ? (
          <div className="space-y-8">
            {groupedProducts.map(({ category, products: categoryProducts }) => (
              <section key={category.id} id={`category-${category.id}`}>
                <h2 className="mb-3 border-b border-brand-200 pb-2 text-lg font-extrabold text-brand-700">{field(category, 'name')}</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categoryProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onOpen={() => navigate(`/product/${p.id}`)}
                      onQuickAdd={() => {
                        addItem({ productId: p.id, name: field(p, 'name'), image: p.image, unitPrice: p.discountPrice ?? p.price, quantity: 1, options: [], notes: '' });
                        showToast(t('added'));
                      }}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onOpen={() => navigate(`/product/${p.id}`)}
                onQuickAdd={() => {
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
                }}
              />
            ))}
          </div>
        )}
      </div>

      <Footer settings={settings} />

      <div className="h-20" />
      <StickyCartButton />
      <BottomNav />
      <RestaurantInfoSheet open={infoOpen} onClose={() => setInfoOpen(false)} settings={settings} />
    </div>
  );
}
