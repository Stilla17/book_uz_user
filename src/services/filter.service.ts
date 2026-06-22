import { api as adminApi } from '@/components/admin/services/api';
import type { Category } from '@/types/category.types';

import { api } from './api';

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
type EntityListResponse =
    | FilterEntity[]
    | {
          authors?: FilterEntity[];
          publishers?: FilterEntity[];
          pagination?: {
              page?: number;
              pages?: number;
              totalPages?: number;
              limit?: number;
              total?: number;
          };
      };

const ENTITY_PAGE_LIMIT = 1000;

const getResponseData = <T>(response: { data?: { data?: T } }, fallback: T): T => {
    return response.data?.data ?? fallback;
};

const getEntityList = (
    data: EntityListResponse,
    key: 'authors' | 'publishers'
) => {
    if (Array.isArray(data)) return data;

    return data[key] ?? [];
};

const getEntityPagesCount = (data: EntityListResponse) => {
    if (Array.isArray(data)) return 1;

    const pages = Number(data.pagination?.pages ?? data.pagination?.totalPages ?? 1);
    return Number.isFinite(pages) && pages > 0 ? pages : 1;
};

const getCategoryList = (data: CategoryListResponse) => {
    if (Array.isArray(data)) return data;

    return data.categories ?? data.items ?? data.docs ?? [];
};

const getAllEntityPages = async (path: string, key: 'authors' | 'publishers') => {
    const requestParams = { page: 1, limit: ENTITY_PAGE_LIMIT, minimal: true };
    const response = await api.get(path, { params: requestParams });
    const data = getResponseData<EntityListResponse>(response, {});
    const firstPageItems = getEntityList(data, key);
    const pages = getEntityPagesCount(data);

    if (pages <= 1) {
        return firstPageItems;
    }

    const remainingPages = await Promise.all(
        Array.from({ length: pages - 1 }, (_, index) =>
            api.get(path, {
                params: {
                    ...requestParams,
                    page: index + 2
                }
            })
        )
    );

    return [
        ...firstPageItems,
        ...remainingPages.flatMap((pageResponse) =>
            getEntityList(getResponseData<EntityListResponse>(pageResponse, {}), key)
        )
    ];
};

const searchEntity = async (path: string, key: 'authors' | 'publishers', search: string) => {
    const response = await api.get(path, {
        params: {
            search,
            page: 1,
            limit: 50,
            minimal: true
        }
    });

    return getEntityList(getResponseData<EntityListResponse>(response, {}), key);
};

export const filterService = {
    async getAllFilters(params: { limit?: number; adminCategories?: boolean } = {}): Promise<BookFilterResponse> {
        const limit = params.limit ?? 200;
        const categoriesRequest = params.adminCategories
            ? adminApi
                  .get('/admin/categories', {
                      params: { page: 1, limit }
                  })
                  .catch((error) => {
                      console.error(
                          'Admin categories failed, public fallback used:',
                          error?.response?.status || error?.message
                      );
                      return api.get('/categories', { params: { all: true } });
                  })
            : api.get('/categories', { params: { all: true } });

        const [categoriesRes, authors, publishers] = await Promise.all([
            categoriesRequest,
            getAllEntityPages('/authors', 'authors'),
            getAllEntityPages('/publishers', 'publishers')
        ]);

        return {
            categories: getCategoryList(getResponseData<CategoryListResponse>(categoriesRes, [])),
            authors,
            publishers
        };
    },

    searchAuthors(search: string) {
        return searchEntity('/authors', 'authors', search);
    },

    searchPublishers(search: string) {
        return searchEntity('/publishers', 'publishers', search);
    }
};
