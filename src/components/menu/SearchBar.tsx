import { Search } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { t } = useLanguage();
  return (
    <div className="relative">
      <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('searchPlaceholder')}
        className="w-full rounded-2xl border border-ink-200 bg-white py-3 pl-10 pr-4 text-sm text-ink-900 shadow-card outline-none placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
    </div>
  );
}
