import { CatalogService } from '@/services/catalog.service';
import type { CatalogCategoryFilter, CatalogListResponse } from '@/types/catalog';
import { useQuery } from '@tanstack/react-query';

export const useCatalogManageQuery = (category: CatalogCategoryFilter, page: number, limit: number) =>
    useQuery<CatalogListResponse>({
        queryKey: ['catalog-manage', category, page, limit],
        queryFn: ({ signal }) => CatalogService.getCatalogs(category, page, limit, signal),
        placeholderData: (previousData) => previousData
    });
