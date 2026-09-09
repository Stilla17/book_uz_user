import type { StockFilter } from '@/helpers/admin/newBook';
import { AdminBooksResponse, Book, BookStats } from '@/types/book';
import { useQuery } from '@tanstack/react-query';

import { BookService } from '../../services/book.service';

export const useBookQuery = () => {
    return useQuery<Book[]>({
        queryKey: ['books'],
        queryFn: async () => {
            const limit = 200;
            const firstPage = await BookService.getAdminBook({ page: 1, limit });
            const firstPageProducts = firstPage.products ?? [];
            const totalPages = Number(firstPage.pagination?.pages ?? 1);

            if (!Number.isFinite(totalPages) || totalPages <= 1) {
                return firstPageProducts;
            }

            const otherPages = await Promise.all(
                Array.from({ length: totalPages - 1 }, (_, index) =>
                    BookService.getAdminBook({ page: index + 2, limit })
                )
            );

            return otherPages.reduce<Book[]>(
                (products, pageData) => [...products, ...(pageData.products ?? [])],
                firstPageProducts
            );
        }
    });
};

export const useBookListQuery = (
    page: number,
    limit: number,
    keyword = '',
    sortBy?: 'price' | 'title',
    sortOrder?: 'asc' | 'desc',
    stockFilter: StockFilter = 'all'
) => {
    const search = keyword.trim();

    return useQuery<AdminBooksResponse>({
        queryKey: ['books', 'list', page, limit, search, sortBy, sortOrder, stockFilter],
        queryFn: ({ signal }) =>
            BookService.getAdminBook({ page, limit, search, sortBy, sortOrder, stockFilter }, signal),
        placeholderData: (previousData, previousQuery) =>
            previousQuery?.queryKey
                .slice(3)
                .every((value, index) => value === [limit, search, sortBy, sortOrder, stockFilter][index])
                ? previousData
                : undefined
    });
};

export const useBookDetailQuery = (id: string | null) => {
    return useQuery<Book>({
        queryKey: ['books', 'detail', id],
        queryFn: () => BookService.getAdminBookId(id!),
        enabled: !!id
    });
};

export const useBookStatsQuery = () =>
    useQuery<BookStats>({
        queryKey: ['books', 'stats'],
        queryFn: ({ signal }) => BookService.getAdminBookStats(signal),
        staleTime: 60_000
    });
