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
            await queryClient.invalidateQueries({ queryKey: ['books'] });
            await queryClient.invalidateQueries({ queryKey: ['books', 'detail'] });
            await queryClient.refetchQueries({ queryKey: ['books'], type: 'active' });
        }
    });
};
