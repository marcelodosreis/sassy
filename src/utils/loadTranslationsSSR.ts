import { cookies } from 'next/headers';

import enUSLocale from '../../public/locales/en-US.json';
import ptBRLocale from '../../public/locales/pt-BR.json';

type Translations = Record<string, string>;

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
    const translate = (key: string) => translations[key] || key;

    return { translate, translations, locale: resolvedLocale };
}
