'use client';

import { ClientService } from '@/services/api';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const usePublishersQuery = (page: number, limit: number) =>
    useQuery({
        queryKey: ['publishers', 'list', 'books-count-desc', page, limit],
        queryFn: ({ signal }) => ClientService.getPublishers({ page, limit, sort: 'books_count_desc' }, signal),
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false
    });

export const usePublishersCountQuery = () =>
    useQuery({
        queryKey: ['publishers-count'],
        queryFn: () => ClientService.getPublishers({ page: 1, limit: 1 })
    });

export const publisherProductsQueryOptions = (slug: string, page: number, limit: number) =>
    queryOptions({
        queryKey: ['publisher-products', slug, page, limit],
        queryFn: () => ClientService.getPublisherProducts(slug, { page, limit }),
        enabled: Boolean(slug),
        placeholderData: (previousData) => previousData,
        staleTime: 5 * 60 * 1000
    });

export const usePublisherProductsQuery = (slug: string, page: number, limit: number) =>
    useQuery(publisherProductsQueryOptions(slug, page, limit));
