import { useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import type { Language } from '@/types';

const OPTIONS: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية', flag: '🇹🇳' },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = OPTIONS.find((o) => o.code === language)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
        aria-label="Language"
      >
        <Globe size={18} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-20 w-40 overflow-hidden rounded-xl bg-white py-1 shadow-elevated">
            {OPTIONS.map((opt) => (
              <button
                key={opt.code}
                onClick={() => {
                  setLanguage(opt.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-medium ${
                  opt.code === language ? 'bg-brand-50 text-brand-700' : 'text-ink-800 hover:bg-ink-50'
                }`}
              >
                <span>{opt.flag}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
