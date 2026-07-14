import type { ReactNode } from 'react';

import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'Mualliflar | Book.uz',
    description: "Book.uz dagi mualliflar ro'yxati va ularning kitoblari. Sevimli yozuvchilaringiz asarlarini toping.",
    path: '/authors',
    keywords: ['mualliflar', 'yozuvchilar', 'kitob mualliflari', 'book.uz']
});

export default function AuthorsLayout({ children }: { children: ReactNode }) {
    return children;
}
