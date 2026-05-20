import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GenreService } from '../../services/genre.service';

export const useDeleteGenre = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => GenreService.deleteAdminGenre(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['genres']
            });
        }
    });
};
