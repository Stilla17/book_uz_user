import { useMutation, useQueryClient } from '@tanstack/react-query';

import { NewsService } from '../../services/news.service';
import { AxiosError } from 'axios';

type UpdateNewsParams = {
    id: string;
    formData: FormData;
};

export const useUpdateNews = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, formData }: UpdateNewsParams) => NewsService.updateAdminNews(id, formData),
        onSuccess: async (_data, variables) => {
            await queryClient.invalidateQueries({ queryKey: ['news'] });
            await queryClient.invalidateQueries({ queryKey: ['news', 'detail', variables.id] });
        },
        onError: (error: unknown) => {
            if (error instanceof AxiosError) {
                console.error('News update error response:', error.response?.data);
                console.error('News update error status:', error.response?.status);
                return;
            }
            console.error('News update error:', error);
        }
    });
};
