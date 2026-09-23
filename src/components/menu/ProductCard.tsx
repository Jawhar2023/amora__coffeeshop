import { Heart, Plus, Flame, Leaf } from 'lucide-react';
import type { Product } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { formatMoney } from '@/services/calculations/money';
import { FavoritesRepository } from '@/services/storage/favoritesStorage';
import { useState } from 'react';

export default function ProductCard({
  product,
  onOpen,
  onQuickAdd,
}: {
  product: Product;
  onOpen: () => void;
  onQuickAdd: () => void;
}) {
  const { field, t } = useLanguage();
  const [fav, setFav] = useState(() => FavoritesRepository.isFavorite(product.id));

  const toggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFav(FavoritesRepository.toggle(product.id).includes(product.id));
  };

  return (
    <div
      onClick={onOpen}
      className="group animate-fade-up cursor-pointer overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated active:scale-[0.98]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-100 sm:aspect-square">
        <img
          src={product.image}
          alt={field(product, 'name')}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <button
          onClick={toggleFav}
          aria-label="Favorite"
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow backdrop-blur transition-colors"
        >
          <Heart size={16} className={fav ? 'fill-brand-600 text-brand-600' : 'text-ink-600'} />
        </button>
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.popular && (
            <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              {t('popular')}
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-ink-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              {t('newDish')}
            </span>
          )}
        </div>
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-900/60">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-ink-900">{t('soldOut')}</span>
          </div>
        )}
      </div>
      <div className="p-4 sm:p-3.5">
        <div className="flex items-start justify-between gap-1">
          <p className="line-clamp-2 text-base font-bold text-ink-900 sm:text-sm">{field(product, 'name')}</p>
          {product.spicy && <Flame size={14} className="mt-0.5 shrink-0 text-brand-500" />}
          {product.vegetarian && <Leaf size={14} className="mt-0.5 shrink-0 text-emerald-600" />}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-ink-400 sm:text-xs">{field(product, 'description')}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-base font-extrabold text-brand-600 sm:text-sm">{formatMoney(product.price)}</span>
          <button
            disabled={!product.available}
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd();
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white shadow-sm transition-transform hover:bg-brand-700 active:scale-90 disabled:opacity-40 sm:h-8 sm:w-8"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
