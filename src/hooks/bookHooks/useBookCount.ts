import { bookService } from '@/services/book.service';
import { useQuery } from '@tanstack/react-query';

export const useBookCount = () =>
    useQuery({
        queryKey: ['books-count'],
        queryFn: () =>
            bookService.getAllProducts({
                page: 1,
                limit: 1
            })
    });
