import { OtherPagination } from '@/services/api';

export type NewsLocalizedText = string | {
    uz?: string;
    ru?: string;
    en?: string;
};

export type NewsResponse = {
    news: NewsItems[];
    pagination: OtherPagination;
};

export interface NewsItems {
    _id: string;
    title: NewsLocalizedText;
    image: string;
    description: NewsLocalizedText;
    excerpt: NewsLocalizedText;
    slug: string;
    views: number;
    viewsCount?: number;
    viewCount?: number;
    createdAt?: string;
}
