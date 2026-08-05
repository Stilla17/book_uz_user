'use client';

import { filterService } from '@/services/filter.service';
import { useQuery } from '@tanstack/react-query';

const ENTITY_SEARCH_MIN_LENGTH = 2;

const entitySearchOptions = {
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false
} as const;

export const useAuthorSearchQuery = (search: string) =>
    useQuery({
        queryKey: ['book-filter', 'authors-search', search],
        queryFn: () => filterService.searchAuthors(search),
        enabled: search.length >= ENTITY_SEARCH_MIN_LENGTH,
        ...entitySearchOptions
    });

export const usePublisherSearchQuery = (search: string) =>
    useQuery({
        queryKey: ['book-filter', 'publishers-search', search],
        queryFn: () => filterService.searchPublishers(search),
        enabled: search.length >= ENTITY_SEARCH_MIN_LENGTH,
        ...entitySearchOptions
    });
