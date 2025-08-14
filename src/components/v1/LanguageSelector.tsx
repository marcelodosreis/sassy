'use client';

import { useI18n } from "@/contexts/i18nContext";

const LanguageSelector = () => {
  const { locale } = useI18n();

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value;
    document.cookie = `locale=${newLocale}; path=/`;
    window.location.reload();
  };

  return (
    <select
      className="text-center text-sm text-gray-600"
      onChange={handleChange}
      value={locale}
    >
      <option value="en-US">
        🇺🇸
      </option>
      <option value="pt-BR">
        🇧🇷
      </option>
    </select>
  );
};

export default LanguageSelector;
