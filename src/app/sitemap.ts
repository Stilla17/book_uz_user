import type { MetadataRoute } from 'next';

import { getLocalizedPath, SUPPORTED_LOCALES } from '@/lib/i18n-routing';
import { siteUrl } from '@/lib/seo';
import { getPublicBookSlug } from '@/utils/slug';

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

const staticRoutes: SitemapItem[] = SUPPORTED_LOCALES.flatMap((locale) => [
    {
        url: `${siteUrl}${getLocalizedPath(locale, '/')}`,
        changeFrequency: 'daily',
        priority: 1
    },
    {
        url: `${siteUrl}${getLocalizedPath(locale, '/catalog')}`,
        changeFrequency: 'daily',
        priority: 0.9
    },
    {
        url: `${siteUrl}${getLocalizedPath(locale, '/news')}`,
        changeFrequency: 'weekly',
        priority: 0.7
    },
    {
        url: `${siteUrl}${getLocalizedPath(locale, '/authors')}`,
        changeFrequency: 'weekly',
        priority: 0.7
    },
    {
        url: `${siteUrl}${getLocalizedPath(locale, '/publishers')}`,
        changeFrequency: 'weekly',
        priority: 0.7
    },
    {
        url: `${siteUrl}${getLocalizedPath(locale, '/about')}`,
        changeFrequency: 'monthly',
        priority: 0.6
    },
    {
        url: `${siteUrl}${getLocalizedPath(locale, '/service')}`,
        changeFrequency: 'monthly',
        priority: 0.5
    }
]);

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
        .flatMap((book) =>
            SUPPORTED_LOCALES.map((locale) => ({
                url: `${siteUrl}${getLocalizedPath(locale, `/book/${encodeSlug(getPublicBookSlug(book.slug!))}`)}`,
                lastModified: getLastModified(book),
                changeFrequency: 'weekly' as const,
                priority: 0.8
            }))
        );

    const newsRoutes: SitemapItem[] = news
        .filter((item) => Boolean(item.slug))
        .flatMap((item) =>
            SUPPORTED_LOCALES.map((locale) => ({
                url: `${siteUrl}${getLocalizedPath(locale, `/news/${encodeSlug(item.slug!)}`)}`,
                lastModified: getLastModified(item),
                changeFrequency: 'monthly' as const,
                priority: 0.6
            }))
        );

    const publisherRoutes: SitemapItem[] = publishers
        .filter((publisher) => Boolean(publisher.slug))
        .flatMap((publisher) =>
            SUPPORTED_LOCALES.map((locale) => ({
                url: `${siteUrl}${getLocalizedPath(locale, `/publishers/${encodeSlug(publisher.slug!)}`)}`,
                lastModified: getLastModified(publisher),
                changeFrequency: 'weekly' as const,
                priority: 0.7
            }))
        );

    return [...staticRoutes, ...bookRoutes, ...newsRoutes, ...publisherRoutes];
}
