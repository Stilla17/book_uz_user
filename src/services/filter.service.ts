import { api } from './api';
import type { Category } from '@/types/category.types';

type FilterEntity = {
    _id: string;
    name: string;
    slug?: string;
    booksCount?: number;
};

export type BookFilterResponse = {
    categories: Category[];
    authors: FilterEntity[];
    publishers: FilterEntity[];
};

const getResponseData = <T>(response: { data?: { data?: T } }, fallback: T): T => {
    return response.data?.data ?? fallback;
};

const getEntityList = (data: FilterEntity[] | { authors?: FilterEntity[]; publishers?: FilterEntity[] }, key: 'authors' | 'publishers') => {
    if (Array.isArray(data)) return data;

    return data[key] ?? [];
};

export const filterService = {
    async getAllFilters(): Promise<BookFilterResponse> {
        const [categoriesRes, authorRes, publisherRes] = await Promise.all([
            api.get('/categories', { params: { all: true } }),
            api.get('/authors', { params: { limit: 1000 } }),
            api.get('/publishers')
        ]);

        const authorData = getResponseData<FilterEntity[] | { authors?: FilterEntity[] }>(authorRes, {});
        const publisherData = getResponseData<FilterEntity[] | { publishers?: FilterEntity[] }>(publisherRes, {});

        return {
            categories: getResponseData<Category[]>(categoriesRes, []),
            authors: getEntityList(authorData, 'authors'),
            publishers: getEntityList(publisherData, 'publishers')
        };
    }
};
