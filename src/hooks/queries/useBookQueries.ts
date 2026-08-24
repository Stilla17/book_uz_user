'use client';

import { getRequestParams, mapProductToBook } from '@/helpers/bookSection';
import { bookService } from '@/services/book.service';
import type { Book } from '@/types/book';
import type { BookSectionProps } from '@/types/section.types';
import { queryOptions, useQuery } from '@tanstack/react-query';

type ProductQueryParams = Record<string, string | number | undefined>;
type BookSectionType = NonNullable<BookSectionProps['type']>;

export const catalogProductsQueryOptions = (
    requestParams: ProductQueryParams,
    authorId?: string,
    useAuthorProducts = false
) =>
    queryOptions({
        queryKey: ['catalog-products', useAuthorProducts ? 'author-products' : 'all-products', requestParams],
        queryFn: () =>
            useAuthorProducts && authorId
                ? bookService.getProductsByAuthor(authorId, requestParams)
                : bookService.getAllProducts(requestParams),
        placeholderData: (previousData) => previousData,
        staleTime: 5 * 60 * 1000
    });

export const useCatalogProductsQuery = (
    requestParams: ProductQueryParams,
    authorId?: string,
    useAuthorProducts = false
) => useQuery(catalogProductsQueryOptions(requestParams, authorId, useAuthorProducts));

export const useBookSectionQuery = (type: BookSectionType, enabled: boolean) =>
    useQuery({
        queryKey: ['book-section', type],
        queryFn: async () => {
            if (type === 'new') {
                const products = await bookService.getNewArrivals();
                return products.map((product) => mapProductToBook(product, type));
            }

            const response = await bookService.getAllProducts(getRequestParams(type));
            return response.products.map((product) => mapProductToBook(product, type));
        },
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        refetchOnWindowFocus: false
    });

export const useBookDetailQuery = <TBook extends Book = Book>(slug: string) =>
    useQuery<TBook | null>({
        queryKey: ['book', slug],
        queryFn: () => bookService.getBookById(slug) as Promise<TBook | null>,
        enabled: Boolean(slug),
        staleTime: 5 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false
    });

export const useBookRecommendationsQuery = (filterKey: 'subgenre' | 'category', filterValue: string, bookId: string) =>
    useQuery({
        queryKey: ['genre-recommendations', filterKey, filterValue, bookId],
        queryFn: () => bookService.getAllProducts({ [filterKey]: filterValue, page: 1, limit: 12 }),
        enabled: Boolean(filterValue),
        staleTime: 5 * 60 * 1000
    });

export const useRandomBooksQuery = (
    requestParams: ProductQueryParams = {
        limit: 5,
        minPrice: 20_000
    }
) =>
    useQuery({
        queryKey: ['random-books', requestParams],
        queryFn: () => bookService.getRandomBooks(requestParams),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    });
