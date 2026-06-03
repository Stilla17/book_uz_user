import { Branch } from '@/types';
import { useQuery } from '@tanstack/react-query';

import { BranchService } from '../../services/branch.service';

export const useBranchQuery = () => {
    return useQuery<Branch[]>({
        queryKey: ['branches'],
        queryFn: async () => {
            const data = await BranchService.getBranches();
            return data?.branches ?? data ?? [];
        }
    });
};
export const useBranchUserQuery = () => {
    return useQuery<Branch[]>({
        queryKey: ['branches', 'user'],
        queryFn: async () => {
            const data = await BranchService.getBranchesUser();
            return data?.branches ?? data ?? [];
        }
    });
};

export const useBranchDetailQuery = (id: string | null) => {
    return useQuery<Branch>({
        queryKey: ['branches', 'detail', id],
        queryFn: () => BranchService.getBranchById(id!),
        enabled: !!id
    });
};
