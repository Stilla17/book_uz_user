import type { CatalogCategoryFilter, CatalogListResponse } from '@/types/catalog';
import { useQuery } from '@tanstack/react-query';

import { CatalogService } from '@/services/catalog.service';

export const useCatalogManageQuery = (category: CatalogCategoryFilter) =>
    useQuery<CatalogListResponse>({
        queryKey: ['catalog-manage', category],
        queryFn: ({ signal }) => CatalogService.getCatalogs(category, signal)
    });
