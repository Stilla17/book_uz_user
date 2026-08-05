'use client';

import { ReactNode, useEffect } from 'react';

import i18n from '../../i18n';
import { I18nextProvider } from 'react-i18next';

const I18nProvider = ({ children }: { children: ReactNode }) => {
    useEffect(() => {
        const updateDocumentLanguage = (language: string) => {
            document.documentElement.lang = language;
        };

        updateDocumentLanguage(i18n.resolvedLanguage || i18n.language || 'uz');
        i18n.on('languageChanged', updateDocumentLanguage);

        return () => {
            i18n.off('languageChanged', updateDocumentLanguage);
        };
    }, []);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default I18nProvider;
