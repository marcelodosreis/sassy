import fs from 'fs';
import path from 'path';

import { cookies } from 'next/headers';

import { Poppins } from 'next/font/google'

import Toast from '@/components/Toast';
import { DatadogProvider } from '@/contexts/DatadogContext';
import { I18nProvider } from '@/contexts/i18nContext';
import { ToastProvider } from '@/contexts/ToastContext';

import "@/styles/globals.css";


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900',]
})

export async function generateStaticParams() {
  return [{ locale: 'en-US' }, { locale: 'pt-BR' }, { locale: 'es' }];
}

const loadTranslations = (locale: string): Record<string, string> => {
  const filePath = path.join(process.cwd(), 'public', 'locales', `${locale}.json`);
  const file = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(file);
};

type Props = {
  children: React.ReactNode;
}
export default async function RootLayout({ children }: Props) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('locale')?.value || 'en-US';
  const translations = loadTranslations(locale);

  return (
    <html lang={locale}>
      <title>Sassy - powerful micro-saas template</title>
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
