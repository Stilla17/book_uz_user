import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BookService } from '../../services/book.service';

export const useDeleteBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => BookService.deleteAdminBook(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['books']
            });
        }
    });
};
