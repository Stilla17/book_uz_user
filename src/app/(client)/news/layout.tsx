import type { ReactNode } from 'react';

import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'Yangiliklar | Book.uz',
    description: "Book.uz yangiliklari, kitoblar olami, mutolaa va yangi nashrlar haqida maqolalar.",
    path: '/news',
    keywords: ['yangiliklar', 'kitob yangiliklari', 'mutolaa', 'book.uz']
});

export default function NewsLayout({ children }: { children: ReactNode }) {
    return children;
}
