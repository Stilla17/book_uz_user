import { BranchFormData } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BranchService } from '../../services/branch.service';

type UpdateBranchParams = {
    id: string;
    data: BranchFormData;
};

export const useUpdateBranch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateBranchParams) => BranchService.updateBranch(id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['branches'] });
        }
    });
};
