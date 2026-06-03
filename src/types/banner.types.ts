import { MultiLangField } from '.';

export interface AuthorBannerData {
    name?: string;
    nameUz?: string;
    nameRu?: string;
    nameEn?: string;
    shortBio?: MultiLangField;
    birthYear?: string;
    deathYear?: string;
    country?: string;
    booksCount?: number;
    authorId?: string;
}

export interface QuoteBannerData {
    text?: MultiLangField;
    authorId?: string;
    authorName?: string;
    authorImage?: string;
}

export interface Banner {
    _id: string;
    name?: string;
    title?: MultiLangField;
    subtitle?: MultiLangField;
    description?: MultiLangField;
    type: 'hero' | 'author' | 'quote' | 'news';
    imageUrl: string;
    link?: string;
    buttonText?: MultiLangField;
    buttonLink?: string;
    backgroundColor?: string;
    textColor?: string;
    badge?: MultiLangField;
    order: number;
    isActive: boolean;
    author?: AuthorBannerData;
    selectedBooks?: string[];
    quote?: QuoteBannerData;
    views: number;
    clicks: number;
    createdAt: string;
    updatedAt: string;
}

export interface BannerFormData {
    name?: string;
    title?: MultiLangField;
    subtitle?: MultiLangField;
    description?: MultiLangField;
    type: 'hero' | 'author' | 'quote' | 'news';
    image?: File | string;
    buttonText?: MultiLangField;
    buttonLink?: string;
    link?: string;
    backgroundColor?: string;
    textColor?: string;
    badge?: MultiLangField;
    order: number;
    isActive: boolean;
    author?: AuthorBannerData;
    selectedBooks?: string[];
    quote?: QuoteBannerData;
}
