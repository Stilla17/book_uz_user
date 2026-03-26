'use client'
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './public/locales/en/translation.json';
import ru from './public/locales/ru/translation.json';
import uz from './public/locales/uz/translation.json';

export const LANGUAGE_STORAGE_KEY = 'bookuz-language';

const getInitialLanguage = () => {
    if (typeof window === 'undefined') {
        return 'uz';
    }

    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (savedLanguage === 'uz' || savedLanguage === 'ru' || savedLanguage === 'en') {
        return savedLanguage;
    }

    return 'uz';
};

if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
        resources: {
            en: { translation: en },
            ru: { translation: ru },
            uz: { translation: uz },
        },
        lng: getInitialLanguage(),
        fallbackLng: 'uz',
        interpolation: {
            escapeValue: false,
        },
        react: {
            transSupportBasicHtmlNodes: true,
            transKeepBasicHtmlNodesFor: ["br", "strong", "i", "b", "span"],
        },
    });
}

export default i18n;
