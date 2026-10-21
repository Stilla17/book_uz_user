import type {
    CatalogCategoryFilter,
    CatalogItem,
    CatalogListResponse,
    CatalogStatusFilter
} from '@/types/catalog';
import { useQuery } from '@tanstack/react-query';

import { CatalogService } from '../../services/catalog.service';

export const catalogQueryKey = ['admin-catalogs'] as const;

export const useCatalogListQuery = (
    page: number,
    limit: number,
    category: CatalogCategoryFilter,
    status: CatalogStatusFilter
) =>
    useQuery<CatalogListResponse>({
        queryKey: [...catalogQueryKey, 'list', page, limit, category, status],
        queryFn: ({ signal }) =>
            CatalogService.getCatalogs(
                {
                    page,
                    limit,
                    category,
                    ...(status === 'hammasi' ? {} : { isActive: status === 'active' })
                },
                signal
            )
    });

export const useCatalogDetailQuery = (id: string | null) =>
    useQuery<CatalogItem>({
        queryKey: [...catalogQueryKey, 'detail', id],
        queryFn: () => CatalogService.getCatalogById(id!),
        enabled: Boolean(id)
    });
