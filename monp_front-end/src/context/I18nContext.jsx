import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, supportedLocales, defaultLocale, getNestedValue } from '../i18n/translations';

const I18nContext = createContext(null);

const STORAGE_KEY = 'kp-locale';

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && supportedLocales.includes(stored)) return stored;

    const browserLang = navigator.language?.split('-')[0];
    return supportedLocales.includes(browserLang) ? browserLang : defaultLocale;
  });

  const setLocale = useCallback((newLocale) => {
    if (supportedLocales.includes(newLocale)) {
      setLocaleState(newLocale);
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale === 'fr' ? 'fr' : 'en';
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'en' ? 'fr' : 'en');
  }, [locale, setLocale]);

  const t = useCallback(
    (path, params = {}) => {
      const value = getNestedValue(translations[locale], path);
      if (!value) return path;

      return Object.entries(params).reduce(
        (str, [key, val]) => str.replace(`{{${key}}}`, val),
        value,
      );
    },
    [locale],
  );

  useEffect(() => {
    document.documentElement.lang = locale === 'fr' ? 'fr' : 'en';
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
