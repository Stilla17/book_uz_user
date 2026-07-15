import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BookService } from '../../services/book.service';

interface UpdateBookParams {
    id: string;
    formData: FormData;
}

export const useUpdateBook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, formData }: UpdateBookParams) => BookService.updateAdminBook(id, formData),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['books'] }),
                queryClient.invalidateQueries({ queryKey: ['book'] }),
                queryClient.invalidateQueries({ queryKey: ['book-section'] }),
                queryClient.invalidateQueries({ queryKey: ['catalog-products'] }),
                queryClient.invalidateQueries({ queryKey: ['genre-recommendations'] })
            ]);
            await queryClient.refetchQueries({ queryKey: ['books'], type: 'active' });
        }
    });
};
