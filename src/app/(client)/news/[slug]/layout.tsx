import type { ReactNode } from 'react';

import { createNewsMetadata, fetchSeoData } from '@/lib/seo';
import type { NewsItems } from '@/types/news';

type NewsDetailLayoutProps = {
    children: ReactNode;
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: NewsDetailLayoutProps) {
    const { slug } = await params;
    const news = await fetchSeoData<NewsItems>(`/news/${slug}`);

    return createNewsMetadata(news, slug);
}

export default function NewsDetailLayout({ children }: NewsDetailLayoutProps) {
    return children;
}
