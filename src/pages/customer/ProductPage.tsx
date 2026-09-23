import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Minus, Plus, Heart } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { ProductRepository, AddOnRepository } from '@/services/storage/menuStorage';
import { FavoritesRepository, RecentlyViewedRepository } from '@/services/storage/favoritesStorage';
import { formatMoney, sumMoney } from '@/services/calculations/money';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import AddedToOrderSheet, { type AddedItemSummary } from '@/components/cart/AddedToOrderSheet';
import type { CartItemOption } from '@/types';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, field } = useLanguage();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const product = useMemo(() => (id ? ProductRepository.getById(id) : undefined), [id]);
  const addOnGroups = useMemo(
    () => (product ? AddOnRepository.getByIds(product.addOnGroups) : []),
    [product]
  );

  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [fav, setFav] = useState(() => (product ? FavoritesRepository.isFavorite(product.id) : false));
  const [addedItem, setAddedItem] = useState<AddedItemSummary | null>(null);

  useState(() => {
    if (product) RecentlyViewedRepository.add(product.id);
  });

  if (!product) {
    return (
      <div className="p-6 text-center text-ink-600">
        Product not found.
        <button onClick={() => navigate('/menu')} className="mt-2 block text-brand-600 underline">
          Back to menu
        </button>
      </div>
    );
  }

  const toggleOption = (groupId: string, optionId: string, single: boolean) => {
    setSelections((prev) => {
      const current = prev[groupId] ?? [];
      if (single) {
        return { ...prev, [groupId]: current.includes(optionId) ? [] : [optionId] };
      }
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...prev, [groupId]: next };
    });
  };

  const selectedOptions: CartItemOption[] = addOnGroups.flatMap((group) =>
    (selections[group.id] ?? []).map((optId) => {
      const opt = group.options.find((o) => o.id === optId)!;
      return {
        groupId: group.id,
        groupName: field(group, 'name'),
        optionId: opt.id,
        optionName: field(opt, 'name'),
        price: opt.price,
      };
    })
  );

  const unitPrice = product.discountPrice ?? product.price;
  const optionsTotal = sumMoney(selectedOptions.map((o) => o.price));
  const lineTotal = sumMoney([unitPrice, optionsTotal]) * quantity;

  const requiredMissing = addOnGroups.some((g) => g.required && (selections[g.id] ?? []).length === 0);

  const handleAdd = () => {
    if (requiredMissing) {
      showToast('Please complete required options', 'error');
      return;
    }
    addItem({
      productId: product.id,
      name: field(product, 'name'),
      image: product.image,
      unitPrice,
      quantity,
      options: selectedOptions,
      notes,
    });
    setAddedItem({ name: field(product, 'name'), image: product.image, quantity, lineTotal });
  };

  const closeAddedSheet = () => {
    setAddedItem(null);
    navigate(-1);
  };

  return (
    <div className="pb-32">
      <div className="relative aspect-square w-full animate-fade-up bg-cream-100">
        <img src={product.image} alt={field(product, 'name')} className="h-full w-full object-cover" />
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow backdrop-blur"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={() => setFav(FavoritesRepository.toggle(product.id).includes(product.id))}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow backdrop-blur"
        >
          <Heart size={18} className={fav ? 'fill-brand-600 text-brand-600' : 'text-ink-600'} />
        </button>
      </div>

      <div className="rounded-t-3xl bg-white px-5 pb-4 pt-5 -mt-5 relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-[var(--font-display)] text-xl font-bold text-ink-900">{field(product, 'name')}</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-ink-600">
              <span className="flex items-center gap-1 font-semibold text-amber-500">
                <Star size={14} className="fill-amber-500" /> {product.rating.toFixed(1)}
              </span>
              <span className="text-ink-400">({product.reviewCount} {t('ratingLabel')})</span>
            </div>
          </div>
          <span className="whitespace-nowrap text-lg font-extrabold text-brand-600">{formatMoney(unitPrice)}</span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-ink-600">{field(product, 'description')}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.spicy && <Badge tone="danger">🌶 Spicy</Badge>}
          {product.vegetarian && <Badge tone="success">🌱 Vegetarian</Badge>}
          <Badge tone="neutral">
            <Clock size={12} /> {product.preparationTime} min
          </Badge>
        </div>

        {product.ingredients.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-bold text-ink-900">{t('ingredients')}</p>
            <p className="mt-1 text-sm text-ink-600">{product.ingredients.join(', ')}</p>
          </div>
        )}
        {product.allergens.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-bold text-ink-900">{t('allergens')}</p>
            <p className="mt-1 text-sm text-ink-600">{product.allergens.join(', ')}</p>
          </div>
        )}

        {addOnGroups.map((group) => (
          <div key={group.id} className="mt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-ink-900">{field(group, 'name')}</p>
              <Badge tone={group.required ? 'brand' : 'neutral'}>
                {group.required ? t('required') : t('optional')}
              </Badge>
            </div>
            <div className="mt-2 divide-y divide-ink-100 rounded-xl border border-ink-100">
              {group.options.map((opt) => {
                const single = !!group.maxSelections && group.maxSelections === 1;
                const checked = (selections[group.id] ?? []).includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleOption(group.id, opt.id, single || group.required && group.options.length > 2 ? single : false)}
                    className="flex w-full items-center justify-between px-3.5 py-3 text-left"
                  >
                    <span className="text-sm text-ink-800">{field(opt, 'name')}</span>
                    <span className="flex items-center gap-2">
                      {opt.price > 0 && <span className="text-xs font-semibold text-ink-500">+{formatMoney(opt.price)}</span>}
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 text-white ${
                          checked ? 'border-brand-600 bg-brand-600' : 'border-ink-300'
                        }`}
                      >
                        {checked && <Plus size={12} className="rotate-45" />}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-5">
          <p className="text-sm font-bold text-ink-900">{t('notes')}</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('specialInstructions')}
            rows={2}
            className="mt-2 w-full rounded-xl border border-ink-200 bg-ink-50 px-3.5 py-2.5 text-sm outline-none placeholder:text-ink-400 focus:border-brand-400"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-ink-100 bg-white/95 px-5 py-3.5 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 rounded-full border border-ink-200 px-2 py-1.5">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-100 text-ink-700"
            >
              <Minus size={14} />
            </button>
            <span className="w-4 text-center text-sm font-bold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white"
            >
              <Plus size={14} />
            </button>
          </div>
          <Button
            variant="primary"
            size="lg"
            full
            disabled={!product.available}
            onClick={handleAdd}
            className="flex-1"
          >
            {product.available ? `${t('addToOrder')} · ${formatMoney(lineTotal)}` : t('unavailable')}
          </Button>
        </div>
      </div>

      <AddedToOrderSheet open={!!addedItem} onClose={closeAddedSheet} item={addedItem} />
    </div>
  );
}
