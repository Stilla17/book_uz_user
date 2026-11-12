import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { AdminReferralService } from '../../services/referral.service';

const referralQueryKey = ['admin', 'referrals'];

export const useAdminReferralsQuery = () =>
    useQuery({
        queryKey: referralQueryKey,
        queryFn: AdminReferralService.getAll
    });

export const useCreateReferral = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: AdminReferralService.create,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: referralQueryKey })
    });
};

export const useUpdateReferral = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: AdminReferralService.update,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: referralQueryKey })
    });
};

export const useDeleteReferral = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: AdminReferralService.delete,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: referralQueryKey })
    });
};
