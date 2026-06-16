import { api } from './api';
import { api as adminApi } from '@/components/admin/services/api';
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

type CategoryListResponse = Category[] | { categories?: Category[]; items?: Category[]; docs?: Category[] };

const getResponseData = <T>(response: { data?: { data?: T } }, fallback: T): T => {
    return response.data?.data ?? fallback;
};

const getEntityList = (data: FilterEntity[] | { authors?: FilterEntity[]; publishers?: FilterEntity[] }, key: 'authors' | 'publishers') => {
    if (Array.isArray(data)) return data;

    return data[key] ?? [];
};

const getCategoryList = (data: CategoryListResponse) => {
    if (Array.isArray(data)) return data;

    return data.categories ?? data.items ?? data.docs ?? [];
};

const getTotalPages = (data: unknown) => {
    if (!data || Array.isArray(data) || typeof data !== 'object') return 1;

    const pageData = data as { pagination?: { pages?: number; totalPages?: number } };
    const totalPages = Number(pageData.pagination?.pages ?? pageData.pagination?.totalPages ?? 1);

    return Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1;
};

const getAllEntityPages = async (path: string, key: 'authors' | 'publishers', limit: number) => {
    const firstResponse = await api.get(path, { params: { page: 1, limit } });
    const firstData = getResponseData<FilterEntity[] | { authors?: FilterEntity[]; publishers?: FilterEntity[] }>(
        firstResponse,
        {}
    );
    const firstItems = getEntityList(firstData, key);
    const totalPages = getTotalPages(firstData);

    if (totalPages <= 1) return firstItems;

    const otherResponses = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) => api.get(path, { params: { page: index + 2, limit } }))
    );

    return otherResponses.reduce<FilterEntity[]>((items, response) => {
        const data = getResponseData<FilterEntity[] | { authors?: FilterEntity[]; publishers?: FilterEntity[] }>(
            response,
            {}
        );

        return [...items, ...getEntityList(data, key)];
    }, firstItems);
};

export const filterService = {
    async getAllFilters(params: { limit?: number; adminCategories?: boolean } = {}): Promise<BookFilterResponse> {
        const limit = params.limit ?? 200;
        const categoriesRequest =
            params.adminCategories
                ? adminApi
                      .get('/admin/categories', {
                          params: { page: 1, limit }
                      })
                      .catch((error) => {
                          console.error('Admin categories failed, public fallback used:', error?.response?.status || error?.message);
                          return api.get('/categories', { params: { all: true } });
                      })
                : api.get('/categories', { params: { all: true } });

        const [categoriesRes, authors, publishers] = await Promise.all([
            categoriesRequest,
            getAllEntityPages('/authors', 'authors', limit),
            getAllEntityPages('/publishers', 'publishers', limit)
        ]);

        return {
            categories: getCategoryList(getResponseData<CategoryListResponse>(categoriesRes, [])),
            authors,
            publishers
        };
    }
};
