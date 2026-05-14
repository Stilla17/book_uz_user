import { getSearchQueryVariants } from '@/lib/search-transliteration';
import { ClientService, PublishersResponse } from '@/services/api';
import type { PublisherItems } from '@/types';
import { useQuery } from '@tanstack/react-query';

import { AdminService } from '../../services/publisher.service';

export const publisherKeys = {
    all: ['publishers'] as const,
    list: (page: number, limit: number, keyword: string) =>
        [...publisherKeys.all, 'list', page, limit, keyword] as const,
    detail: (slug: string) => [...publisherKeys.all, 'detail', slug] as const
};

const getPublisherKey = (publisher: PublishersResponse['publishers'][number]) =>
    publisher._id || publisher.slug || publisher.name;

const mergePublisherLists = (lists: PublishersResponse[], limit: number): PublishersResponse => {
    const seenKeys = new Set<string>();
    const publishers = lists
        .flatMap((list) => list.publishers)
        .filter((publisher) => {
            const key = getPublisherKey(publisher);

            if (seenKeys.has(key)) return false;

            seenKeys.add(key);
            return true;
        })
        .slice(0, limit);

    const firstPagination = lists[0]?.pagination;

    return {
        publishers,
        pagination: {
            page: firstPagination?.page ?? 1,
            limit,
            total: publishers.length,
            pages: Math.max(1, Math.ceil(publishers.length / Math.max(limit, 1)))
        }
    };
};

export const usePublisherQuery = (page: number, limit: number, keyword = '') => {
    const search = keyword.trim();

    return useQuery<PublishersResponse>({
        queryKey: publisherKeys.list(page, limit, search),
        queryFn: async () => {
            const searchVariants = getSearchQueryVariants(search);

            if (searchVariants.length <= 1) {
                return AdminService.getAdminPublishers({ page, limit, search });
            }

            const lists = await Promise.all(
                searchVariants.map((variant) => ClientService.getPublishers({ page, limit, search: variant }))
            );

            return mergePublisherLists(lists, limit);
        },
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
