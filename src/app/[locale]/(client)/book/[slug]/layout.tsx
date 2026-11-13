import type { ReactNode } from 'react';

import { createBookMetadata, fetchBookSeoData } from '@/lib/seo';

type BookLayoutProps = {
    children: ReactNode;
    params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: BookLayoutProps) {
    const { locale, slug } = await params;
    const book = await fetchBookSeoData(slug);

    return createBookMetadata(book, slug, locale);
}

export default function BookLayout({ children }: BookLayoutProps) {
    return children;
}
