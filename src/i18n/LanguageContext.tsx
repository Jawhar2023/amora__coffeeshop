import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Language } from '@/types';
import { translations, type TranslationKey } from './translations';
import { readKey, writeKey, StorageKeys } from '@/services/storage/storageService';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  dir: 'ltr' | 'rtl';
  field: <T extends object>(obj: T, base: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() =>
    readKey<Language>(StorageKeys.language, 'en')
  );

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    writeKey(StorageKeys.language, lang);
  };

  const t = (key: TranslationKey) => translations[language][key] ?? translations.en[key];

  // Reads a localized field like `name` -> `nameFr` / `nameAr` from any object.
  function field<T extends object>(obj: T, base: string): string {
    const record = obj as Record<string, unknown>;
    if (language === 'en') return String(record[base] ?? '');
    const suffix = language === 'fr' ? 'Fr' : 'Ar';
    const key = `${base}${suffix}`;
    return String(record[key] ?? record[base] ?? '');
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, field }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
