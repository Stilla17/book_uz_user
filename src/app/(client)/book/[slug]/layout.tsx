import type { ReactNode } from 'react';

import { createBookMetadata, fetchSeoData } from '@/lib/seo';
import type { Book } from '@/types/book';

type BookLayoutProps = {
    children: ReactNode;
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BookLayoutProps) {
    const { slug } = await params;
    const book = await fetchSeoData<Book>(`/products/${slug}`);

    return createBookMetadata(book, slug);
}

export default function BookLayout({ children }: BookLayoutProps) {
    return children;
}
