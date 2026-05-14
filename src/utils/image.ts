const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

export const getImageUrl = (image?: ImageValue) => {
    const value = getImageValue(image).trim();
    if (!value) return;

    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    if (value.startsWith('//')) return `https:${value}`;
    if (value.startsWith('/images/')) return value;
    if (value.startsWith('/user-api/')) return `https://backend.book.uz${value}`;
    if (value.startsWith('/')) {
        const baseUrl = API_BASE_URL?.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
        const imagePath = value.slice(1);
        return `${baseUrl}/${imagePath}`;
    }
    if (value.startsWith('user-api/')) return `https://backend.book.uz/${value}`;

    return `${API_BASE_URL}/${value.replace(/^\//, '')}`;
};
