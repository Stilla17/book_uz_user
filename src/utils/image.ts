const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.book.uz/user-api/';
export const FALLBACK_BOOK_IMAGE = 'https://backend.book.uz/user-api/img/img-file-6080c55bb05c0ebeac3da4d480f14a6c.jpg';

type ImageValue =
    | string
    | string[]
    | { url?: string; src?: string; path?: string; image?: string; images?: ImageValue }
    | null
    | undefined;

const getImageValue = (image?: ImageValue): string => {
    if (!image) return '';
    if (Array.isArray(image)) return image.find((item) => typeof item === 'string' && item.trim()) || '';
    if (typeof image === 'object')
        return image.url || image.src || image.path || image.image || getImageValue(image.images);

    return image;
};

export const getImageUrl = (image?: ImageValue, fallback = FALLBACK_BOOK_IMAGE) => {
    const value = getImageValue(image).trim();
    if (!value) return fallback;

    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    if (value.startsWith('//')) return `https:${value}`;
    if (value.startsWith('/images/')) return value;
    if (value.startsWith('/user-api/')) return `https://backend.book.uz${value}`;
    if (value.startsWith('/')) return `${API_BASE_URL.replace(/\/$/, '')}/${value.replace(/^\//, '')}`;
    if (value.startsWith('user-api/')) return `https://backend.book.uz/${value}`;

    return `${API_BASE_URL.replace(/\/$/, '')}/${value.replace(/^\//, '')}`;
};
