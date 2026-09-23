import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { formatMoney } from '@/services/calculations/money';
import Button from '@/components/ui/Button';
import BottomSheet from '@/components/ui/BottomSheet';

export interface AddedItemSummary {
  name: string;
  image: string;
  quantity: number;
  lineTotal: number;
}

export default function AddedToOrderSheet({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: () => void;
  item: AddedItemSummary | null;
}) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  if (!item) return null;

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 px-5 pb-7 pt-8 text-center text-white">
        <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-white/10" />
        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur animate-pop">
          <CheckCircle2 size={30} />
        </div>
        <p className="relative mt-3 font-[var(--font-display)] text-xl font-extrabold">{t('added')}</p>
      </div>

      <div className="px-5 py-5">
        <div className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-3 shadow-card">
          <img src={item.image} alt={item.name} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink-900">{item.name}</p>
            <p className="text-xs text-ink-400">{t('quantity')}: {item.quantity}</p>
          </div>
          <span className="text-sm font-extrabold text-brand-600">{formatMoney(item.lineTotal)}</span>
        </div>

        <div className="mt-5 flex gap-3">
          <Button variant="ghost" full onClick={onClose}>
            {t('menu')}
          </Button>
          <Button
            variant="primary"
            full
            icon={<ShoppingBag size={16} />}
            onClick={() => navigate('/cart')}
          >
            {t('yourCart')} <ArrowRight size={15} />
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
