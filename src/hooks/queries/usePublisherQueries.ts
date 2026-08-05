'use client';

import { ClientService } from '@/services/api';
import { fetchAllAndSortByCount } from '@/utils/paginated-collection';
import { queryOptions, useQuery } from '@tanstack/react-query';

const PUBLISHERS_FETCH_LIMIT = 100;

const getAllPublishers = () =>
    fetchAllAndSortByCount({
        fetchPage: (page, limit) => ClientService.getPublishers({ page, limit }),
        getItems: (response) => response.publishers,
        getTotalPages: (response) => response.pagination.pages,
        getCount: (publisher) => publisher.booksCount,
        getName: (publisher) => publisher.name,
        fetchLimit: PUBLISHERS_FETCH_LIMIT
    });

export const useAllPublishersQuery = () =>
    useQuery({
        queryKey: ['publishers', 'books-count-desc'],
        queryFn: getAllPublishers,
        staleTime: 5 * 60 * 1000
    });

export const usePublishersQuery = (page: number, limit: number) =>
    useQuery({
        queryKey: ['publishers', page, limit],
        queryFn: () => ClientService.getPublishers({ page, limit }),
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000
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
