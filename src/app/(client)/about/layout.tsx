import type { ReactNode } from 'react';

import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'Book.uz haqida',
    description: "Book.uz - O'zbekistondagi onlayn kitob do'koni. Biz haqimizda, qadriyatlarimiz va xizmatlarimiz.",
    path: '/about',
    keywords: ['book.uz haqida', "onlayn kitob do'koni", 'kitob do‘koni']
});

export default function AboutLayout({ children }: { children: ReactNode }) {
    return children;
}
