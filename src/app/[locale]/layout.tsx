import type { ReactNode } from 'react';

import { notFound } from 'next/navigation';

import { isSupportedLocale, SUPPORTED_LOCALES } from '@/lib/i18n-routing';
import LocaleProvider from '@/providers/LocaleProvider';

export const generateStaticParams = () => SUPPORTED_LOCALES.map((locale) => ({ locale }));

export default async function LocaleLayout({
    children,
    params
}: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!isSupportedLocale(locale)) {
        notFound();
    }

    return <LocaleProvider locale={locale}>{children}</LocaleProvider>;
}
