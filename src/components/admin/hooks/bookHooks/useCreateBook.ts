import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { BookService } from '../../services/book.service';

export const useCreateBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => BookService.addAdminBook(formData),
        onSuccess: async (data) => {
            console.log('Book created successfully:', data);
            await queryClient.invalidateQueries({
                queryKey: ['books']
            });
        },
        onError: (error: unknown) => {
            if (error instanceof AxiosError) {
                console.error('Book create error response:', error.response?.data);
                console.error('Book create error status:', error.response?.status);
                return;
            }
            console.error('Book create error:', error);
        }
    });
};
