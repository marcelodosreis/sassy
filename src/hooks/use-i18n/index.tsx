import { useContext } from "react";

import { I18nContext } from "@/contexts";

const useI18n = (basePath?: string) => {
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

export { useI18n };
