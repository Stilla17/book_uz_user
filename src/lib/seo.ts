import type { Metadata } from 'next';

import type { Book } from '@/types/book';
import type { NewsItems } from '@/types/news';
import { type ImageValue, getBookImageUrl, getImageUrl } from '@/utils/image';

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://book.uz';

export const siteUrl = configuredSiteUrl.replace(/\/$/, '');
export const siteName = 'Book.uz';
export const defaultOgImage = '/opengraph-image';
export const defaultTitle = "Book.uz - O'zbekistondagi eng katta onlayn kitob do'koni";
export const defaultDescription =
    "O'zbekistondagi eng katta onlayn kitob do'koni. Keng tanlov, arzon narxlar, tez yetkazib berish.";
export const defaultKeywords = [
    'kitoblar',
    "o'zbekiston",
    "onlayn kitob do'koni",
    'book.uz',
    'mutolaa',
    'kitob sotib olish',
    "kitob do'koni",
    "o'zbek kitoblari"
];

type LocalizedText = string | { uz?: string; ru?: string; en?: string } | null | undefined;

type ApiResponse<T> = {
    data?: T;
};

export const getLocalizedText = (value: LocalizedText, fallback = '') => {
    if (!value) return fallback;
    if (typeof value === 'string') return value;

    return value.uz || value.ru || value.en || fallback;
};

export const absoluteUrl = (path = '/') => {
    if (path.startsWith('http://') || path.startsWith('https://')) return path;

    return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

export const cleanSeoText = (value: string, maxLength = 160) => {
    const text = value
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, ' ')
        .trim();

    if (text.length <= maxLength) return text;

    const shortened = text.slice(0, maxLength - 1);
    const lastSpace = shortened.lastIndexOf(' ');

    return `${lastSpace > 80 ? shortened.slice(0, lastSpace) : shortened}…`;
};

export const absoluteImageUrl = (image?: ImageValue) => {
    const value = getImageUrl(image);
    if (!value) return absoluteUrl(defaultOgImage);
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    if (value.startsWith('//')) return `https:${value}`;
    if (value.startsWith('/images/')) return absoluteUrl(value);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.book.uz';
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    return `${normalizedBase}/${value.replace(/^\//, '')}`;
};

export const createPageMetadata = ({
    title,
    description = defaultDescription,
    path = '/',
    image = defaultOgImage,
    type = 'website',
    keywords = defaultKeywords,
    noIndex = false
}: {
    title: string;
    description?: string;
    path?: string;
    image?: string;
    type?: 'website' | 'article' | 'book';
    keywords?: string[];
    noIndex?: boolean;
}): Metadata => {
    const url = absoluteUrl(path);
    const imageUrl = absoluteImageUrl(image);
    const safeTitle = cleanSeoText(title, 65);
    const safeDescription = cleanSeoText(description);

    return {
        title: safeTitle,
        description: safeDescription,
        keywords,
        alternates: {
            canonical: url
        },
        robots: noIndex
            ? {
                  index: false,
                  follow: false
              }
            : {
                  index: true,
                  follow: true,
                  googleBot: {
                      index: true,
                      follow: true,
                      'max-snippet': -1,
                      'max-image-preview': 'large',
                      'max-video-preview': -1
                  }
              },
        openGraph: {
            title: safeTitle,
            description: safeDescription,
            url,
            siteName,
            type: type === 'article' ? 'article' : 'website',
            locale: 'uz_UZ',
            alternateLocale: ['ru_UZ', 'en_US'],
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: safeTitle
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: safeTitle,
            description: safeDescription,
            images: [imageUrl]
        }
    };
};

export const fetchSeoData = async <T>(path: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return null;

    try {
        const response = await fetch(`${apiUrl}${path}`, {
            next: { revalidate: 60 * 30 }
        });

        if (!response.ok) return null;

        const payload = (await response.json()) as ApiResponse<T>;
        return payload.data ?? null;
    } catch {
        return null;
    }
};

export const createBookMetadata = (book: Book | null, slug: string): Metadata => {
    if (!book) {
        return createPageMetadata({
            title: 'Kitob topilmadi | Book.uz',
            description: 'Book.uz katalogida bu kitob topilmadi.',
            path: `/book/${slug}`,
            noIndex: true
        });
    }

    const title = getLocalizedText(book.title, 'Kitob');
    const description =
        cleanSeoText(getLocalizedText(book.description)) ||
        `${title} kitobini Book.uz onlayn kitob do'konida xarid qiling. Tez yetkazib berish va qulay narxlar.`;

    return createPageMetadata({
        title: `${title} | Book.uz`,
        description,
        path: `/book/${book.slug || slug}`,
        image: getBookImageUrl(book),
        type: 'book',
        keywords: [...defaultKeywords, title, ...(book.tags || book.tegs || [])]
    });
};

export const createNewsMetadata = (news: NewsItems | null, slug: string): Metadata => {
    if (!news) {
        return createPageMetadata({
            title: 'Yangilik topilmadi | Book.uz',
            description: 'Book.uz yangiliklari orasida bu maqola topilmadi.',
            path: `/news/${slug}`,
            noIndex: true
        });
    }

    const title = getLocalizedText(news.title, 'Yangilik');
    const description =
        cleanSeoText(getLocalizedText(news.excerpt) || getLocalizedText(news.description)) || defaultDescription;

    return createPageMetadata({
        title: `${title} | Book.uz`,
        description,
        path: `/news/${news.slug || slug}`,
        image: absoluteImageUrl(news.image),
        type: 'article',
        keywords: [...defaultKeywords, title, 'yangiliklar']
    });
};
