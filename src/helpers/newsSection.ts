import dayjs from 'dayjs';

export type LocalizedText = string | { uz?: string; ru?: string; en?: string } | null | undefined;

export type NewsItem = {
    _id: string;
    title?: LocalizedText;
    titleRu?: string;
    titleEn?: string;
    slug?: string;
    excerpt?: LocalizedText;
    description?: LocalizedText;
    image?: string;
    imageUrl?: string;
    views?: number;
    viewsCount?: number;
    viewCount?: number;
    createdAt?: string;
    publishedAt?: string;
};
export const getText = (value: LocalizedText, fallback = '') => {
    if (!value) return fallback;
    if (typeof value === 'string') return value || fallback;

    return value.uz || value.ru || value.en || fallback;
};

export const normalizeNewsResponse = (data: any): NewsItem[] => {
    const payload = data?.data ?? data;
    const items = Array.isArray(payload?.news)
        ? payload.news
        : Array.isArray(payload?.items)
          ? payload.items
          : Array.isArray(payload)
            ? payload
            : [];

    return items;
};

export const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return dayjs(dateString).format('D MMMM YYYY');
};
