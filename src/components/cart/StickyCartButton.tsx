import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/i18n/LanguageContext';
import { formatMoney } from '@/services/calculations/money';

export default function StickyCartButton() {
  const { itemCount, subtotal, addonsTotal } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (itemCount === 0) return null;

  return (
    <button
      onClick={() => navigate('/cart')}
      className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-2xl bg-brand-600 px-5 py-3.5 text-white shadow-elevated transition-transform active:scale-[0.98]"
    >
      <span className="flex items-center gap-2 text-sm font-bold">
        <span className="relative">
          <ShoppingBag size={20} />
          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-brand-600">
            {itemCount}
          </span>
        </span>
        {t('yourCart')}
      </span>
      <span className="text-sm font-extrabold">{formatMoney(subtotal + addonsTotal)}</span>
    </button>
  );
}
