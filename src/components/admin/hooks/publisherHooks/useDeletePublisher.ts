import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AdminService } from '../../services/publisher.service';

export const useDeletePublisher = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => AdminService.deleteAdminPublishers(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['publishers']
            });
        }
    });
};
