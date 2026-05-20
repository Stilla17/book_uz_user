import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AuthorService } from '../../services/author.service';

interface UpdateAuthorParams {
    id: string;
    formData: FormData;
}

export const useUpdateAuthor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, formData }: UpdateAuthorParams) => AuthorService.updateAdminAuthor(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authors'] });
        }
    });
};
