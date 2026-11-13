import type { ReactNode } from 'react';

import { createPageMetadata } from '@/lib/seo';

const metadataOptions = {
    title: "Kitoblar katalogi | Book.uz - Onlayn kitob do'koni",
    description:
        "Book.uz katalogida o'zbek, rus va ingliz tillaridagi kitoblarni toping. Badiiy, ilmiy, bolalar va biznes kitoblari.",
    path: '/catalog',
    keywords: ['kitoblar katalogi', 'kitoblar', "o'zbek kitoblari", 'badiiy kitoblar', 'book.uz']
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return createPageMetadata({ ...metadataOptions, locale });
}

export default function CatalogLayout({ children }: { children: ReactNode }) {
    return children;
}
