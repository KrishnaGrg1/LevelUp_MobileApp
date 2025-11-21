import LanguageStore, { Language } from '@/stores/language.store';
import { DEFAULT_LANGUAGE } from '@/translation/language';

// language imports
import arab from './arab';
import chin from './chin';
import en from './eng';
import fr from './fr';
import jap from './jap';
import lang from './lang';
import nep from './nep';
import span from './span';

// Types
type TranslationValue = string | Record<string, unknown>;
type TranslationContent = Record<string, TranslationValue>;

// All translations merged
const translations: Record<Language, TranslationContent> = {
  eng: { ...en, lang },
  fr: { ...fr, lang },
  arab: { ...arab, lang },
  chin: { ...chin, lang },
  nep: { ...nep, lang },
  span: { ...span, lang },
  jap: { ...jap, lang },
};

// Default locale
export const defaultLocale: Language = DEFAULT_LANGUAGE;

// Shared translation logic
function getTranslation(language: Language, key: string, fallback?: string): string {
  const langPack = translations[language];

  if (!langPack) return fallback || key;

  let value: unknown;

  // Case 1: namespace:key
  if (key.includes(':')) {
    const [namespace, rest] = key.split(':');

    const nsObject = langPack[namespace];
    if (!nsObject || typeof nsObject !== 'object') return fallback || key;

    const nestedKeys = rest.split('.');
    value = nsObject;

    for (const k of nestedKeys) {
      value = (value as Record<string, unknown>)?.[k];
      if (value === undefined) break;
    }
  }
  // Case 2: dot path
  else {
    const keys = key.split('.');
    value = langPack;

    for (const part of keys) {
      value = (value as Record<string, unknown>)?.[part];
      if (value === undefined) break;
    }
  }

  return typeof value === 'string' ? value : fallback || key;
}

// Hook to subscribe to language changes
export function useLanguage(): Language {
  const language = LanguageStore((state) => state.language);
  return language || defaultLocale;
}

// Hook for reactive translations (use this in components)
export function useTranslation() {
  const language = useLanguage();
  
  const translate = (key: string, fallback?: string): string => {
    return getTranslation(language, key, fallback);
  };

  return { t: translate, language };
}

export {
  DEFAULT_LANGUAGE,
  getLanguageDirection,
  getLanguageName,
  isRTLLanguage,
  isValidLanguage,
  VALID_LANGUAGES,
  validateLanguage
} from '@/translation/language';
