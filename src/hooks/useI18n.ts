import { useContext } from "react";

import { I18nContext, I18nContextProps } from "@/contexts/i18nContext";

export const useI18n = (): I18nContextProps => {
    const context = useContext(I18nContext);
    if (!context) {
      throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
  };
  