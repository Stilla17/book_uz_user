import type { ReactNode } from 'react';

import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'Aksiyalar va chegirmalar | Book.uz',
    description: 'Book.uz aksiyalari, chegirmadagi kitoblar va maxsus takliflar.',
    path: '/promo',
    keywords: ['aksiya', 'chegirma', 'chegirmadagi kitoblar', 'book.uz']
});

export default function PromoLayout({ children }: { children: ReactNode }) {
    return children;
}
