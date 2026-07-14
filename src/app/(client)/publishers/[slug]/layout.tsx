import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { createPageMetadata, fetchSeoData } from '@/lib/seo';

type PublisherLayoutProps = {
    children: ReactNode;
    params: Promise<{ slug: string }>;
};

type PublisherResponse = {
    publisher?: {
        name?: string;
        slug?: string;
    };
};

export async function generateMetadata({ params }: PublisherLayoutProps): Promise<Metadata> {
    const { slug } = await params;
    const data = await fetchSeoData<PublisherResponse>(`/publishers/${slug}/products?page=1&limit=1`);
    const publisherName = data?.publisher?.name || 'Nashriyot';

    return createPageMetadata({
        title: `${publisherName} kitoblari | Book.uz`,
        description: `${publisherName} nashriyoti kitoblarini Book.uz onlayn kitob do'konida xarid qiling.`,
        path: `/publishers/${data?.publisher?.slug || slug}`,
        keywords: [publisherName, 'nashriyot', 'kitoblar', 'book.uz']
    });
}

export default function PublisherLayout({ children }: PublisherLayoutProps) {
    return children;
}
