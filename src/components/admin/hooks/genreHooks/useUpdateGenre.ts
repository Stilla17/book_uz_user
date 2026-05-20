import { CreateGenreData } from '@/types/category.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GenreService } from '../../services/genre.service';

interface UpdateGenreParams {
    id: string;
    data: CreateGenreData;
}

export const useUpdateGenre = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateGenreParams) => GenreService.updateAdminGenre(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['genres'] });
        }
    });
};
