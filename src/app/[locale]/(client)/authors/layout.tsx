import type { ReactNode } from 'react';

import { createPageMetadata } from '@/lib/seo';

const metadataOptions = {
    title: 'Mualliflar | Book.uz',
    description: "Book.uz dagi mualliflar ro'yxati va ularning kitoblari. Sevimli yozuvchilaringiz asarlarini toping.",
    path: '/authors',
    keywords: ['mualliflar', 'yozuvchilar', 'kitob mualliflari', 'book.uz']
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return createPageMetadata({ ...metadataOptions, locale });
}

export default function AuthorsLayout({ children }: { children: ReactNode }) {
    return children;
}
