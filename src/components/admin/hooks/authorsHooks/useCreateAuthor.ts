import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AuthorService } from '../../services/author.service';

export const useCreateAuthor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => AuthorService.addAdminAuthor(formData),
        onSuccess: async (data) => {
            console.log('Author created successfully:', data);
            await queryClient.invalidateQueries({
                queryKey: ['authors']
            });
        }
    });
};
