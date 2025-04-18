import { cookies } from 'next/headers';

import { Translations } from '@/contexts/i18nContext';

import enUSLocale from '../../public/locales/en-US.json';
import ptBRLocale from '../../public/locales/pt-BR.json';

type SupportedLocale = 'en-US' | 'pt-BR';
type TranslationsMap = Record<SupportedLocale, Translations>;

const DEFAULT_LOCALE: SupportedLocale = 'en-US';

const translationsMap: TranslationsMap = {
  'en-US': enUSLocale,
  'pt-BR': ptBRLocale,
};

function isValidLocale(locale: string): locale is SupportedLocale {
  return Object.keys(translationsMap).includes(locale);
}

function resolveTranslationValue(obj: unknown, key: string): string {
  if (typeof obj === 'string') return obj;
  if (obj === undefined || obj === null) return key;
  if (typeof obj !== 'object') return key;
  return key;
}

export async function loadTranslationsSSR(locale?: string) {
  let resolvedLocale: SupportedLocale;

  if (locale && isValidLocale(locale)) {
    resolvedLocale = locale;
  } else {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get('locale')?.value;
    resolvedLocale = cookieLocale && isValidLocale(cookieLocale) 
      ? cookieLocale 
      : DEFAULT_LOCALE;
  }

  const translations = translationsMap[resolvedLocale];

  const translate = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations;

    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    return resolveTranslationValue(value, key);
  };

  return { 
    translate, 
    translations, 
    locale: resolvedLocale 
  };
}