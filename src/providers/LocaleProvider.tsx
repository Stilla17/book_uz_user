'use client';

import { useEffect, type ReactNode } from 'react';

import i18n, { LANGUAGE_STORAGE_KEY } from '../../i18n';

export default function LocaleProvider({ children, locale }: { children: ReactNode; locale: string }) {
    useEffect(() => {
        void i18n.changeLanguage(locale);
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
    }, [locale]);

    return children;
}
