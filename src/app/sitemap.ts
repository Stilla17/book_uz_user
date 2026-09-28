import type { MetadataRoute } from 'next';

import { siteUrl } from '@/lib/seo';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type SitemapItem = MetadataRoute.Sitemap[number];

type ApiListResponse<T> = {
    data?:
        | {
              products?: T[];
              news?: T[];
              publishers?: T[];
              items?: T[];
              docs?: T[];
              data?: T[];
          }
        | T[];
};

type SlugItem = {
    slug?: string;
    updatedAt?: string;
    createdAt?: string;
};

const staticRoutes: SitemapItem[] = [
    {
        url: siteUrl,
        changeFrequency: 'daily',
        priority: 1
    },
    {
        url: `${siteUrl}/catalog`,
        changeFrequency: 'daily',
        priority: 0.9
    },
    {
        url: `${siteUrl}/news`,
        changeFrequency: 'weekly',
        priority: 0.7
    },
    {
        url: `${siteUrl}/authors`,
        changeFrequency: 'weekly',
        priority: 0.7
    },
    {
        url: `${siteUrl}/publishers`,
        changeFrequency: 'weekly',
        priority: 0.7
    },
    {
        url: `${siteUrl}/about`,
        changeFrequency: 'monthly',
        priority: 0.6
    },
    {
        url: `${siteUrl}/service`,
        changeFrequency: 'monthly',
        priority: 0.5
    },
    {
        url: `${siteUrl}/promo`,
        changeFrequency: 'weekly',
        priority: 0.6
    }
];

const getItems = <T>(data: ApiListResponse<T>, key: 'products' | 'news' | 'publishers') => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.[key])) return data.data[key];
    if (Array.isArray(data?.data?.items)) return data.data.items;
    if (Array.isArray(data?.data?.docs)) return data.data.docs;
    if (Array.isArray(data?.data?.data)) return data.data.data;

    return [];
};

const fetchItems = async <T extends SlugItem>(path: string, key: 'products' | 'news' | 'publishers') => {
    if (!apiUrl) return [];

    try {
        const response = await fetch(`${apiUrl}${path}`, {
            next: { revalidate: 60 * 60 }
        });

        if (!response.ok) return [];

        return getItems<T>((await response.json()) as ApiListResponse<T>, key);
    } catch {
        return [];
    }
};

const getLastModified = (item: SlugItem) => {
    const value = item.updatedAt || item.createdAt;
    if (!value) return undefined;

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
};

const encodeSlug = (slug: string) => encodeURIComponent(slug);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [books, news, publishers] = await Promise.all([
        fetchItems('/products?limit=1000', 'products'),
        fetchItems('/news?page=1&limit=1000', 'news'),
        fetchItems('/publishers?page=1&limit=1000', 'publishers')
    ]);

    const bookRoutes: SitemapItem[] = books
        .filter((book) => Boolean(book.slug))
        .map((book) => ({
            url: `${siteUrl}/book/${encodeSlug(book.slug!)}`,
            lastModified: getLastModified(book),
            changeFrequency: 'weekly',
            priority: 0.8
        }));

    const newsRoutes: SitemapItem[] = news
        .filter((item) => Boolean(item.slug))
        .map((item) => ({
            url: `${siteUrl}/news/${encodeSlug(item.slug!)}`,
            lastModified: getLastModified(item),
            changeFrequency: 'monthly',
            priority: 0.6
        }));

    const publisherRoutes: SitemapItem[] = publishers
        .filter((publisher) => Boolean(publisher.slug))
        .map((publisher) => ({
            url: `${siteUrl}/publishers/${encodeSlug(publisher.slug!)}`,
            lastModified: getLastModified(publisher),
            changeFrequency: 'weekly',
            priority: 0.7
        }));

    return [...staticRoutes, ...bookRoutes, ...newsRoutes, ...publisherRoutes];
}
