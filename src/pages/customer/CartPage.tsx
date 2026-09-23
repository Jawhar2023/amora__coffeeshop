import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, Tag, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { SettingsRepository } from '@/services/storage/settingsStorage';
import { PromoRepository } from '@/services/storage/promoStorage';
import { OrderRepository } from '@/services/storage/orderStorage';
import { CustomerRepository } from '@/services/storage/customerStorage';
import { calcOrderTotals } from '@/services/calculations/order';
import { formatMoney } from '@/services/calculations/money';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import type { PromoCode } from '@/types';

export default function CartPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const { showToast } = useToast();
  const settings = SettingsRepository.get();

  const [code, setCode] = useState('');
  const [promo, setPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');

  const totals = useMemo(() => calcOrderTotals(items, promo), [items, promo]);

  const handleApplyPromo = () => {
    if (!code.trim()) return;
    const result = PromoRepository.validate(code, totals.subtotal + totals.addonsTotal);
    if (!result.valid || !result.promo) {
      setPromoError(t('invalidPromo'));
      setPromo(null);
      return;
    }
    setPromo(result.promo);
    setPromoError('');
  };

  const handlePlaceOrder = () => {
    const order = OrderRepository.create(items, promo);
    if (promo) PromoRepository.incrementUsage(promo.id);
    const customer = CustomerRepository.getOrCreateGuest();
    CustomerRepository.recordOrder(customer.id, order.total);

    clearCart();
    showToast(t('orderConfirmed'));
    navigate(`/order/${order.id}`);
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header onBack={() => navigate(-1)} title={t('yourCart')} />
        <div className="flex-1">
          <EmptyState
            icon="🛒"
            title={t('emptyCartTitle')}
            subtitle={t('emptyCartSubtitle')}
            action={
              <Button onClick={() => navigate('/menu')} className="mt-2">
                {t('menu')}
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-40">
      <Header onBack={() => navigate(-1)} title={t('yourCart')} />

      <div className="divide-y divide-ink-100 px-5">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 py-4">
            <img src={item.image} alt={item.name} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-ink-900">{item.name}</p>
                <button onClick={() => { removeItem(item.id); showToast(t('itemRemoved'), 'info'); }} className="text-ink-400">
                  <Trash2 size={16} />
                </button>
              </div>
              {item.options.length > 0 && (
                <p className="mt-0.5 text-xs text-ink-400">
                  {item.options.map((o) => o.optionName).join(', ')}
                </p>
              )}
              {item.notes && <p className="mt-0.5 text-xs italic text-ink-400">"{item.notes}"</p>}
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-extrabold text-brand-600">{formatMoney(item.unitPrice)}</span>
                <div className="flex items-center gap-2 rounded-full border border-ink-200 px-1.5 py-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-100"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-4 text-center text-xs font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {settings.enablePromoCodes && (
        <div className="mt-2 px-5">
          <p className="text-sm font-bold text-ink-900">{t('haveCode')}</p>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-dashed border-brand-300 bg-brand-50 p-1.5">
            <Tag size={16} className="ml-2 shrink-0 text-brand-500" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t('enterCode')}
              className="min-w-0 flex-1 bg-transparent px-1 text-sm font-semibold uppercase tracking-wide text-brand-700 outline-none placeholder:text-brand-300 placeholder:normal-case"
            />
            <Button size="sm" onClick={handleApplyPromo}>
              {t('apply')}
            </Button>
          </div>
          {promo && (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <CheckCircle2 size={14} /> {t('promoApplied')}: {promo.description}
            </p>
          )}
          {promoError && <p className="mt-1.5 text-xs font-semibold text-red-600">{promoError}</p>}
        </div>
      )}

      <div className="mt-5 space-y-2 px-5">
        <p className="text-sm font-bold text-ink-900">Payment Summary</p>
        <Row label={t('subtotal')} value={formatMoney(totals.subtotal)} />
        {totals.addonsTotal > 0 && <Row label={t('addons')} value={formatMoney(totals.addonsTotal)} />}
        {totals.discount > 0 && <Row label={t('discount')} value={`-${formatMoney(totals.discount)}`} highlight="text-emerald-600" />}
        <div className="mt-2 flex items-center justify-between border-t border-ink-100 pt-2">
          <span className="text-sm font-bold text-ink-900">{t('total')}</span>
          <span className="text-lg font-extrabold text-brand-600">{formatMoney(totals.total)}</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-ink-100 bg-white/95 px-5 py-3.5 backdrop-blur">
        <Button size="lg" full onClick={handlePlaceOrder}>
          {t('orderAndPayNow')} · {formatMoney(totals.total)}
        </Button>
      </div>
    </div>
  );
}

function Header({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <div className="flex items-center gap-3 px-5 pb-2 pt-5">
      <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100">
        <ArrowLeft size={18} />
      </button>
      <h1 className="text-lg font-extrabold text-ink-900">{title}</h1>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-500">{label}</span>
      <span className={`font-semibold text-ink-800 ${highlight ?? ''}`}>{value}</span>
    </div>
  );
}
