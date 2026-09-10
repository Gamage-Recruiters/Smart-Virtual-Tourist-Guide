// ─── MyMemory Translation API Service ─────────────────────────────────────────
// Free translation API — no API key required
// Docs: https://mymemory.translated.net/doc/spec.php
// Limit: 5,000 chars/day (anonymous), 50,000/day with email registration

const MYMEMORY_BASE = 'https://api.mymemory.translated.net/get';

/**
 * Curated list of tourist-relevant languages supported by MyMemory.
 * Each entry: { code, name, flag }
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'en',    name: 'English',              flag: '🇬🇧' },
  { code: 'si',    name: 'Sinhala',              flag: '🇱🇰' },
  { code: 'ta',    name: 'Tamil',                flag: '🇱🇰' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'ja',    name: 'Japanese',             flag: '🇯🇵' },
  { code: 'ko',    name: 'Korean',               flag: '🇰🇷' },
  { code: 'hi',    name: 'Hindi',                flag: '🇮🇳' },
  { code: 'ru',    name: 'Russian',              flag: '🇷🇺' },
  { code: 'fr',    name: 'French',               flag: '🇫🇷' },
  { code: 'de',    name: 'German',               flag: '🇩🇪' },
  { code: 'es',    name: 'Spanish',              flag: '🇪🇸' },
  { code: 'it',    name: 'Italian',              flag: '🇮🇹' },
  { code: 'pt',    name: 'Portuguese',           flag: '🇵🇹' },
  { code: 'ar',    name: 'Arabic',               flag: '🇸🇦' },
  { code: 'th',    name: 'Thai',                 flag: '🇹🇭' },
  { code: 'nl',    name: 'Dutch',                flag: '🇳🇱' },
  { code: 'sv',    name: 'Swedish',              flag: '🇸🇪' },
  { code: 'uk',    name: 'Ukrainian',            flag: '🇺🇦' },
  { code: 'pl',    name: 'Polish',               flag: '🇵🇱' },
  { code: 'tr',    name: 'Turkish',              flag: '🇹🇷' },
  { code: 'vi',    name: 'Vietnamese',           flag: '🇻🇳' },
  { code: 'id',    name: 'Indonesian',           flag: '🇮🇩' },
  { code: 'ms',    name: 'Malay',                flag: '🇲🇾' },
];


/**
 * Translate text using MyMemory API.
 *
 * @param {string} text        - Text to translate
 * @param {string} sourceLang  - Source language code (e.g. 'en')
 * @param {string} targetLang  - Target language code (e.g. 'si')
 * @returns {Promise<string>}  - Translated text
 */
export async function translateText(text, sourceLang, targetLang) {
  const trimmed = text.trim();
  if (!trimmed) return '';

  // Same language — return as-is
  if (sourceLang === targetLang) return trimmed;

  const params = new URLSearchParams({
    q: trimmed,
    langpair: `${sourceLang}|${targetLang}`,
  });

  const res = await fetch(`${MYMEMORY_BASE}?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`Translation request failed (HTTP ${res.status})`);
  }

  const data = await res.json();

  if (data.responseStatus === 200) {
    return data.responseData.translatedText;
  }

  // Handle known error codes
  if (data.responseStatus === 429) {
    throw new Error('Daily translation limit reached. Please try again tomorrow.');
  }

  throw new Error(data.responseDetails || 'Translation failed. Please try again.');
}
