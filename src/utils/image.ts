const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.book.uz';

export type ImageValue =
    | string
    | string[]
    | {
          url?: string;
          secure_url?: string;
          secureUrl?: string;
          src?: string;
          path?: string;
          image?: string;
          images?: ImageValue;
      }
    | null
    | undefined;

const getImageValue = (image?: ImageValue): string => {
    if (!image) return '';
    if (Array.isArray(image)) return image.find((item) => typeof item === 'string' && item.trim()) || '';
    if (typeof image === 'object')
        return (
            image.url ||
            image.secure_url ||
            image.secureUrl ||
            image.src ||
            image.path ||
            image.image ||
            getImageValue(image.images)
        );

    return image;
};

const getLatestImageValue = (image?: ImageValue): string => {
    if (!image) return '';
    if (Array.isArray(image)) {
        return [...image].reverse().find((item) => typeof item === 'string' && item.trim()) || '';
    }
    if (typeof image === 'object') {
        return (
            image.url ||
            image.secure_url ||
            image.secureUrl ||
            image.src ||
            image.path ||
            image.image ||
            getLatestImageValue(image.images)
        );
    }

    return image;
};

const getApiBaseUrl = () => (API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL);

const buildImageUrl = (value: string) => {
    if (!value) return;

    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    if (value.startsWith('//')) return `https:${value}`;
    if (value.startsWith('/images/')) return value;
    if (value.startsWith('/user-api')) return `${getApiBaseUrl()}${value}`;
    if (value.startsWith('/')) {
        const imagePath = value.slice(1);
        return `${getApiBaseUrl()}/${imagePath}`;
    }
    if (value.startsWith('user-api')) return `${getApiBaseUrl()}/${value}`;

    return `${getApiBaseUrl()}/${value.replace(/^\//, '')}`;
};

export const getImageUrl = (image?: ImageValue) => {
    return buildImageUrl(getImageValue(image).trim());
};

export const getLatestImageUrl = (image?: ImageValue) => {
    return buildImageUrl(getLatestImageValue(image).trim());
};

export const getBookImageUrl = (book?: { image?: ImageValue; images?: ImageValue } | null) => {
    return getLatestImageUrl(book?.image) || getLatestImageUrl(book?.images);
};
