import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, LanguageCode, TranslationKey } from '../i18n/translations';

const LANGUAGE_STORAGE_KEY = '@aolo_user_language';

interface LanguageState {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  t: (key: TranslationKey, defaultText?: string) => string;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'en',
  setLanguage: async (lang: LanguageCode) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (e) {
      console.warn('[useLanguageStore] Failed to persist language:', e);
    }
    set({ language: lang });
  },
  t: (key: TranslationKey, defaultText?: string): string => {
    const currentLang = get().language;
    const val = translations[currentLang]?.[key] || translations['en']?.[key] || defaultText || String(key);
    return String(val);
  },
}));

// Auto-restore saved language preference on app launch
AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
  .then((saved) => {
    if (saved && (saved in translations)) {
      useLanguageStore.setState({ language: saved as LanguageCode });
    }
  })
  .catch(() => {});
