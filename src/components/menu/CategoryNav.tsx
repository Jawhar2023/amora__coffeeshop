import type { Category } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';

export default function CategoryNav({
  categories,
  activeId,
  onSelect,
}: {
  categories: Category[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const { field, t } = useLanguage();
  return (
    <div className="sticky top-0 z-20 -mx-4 bg-[#fbf6f1]/95 py-2 backdrop-blur">
      <div className="no-scrollbar flex gap-2.5 overflow-x-auto px-4 pb-1">
      <button
        onClick={() => onSelect(null)}
        className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
          activeId === null
            ? 'border-brand-600 bg-brand-600 text-white'
            : 'border-ink-200 bg-white text-ink-600 hover:border-brand-300'
        }`}
      >
        {t('categories')}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
            activeId === cat.id
              ? 'border-brand-600 bg-brand-600 text-white'
              : 'border-ink-200 bg-white text-ink-600 hover:border-brand-300'
          }`}
        >
          <span>{cat.icon}</span>
          {field(cat, 'name')}
        </button>
      ))}
      </div>
    </div>
  );
}
