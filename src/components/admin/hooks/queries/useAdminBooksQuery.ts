import { getSearchQueryVariants } from '@/lib/search-transliteration';
import { bookService } from '@/services/book.service';
import { useQuery } from '@tanstack/react-query';

export const ADMIN_BOOKS_LIMIT = 25;

type ProductListData = Awaited<ReturnType<typeof bookService.getAllProducts>>;

const mergeProductLists = (lists: ProductListData[], limit: number): ProductListData => {
    const seenIds = new Set<string>();
    const products = lists
        .flatMap((list) => list.products)
        .filter((book) => {
            if (seenIds.has(book._id)) return false;

            seenIds.add(book._id);
            return true;
        })
        .slice(0, limit);

    const total = lists.reduce((sum, list) => sum + Number(list.pagination.total || 0), 0);
    const page = lists[0]?.pagination.page ?? 1;

    return {
        products,
        pagination: {
            page,
            limit,
            total,
            pages: Math.max(1, Math.ceil(total / Math.max(limit, 1)))
        }
    };
};

export const useAdminBooksQuery = (page: number, keyword: string) => {
    return useQuery({
        queryKey: ['admin-books', page, keyword],
        queryFn: async () => {
            const searchVariants = getSearchQueryVariants(keyword);

            if (searchVariants.length <= 1) {
                return bookService.getAllProducts({
                    page,
                    limit: ADMIN_BOOKS_LIMIT,
                    keyword: keyword || undefined
                });
            }

            const lists = await Promise.all(
                searchVariants.map((variant) =>
                    bookService.getAllProducts({
                        page,
                        limit: ADMIN_BOOKS_LIMIT,
                        keyword: variant
                    })
                )
            );

            return mergeProductLists(lists, ADMIN_BOOKS_LIMIT);
        },
        placeholderData: (previousData) => previousData
    });
};
