import { BranchFormData } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BranchService } from '../../services/branch.service';

export const useCreateBranch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: BranchFormData) => BranchService.createBranch(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['branches'] });
        }
    });
};
