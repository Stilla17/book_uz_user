import { PublishersResponse } from '@/services/api';
import type { PublisherItems } from '@/types';
import { useQuery } from '@tanstack/react-query';

import { AdminService } from '../../services/publisher.service';

export const publisherKeys = {
    all: ['publishers'] as const,
    list: (page: number, limit: number, keyword: string) =>
        [...publisherKeys.all, 'list', page, limit, keyword] as const,
    detail: (slug: string) => [...publisherKeys.all, 'detail', slug] as const
};

export const usePublisherQuery = (page: number, limit: number, keyword = '') => {
    const search = keyword.trim();

    return useQuery<PublishersResponse>({
        queryKey: publisherKeys.list(page, limit, search),
        queryFn: () => AdminService.getAdminPublishers({ page, limit, search }),
        placeholderData: (previousData) => previousData
    });
};

export const usePublisherDetailQuery = (id: string | null) => {
    return useQuery<PublisherItems>({
        queryKey: ['publishers', 'detail', id],
        queryFn: () => AdminService.getAdminPublisher(id!),
        enabled: !!id
    });
};
