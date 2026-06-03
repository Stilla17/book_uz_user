import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BranchService } from '../../services/branch.service';

export const useDeleteBranch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => BranchService.deleteBranch(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['branches'] });
        }
    });
};
