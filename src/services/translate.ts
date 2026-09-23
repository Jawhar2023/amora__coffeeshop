// Free, keyless machine-translation lookup (MyMemory) used for the admin's
// "AI Translate" convenience button. Best-effort only — never blocks saving,
// and the admin can always edit the result by hand.
export async function translateText(text: string, target: 'fr' | 'ar'): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=en|${target}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Translation request failed');
  const data = await res.json();
  const translated = data?.responseData?.translatedText;
  if (!translated || typeof translated !== 'string') throw new Error('No translation returned');
  return translated;
}
