import { useMutation, useQueryClient } from '@tanstack/react-query';

import { NewsService } from '../../services/news.service';
import { AxiosError } from 'axios';

export const useCreateNews = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => NewsService.addAdminNews(formData),
        onSuccess: async (data) => {
            console.log('News created successfully:', data);
            await queryClient.invalidateQueries({ queryKey: ['news'] });
        },
        onError: (error: unknown) => {
            if (error instanceof AxiosError) {
                console.error('News create error response:', error.response?.data);
                console.error('News create error status:', error.response?.status);
                return;
            }
            console.error('News create error:', error);
        }
    });
};
