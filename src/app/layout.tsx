import { Poppins } from 'next/font/google';

import Toast from '@/components/Toast';
import { DatadogProvider } from '@/contexts/DatadogContext';
import { I18nProvider } from '@/contexts/i18nContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { loadTranslationsSSR } from '@/utils/loadTranslationsSSR';

import "@/styles/globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export async function generateStaticParams() {
  return [{ locale: 'en-US' }, { locale: 'pt-BR' }, { locale: 'es' }];
}

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const { translations, locale } = await loadTranslationsSSR();

  return (
    <html lang={locale}>
      <title>{translations.title}</title>
      <body className={poppins.className}>
        <I18nProvider locale={locale} translations={translations}>
          <DatadogProvider>
            <ToastProvider>
              {children}
              <Toast />
            </ToastProvider>
          </DatadogProvider>
        </I18nProvider>
      </body>
    </html>
  );
}