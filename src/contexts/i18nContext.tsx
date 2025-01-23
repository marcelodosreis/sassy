'use client';

import { createContext, ReactNode } from 'react';

export interface I18nContextProps {
  locale: string;
  translate: (key: string) => string;
}

export const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export const I18nProvider = ({
  children,
  locale,
  translations,
}: {
  children: ReactNode;
  locale: string;
  translations: Record<string, string>;
}) => {
  const translate = (key: string) => translations[key] || key;

  return (
    <I18nContext.Provider value={{ locale, translate }}>
      {children}
    </I18nContext.Provider>
  );
};