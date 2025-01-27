'use client';

import { useI18n } from "@/hooks/useI18n";

const LanguageSelector = () => {
    const { locale } = useI18n();

    const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = event.target.value;

        document.cookie = `locale=${newLocale}; path=/`;
        window.location.reload();
    };

    return (
        <select onChange={handleChange} value={locale}>
            <option value="en-US">English</option>
            <option value="pt-BR">Português</option>
        </select>
    );
};

export default LanguageSelector;
