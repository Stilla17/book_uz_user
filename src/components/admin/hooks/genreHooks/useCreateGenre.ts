import { CreateGenreData } from '@/types/category.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GenreService } from '../../services/genre.service';

export const useCreateGenre = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateGenreData) => GenreService.addAdminGenre(data),
        onSuccess: async (data) => {
            console.log('Genre created successfully:', data);
            await queryClient.invalidateQueries({
                queryKey: ['genres']
            });
        }
    });
};
