import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'es', 'zh', 'fr'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  zh: '中文',
  fr: 'Français',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  zh: '🇨🇳',
  fr: '🇫🇷',
};

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = locale ?? 'en';
  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  };
});

