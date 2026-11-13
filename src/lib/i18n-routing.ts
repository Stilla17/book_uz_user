export const SUPPORTED_LOCALES = ['uz', 'uz-Cyrl', 'ru', 'en'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const isSupportedLocale = (value: string): value is SupportedLocale =>
    SUPPORTED_LOCALES.includes(value as SupportedLocale);

export const getLocalizedPath = (locale: string, path: string) => {
    const currentLocale = isSupportedLocale(locale) ? locale : 'uz';

    if (path === '/') return `/${currentLocale}`;

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `/${currentLocale}${normalizedPath}`;
};
