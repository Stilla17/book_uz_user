import { api } from '@/services/api';
import type { SearchResults } from '@/types/search.types';
import { useQuery } from '@tanstack/react-query';

const emptyResults: SearchResults = {
    products: [],
    categories: [],
    authors: [],
    totalCount: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalAuthors: 0
};

export const useSearchSuggestionsQuery = (query: string) => {
    const search = query.trim();

    return useQuery({
        queryKey: ['search', 'suggestions', search],
        queryFn: async ({ signal }) => {
            const response = await api.get('/search/suggestions', {
                params: { q: search },
                signal
            });

            return response.data?.success ? (response.data.data as SearchResults) : emptyResults;
        },
        enabled: search.length >= 2,
        placeholderData: emptyResults,
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000
    });
};
