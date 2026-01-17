// Remove the persist middleware entirely for testing
import { create } from 'zustand';

export type Language = 'eng' | 'nep' | 'fr' | 'arab' | 'chin' | 'span' | 'jap';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  _hasHydrated: boolean;
}

const LanguageStore = create<LanguageState>(set => ({
  language: 'eng',
  setLanguage: (lang: Language) => {
    console.log('🌍 Setting language to:', lang);
    set({ language: lang });

    // Don't persist at all for now - just test
    // We'll add manual persistence later if this fixes it
  },
  _hasHydrated: true, // Always true since we're not persisting
}));

export default LanguageStore;
