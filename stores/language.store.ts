import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Language = 'eng' | 'nep' | 'fr' | 'arab' | 'chin' | 'span' | 'jap';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'eng',
      setLanguage: (lang: Language) => set({ language: lang }),
    }),
    {
      name: 'levelup-language',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default LanguageStore;