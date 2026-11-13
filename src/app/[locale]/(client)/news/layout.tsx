import type { ReactNode } from 'react';

import { createPageMetadata } from '@/lib/seo';

const metadataOptions = {
    title: 'Yangiliklar | Book.uz',
    description: "Book.uz yangiliklari, kitoblar olami, mutolaa va yangi nashrlar haqida maqolalar.",
    path: '/news',
    keywords: ['yangiliklar', 'kitob yangiliklari', 'mutolaa', 'book.uz']
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return createPageMetadata({ ...metadataOptions, locale });
}

export default function NewsLayout({ children }: { children: ReactNode }) {
    return children;
}
