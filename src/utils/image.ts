const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.book.uz/user-api/';
const FALLBACK_BOOK_IMAGE = 'https://backend.book.uz/user-api/img/img-file-6080c55bb05c0ebeac3da4d480f14a6c.jpg';

export const getImageUrl = (image?: string | null, fallback = FALLBACK_BOOK_IMAGE) => {
    const value = image?.trim();
    if (!value) return fallback;

    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    if (value.startsWith('//')) return `https:${value}`;
    if (value.startsWith('/')) return value;

    return `${API_BASE_URL.replace(/\/$/, '')}/${value.replace(/^\//, '')}`;
};
