import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AuthorService } from '../../services/author.service';

export const useDeleteAuthor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => AuthorService.deleteAdminAuthor(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['authors']
            });
        }
    });
};
