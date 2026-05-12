'use client';

import { useMemo } from 'react';

import { getSearchQueryVariants } from '@/lib/search-transliteration';
import { api } from '@/services/api';
import type { SearchAuthor, SearchCategory, SearchProduct, SearchResults } from '@/types/search.types';
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

const uniqueById = <T extends { _id: string }>(items: T[]) => {
    const seenIds = new Set<string>();

    return items.filter((item) => {
        if (seenIds.has(item._id)) return false;

        seenIds.add(item._id);

        return true;
    });
};

const mergeSearchResults = (results: SearchResults[]): SearchResults => {
    const products = uniqueById(results.flatMap((result) => result.products ?? []) as SearchProduct[]).slice(0, 5);
    const categories = uniqueById(results.flatMap((result) => result.categories ?? []) as SearchCategory[]).slice(0, 3);
    const authors = uniqueById(results.flatMap((result) => result.authors ?? []) as SearchAuthor[]).slice(0, 3);

    return {
        products,
        categories,
        authors,
        totalCount: products.length + categories.length + authors.length,
        totalProducts: products.length,
        totalCategories: categories.length,
        totalAuthors: authors.length
    };
};

export const useSearchSuggestionsQuery = (query: string) => {
    const queryVariants = useMemo(() => getSearchQueryVariants(query), [query]);

    return useQuery({
        queryKey: ['search', 'suggestions', queryVariants],
        queryFn: async ({ signal }) => {
            const responses = await Promise.all(
                queryVariants.map((queryVariant) =>
                    api.get('/search/suggestions', {
                        params: { q: queryVariant },
                        signal
                    })
                )
            );
            const results = responses.map((response) =>
                response.data?.success ? (response.data.data as SearchResults) : emptyResults
            );

            return mergeSearchResults(results);
        },
        enabled: queryVariants.length > 0,
        placeholderData: emptyResults
    });
};
