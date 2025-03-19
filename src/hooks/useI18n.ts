import { useContext } from "react";

import { I18nContext } from "@/contexts/i18nContext";

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
};
