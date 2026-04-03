'use client';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { SearchResults } from '@/types/search.types';

const emptyResults: SearchResults = {
    products: [],
    categories: [],
    authors: [],
    totalCount: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalAuthors: 0
};

export const useSearchSuggestionsQuery = (query: string) =>
    useQuery({
        queryKey: ['search', 'suggestions', query],
        queryFn: async () => {
            const response = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
            return (response.data?.success ? response.data.data : emptyResults) as SearchResults;
        },
        enabled: query.trim().length >= 2,
        placeholderData: emptyResults
    });
