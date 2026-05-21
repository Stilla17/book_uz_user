import { useMutation, useQueryClient } from '@tanstack/react-query';

import { NewsService } from '../../services/news.service';

export const useDeleteNews = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => NewsService.deleteAdminNews(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['news'] });
        }
    });
};
