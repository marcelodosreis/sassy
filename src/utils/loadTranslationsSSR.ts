import { cookies } from 'next/headers';

import enUSLocale from '../../public/locales/en-US_2.json';
import ptBRLocale from '../../public/locales/pt-BR.json';

import { Translations } from '@/contexts/i18nContext';

export async function loadTranslationsSSR(locale?: string): Promise<{ translate: (key: string) => string; translations: Translations; locale: string }> {
    let resolvedLocale: string = locale || 'en-US';

    if (!locale) {
        const cookieStore = await cookies();
        resolvedLocale = cookieStore.get('locale')?.value || 'en-US';
    }

    const translationsMap: Record<string, Translations> = {
        'en-US': enUSLocale,
        'pt-BR': ptBRLocale,
    };

    const translations = translationsMap[resolvedLocale as keyof typeof translationsMap] || enUSLocale;

    const translate = (key: string): string => {
        const keys = key.split('.');
        let currentTranslation: any = translations;

        for (const k of keys) {
            if (currentTranslation && typeof currentTranslation === 'object' && k in currentTranslation) {
                currentTranslation = currentTranslation[k];
            } else {
                return key; // retorna a chave se não encontrar a tradução
            }
        }

        return currentTranslation || key;
    };

    return { translate, translations, locale: resolvedLocale };
}

