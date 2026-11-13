'use client';

import { useParams } from 'next/navigation';

import { getLocalizedPath } from '@/lib/i18n-routing';

export function useLocalePath() {
    const params = useParams<{ locale?: string }>();
    const locale = params?.locale || 'uz';

    return (path: string) => getLocalizedPath(locale, path);
}
