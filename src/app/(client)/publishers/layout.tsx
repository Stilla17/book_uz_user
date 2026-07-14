import type { ReactNode } from 'react';

import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
    title: 'Nashriyotlar | Book.uz',
    description: "Book.uz dagi nashriyotlar va ularning kitoblari. O'zbekistondagi mashhur nashriyotlar kitoblarini xarid qiling.",
    path: '/publishers',
    keywords: ['nashriyotlar', 'kitob nashriyotlari', "o'zbek nashriyotlari", 'book.uz']
});

export default function PublishersLayout({ children }: { children: ReactNode }) {
    return children;
}
