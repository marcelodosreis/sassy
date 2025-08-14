"use client";

import { createContext, ReactNode, useContext } from "react";

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

export const useI18n = (basePath?: string) => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }

  const { translate } = context;

  type TFunction = typeof translate;

  const scopedT: TFunction = (key: string) => {
    const fullKey = basePath ? `${basePath}.${key}` : key;
    return translate(fullKey);
  };

  return {
    ...context,
    translate: scopedT,
  };
};

