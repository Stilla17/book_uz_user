import type { ReactNode } from 'react';

import { createPageMetadata } from '@/lib/seo';

const metadataOptions = {
    title: 'Book.uz haqida',
    description: "Book.uz - O'zbekistondagi onlayn kitob do'koni. Biz haqimizda, qadriyatlarimiz va xizmatlarimiz.",
    path: '/about',
    keywords: ['book.uz haqida', "onlayn kitob do'koni", 'kitob do‘koni']
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return createPageMetadata({ ...metadataOptions, locale });
}

export default function AboutLayout({ children }: { children: ReactNode }) {
    return children;
}
