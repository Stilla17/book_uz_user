import type { ReactNode } from 'react';

import { createPageMetadata } from '@/lib/seo';

const metadataOptions = {
    title: 'Nashriyotlar | Book.uz',
    description: "Book.uz dagi nashriyotlar va ularning kitoblari. O'zbekistondagi mashhur nashriyotlar kitoblarini xarid qiling.",
    path: '/publishers',
    keywords: ['nashriyotlar', 'kitob nashriyotlari', "o'zbek nashriyotlari", 'book.uz']
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return createPageMetadata({ ...metadataOptions, locale });
}

export default function PublishersLayout({ children }: { children: ReactNode }) {
    return children;
}
