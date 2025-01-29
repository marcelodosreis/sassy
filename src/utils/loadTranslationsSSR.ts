import { cookies } from 'next/headers';

import enUSLocale from '../../public/locales/en-US.json';
import ptBRLocale from '../../public/locales/pt-BR.json';

type Translations = Record<string, string>;

export const loadTranslationsSSR = async (): Promise<{ translate: (key: string) => string; translations: Translations; locale: string }> => {
    const cookieStore = await cookies();
    const locale = cookieStore.get('locale')?.value || 'en-US';

    const translationsMap: Record<string, Translations> = {
        'en-US': enUSLocale,
        'pt-BR': ptBRLocale,
    };

    const translations = translationsMap[locale] || enUSLocale;
    const translate = (key: string) => translations[key] || key;

    return { translate, translations, locale };
};
