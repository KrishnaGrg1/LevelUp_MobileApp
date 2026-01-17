import LanguageStore, { Language } from '@/stores/language.store';
import { DEFAULT_LANGUAGE } from '@/translation/language';
import { useShallow } from 'zustand/react/shallow';

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

// Get current language from store
function getCurrentLanguage(): Language {
  return LanguageStore.getState().language || DEFAULT_LANGUAGE;
}

// Shared translation logic
const missingKeyHandler = (lngs: string[], ns: string, key: string, fallback?: string) => {
  console.warn(`Missing key: ${key} in ${ns} for ${lngs.join(', ')}`);
};

function getTranslation(language: Language, key: string, fallback?: string): string {
  const langPack = translations[language];

  if (!langPack) {
    missingKeyHandler([language], 'root', key, fallback);
    return fallback || key;
  }

  let value: unknown;
  let namespace = 'common';

  // Case 1: namespace:key
  if (key.includes(':')) {
    const [ns, rest] = key.split(':');
    namespace = ns;

    const nsObject = langPack[namespace];
    if (!nsObject || typeof nsObject !== 'object') {
       missingKeyHandler([language], namespace, key, fallback);
       return fallback || key;
    }

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
    // Try to guess namespace from first key for logging, though not strictly accurate for flat structures
    namespace = keys[0];

    for (const part of keys) {
      value = (value as Record<string, unknown>)?.[part];
      if (value === undefined) break;
    }
  }

  if (value === undefined) {
    missingKeyHandler([language], namespace, key, fallback);
  }

  return typeof value === 'string' ? value : fallback || key;
}

// Enhanced translation function with parameter replacement
export function t(key: string, params?: Record<string, string | number> | string): string {
  const currentLang = getCurrentLanguage();
  const keys = key.split('.');
  const fallback = typeof params === 'string' ? params : undefined;
  const replacements = typeof params === 'object' ? params : undefined;

  let value: unknown = translations[currentLang];
  let namespace = 'common';

  // Handle namespace:key format (e.g., "success:login")
  if (key.includes(':')) {
    const [ns, ...restKeys] = key.split(':');
    namespace = ns;
    const actualKey = restKeys.join(':');
    const langTranslations = translations[currentLang] as TranslationContent;
    value = langTranslations?.[namespace];

    if (value && actualKey) {
      const nestedKeys = actualKey.split('.');
      for (const nestedKey of nestedKeys) {
        value = (value as Record<string, unknown>)?.[nestedKey];
        if (value === undefined) break;
      }
    } else {
        value = undefined;
    }
  } else {
    // Handle dot notation (e.g., "auth.login.title")
    namespace = keys[0];
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
      if (value === undefined) break;
    }
  }

  if (value === undefined) {
    missingKeyHandler([currentLang], namespace, key, fallback);
  }

  let result = typeof value === 'string' ? value : fallback || key;

  // Replace parameters in the string (e.g., {minutes} -> 30)
  if (replacements) {
    Object.entries(replacements).forEach(([param, paramValue]) => {
      result = result.replace(new RegExp(`\\{${param}\\}`, 'g'), String(paramValue));
    });
  }

  return result;
}

// FIXED: Hook to subscribe to language changes
// Always returns a language, never conditionally
export function useLanguage(): Language {
  // Use useShallow to combine both selectors
  const { language, hasHydrated } = LanguageStore(
    useShallow(state => ({
      language: state.language,
      hasHydrated: state._hasHydrated,
    })),
  );

  // Always return a language - no conditional returns
  // If not hydrated or no language, use default
  if (!hasHydrated || !language) {
    return defaultLocale;
  }

  return language;
}

// FIXED: Hook for reactive translations
export function useTranslation() {
  // This always calls the same number of hooks
  const language = useLanguage();

  const translate = (key: string, fallback?: string): string => {
    return getTranslation(language, key, fallback);
  };

  return { t: translate, language };
}

// Export selective hooks for better performance
export const useLanguageHydrated = () => LanguageStore(state => state._hasHydrated);

export const useSetLanguage = () => LanguageStore(state => state.setLanguage);

export {
  DEFAULT_LANGUAGE,
  getLanguageDirection,
  getLanguageName,
  isRTLLanguage,
  isValidLanguage,
  VALID_LANGUAGES,
  validateLanguage
} from '@/translation/language';

