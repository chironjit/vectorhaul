import {
  type Component,
  type JSX,
  createContext,
  createSignal,
  onMount,
  useContext,
} from 'solid-js';
import type { Locale } from '../translations';
import { translations } from '../translations';

const STORAGE_KEY = 'frontpage-locale';

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'ms') return stored;
  return 'en';
}

function getByPath(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

type LanguageContextValue = {
  locale: () => Locale;
  setLocale: (lang: Locale) => void;
  t: (key: string) => unknown;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}

export const LanguageProvider: Component<{ children: JSX.Element }> = (
  props
) => {
  const [locale, setLocaleSignal] = createSignal<Locale>(getStoredLocale());

  const setLocale = (lang: Locale) => {
    setLocaleSignal(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    }
  };

  const t = (key: string): unknown => {
    const data = translations[locale()] as unknown as Record<string, unknown>;
    return getByPath(data, key);
  };

  onMount(() => {
    document.documentElement.lang = locale();
  });

  const value: LanguageContextValue = {
    locale: locale as () => Locale,
    setLocale,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {props.children}
    </LanguageContext.Provider>
  );
};
