import { AdminBooksResponse, Book } from '@/types/book';
import { useQuery } from '@tanstack/react-query';

import { BookService } from '../../services/book.service';

export const useBookQuery = () => {
    return useQuery<AdminBooksResponse>({
        queryKey: ['books'],
        queryFn: async () => {
            const data = await BookService.getAdminBook({ page: 1, limit: 100 });
            return data.products ?? [];
        }
    });
};

export const useBookListQuery = (page: number, limit: number, keyword = '') => {
    const search = keyword.trim();

    return useQuery<AdminBooksResponse>({
        queryKey: ['books', 'list', page, limit, search],
        queryFn: () => BookService.getAdminBook({ page, limit, search }),
        placeholderData: (previousData) => previousData
    });
};

export const useBookDetailQuery = (id: string | null) => {
    return useQuery<Book>({
        queryKey: ['books', 'detail', id],
        queryFn: () => BookService.getAdminBookId(id!),
        enabled: !!id
    });
};
