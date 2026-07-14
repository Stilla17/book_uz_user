import type { MetadataRoute } from 'next';

const siteUrl = 'https://book.uz';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type SitemapItem = MetadataRoute.Sitemap[number];

type ApiListResponse<T> = {
    data?: {
        products?: T[];
        news?: T[];
        items?: T[];
        docs?: T[];
        data?: T[];
    };
};

type SlugItem = {
    slug?: string;
    updatedAt?: string;
    createdAt?: string;
};

const staticRoutes: SitemapItem[] = [
    {
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1
    },
    {
        url: `${siteUrl}/catalog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9
    },
    {
        url: `${siteUrl}/news`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7
    },
    {
        url: `${siteUrl}/authors`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7
    },
    {
        url: `${siteUrl}/publishers`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7
    },
    {
        url: `${siteUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6
    },
    {
        url: `${siteUrl}/service`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5
    },
    {
        url: `${siteUrl}/promo`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6
    }
];

const getItems = <T>(data: ApiListResponse<T>, key: 'products' | 'news') => {
    if (Array.isArray(data?.data?.[key])) return data.data[key];
    if (Array.isArray(data?.data?.items)) return data.data.items;
    if (Array.isArray(data?.data?.docs)) return data.data.docs;
    if (Array.isArray(data?.data?.data)) return data.data.data;

    return [];
};

const fetchItems = async <T extends SlugItem>(path: string, key: 'products' | 'news') => {
    if (!apiUrl) return [];

    try {
        const response = await fetch(`${apiUrl}${path}`, {
            cache: 'no-store'
        });

        if (!response.ok) return [];

        return getItems<T>((await response.json()) as ApiListResponse<T>, key);
    } catch {
        return [];
    }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [books, news] = await Promise.all([
        fetchItems('/products?limit=1000', 'products'),
        fetchItems('/news?page=1&limit=1000', 'news')
    ]);

    const bookRoutes: SitemapItem[] = books
        .filter((book) => Boolean(book.slug))
        .map((book) => ({
            url: `${siteUrl}/book/${book.slug}`,
            lastModified: book.updatedAt || book.createdAt ? new Date(book.updatedAt || book.createdAt || '') : new Date(),
            changeFrequency: 'weekly',
            priority: 0.8
        }));

    const newsRoutes: SitemapItem[] = news
        .filter((item) => Boolean(item.slug))
        .map((item) => ({
            url: `${siteUrl}/news/${item.slug}`,
            lastModified: item.updatedAt || item.createdAt ? new Date(item.updatedAt || item.createdAt || '') : new Date(),
            changeFrequency: 'monthly',
            priority: 0.6
        }));

    return [...staticRoutes, ...bookRoutes, ...newsRoutes];
}
