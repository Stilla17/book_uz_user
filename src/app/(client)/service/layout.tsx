import type { ReactNode } from 'react';

import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'Xizmatlar | Book.uz',
    description: "Book.uz xizmatlari: yetkazib berish, to'lov, kafolat va mijozlarni qo'llab-quvvatlash.",
    path: '/service',
    keywords: ['book.uz xizmatlari', 'yetkazib berish', "kitob to'lovi", 'book.uz']
});

export default function ServiceLayout({ children }: { children: ReactNode }) {
    return children;
}
