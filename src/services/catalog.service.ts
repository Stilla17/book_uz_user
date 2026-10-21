import type { CatalogCategoryFilter, CatalogListResponse } from '@/types/catalog';

import { api } from './api';

export const CatalogService = {
    getCatalogs: async (category: CatalogCategoryFilter, signal?: AbortSignal) => {
        const response = await api.get<{ data: CatalogListResponse }>('/catalogs', {
            params: { category, page: 1, limit: 1000 },
            signal
        });

        return response.data.data;
    }
};
