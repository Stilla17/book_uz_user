import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { AdminHrService, type HrListParams } from '../../services/hr.service';

const hrKey = ['admin', 'hr'];

export const useAdminHrApplications = (params: HrListParams) =>
    useQuery({
        queryKey: [...hrKey, params],
        queryFn: () => AdminHrService.getAll(params)
    });

export const useAdminHrApplication = (id: string) =>
    useQuery({
        queryKey: [...hrKey, id],
        queryFn: () => AdminHrService.getById(id),
        enabled: Boolean(id)
    });

export const useUpdateHrApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: AdminHrService.update,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: hrKey });
            queryClient.invalidateQueries({ queryKey: [...hrKey, variables.id] });
        }
    });
};

export const useDeleteHrApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: AdminHrService.delete,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: hrKey })
    });
};
