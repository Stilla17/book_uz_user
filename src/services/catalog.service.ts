import type { CatalogCategoryFilter, CatalogListResponse } from '@/types/catalog';

import { api } from './api';

export const CatalogService = {
    getCatalogs: async (category: CatalogCategoryFilter, page: number, limit: number, signal?: AbortSignal) => {
        const response = await api.get<{ data: CatalogListResponse }>('/catalogs', {
            params: { category, page, limit },
            signal
        });

        return response.data.data;
    }
};
