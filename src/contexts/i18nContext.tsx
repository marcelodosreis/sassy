"use client";

import { createContext, ReactNode } from "react";

export interface I18nContextProps {
  locale: string;
  translate: (key: string) => string;
}

export const I18nContext = createContext<I18nContextProps | undefined>(
  undefined
);

export interface Translations {
  [key: string]: string | Translations;
}

export const I18nProvider = ({
  children,
  locale,
  translations,
}: {
  children: ReactNode;
  locale: string;
  translations: Translations;
}) => {
  const translate = (key: string): string => {
    const keys = key.split(".");
    let value: unknown = translations;
    for (const k of keys) {
      if (typeof value === "object" && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    return typeof value === "string" ? value : key;
  };

  return (
    <I18nContext.Provider value={{ locale, translate }}>
      {children}
    </I18nContext.Provider>
  );
};
