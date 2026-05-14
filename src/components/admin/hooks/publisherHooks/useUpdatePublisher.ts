import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AdminService } from '../../services/publisher.service';

interface UpdatePublisherParams {
    id: string;
    formData: FormData;
}

export const useUpdatePublisher = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, formData }: UpdatePublisherParams) => AdminService.updateAdminPublishers(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['publishers'] });
        }
    });
};
