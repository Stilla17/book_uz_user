import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PromoService } from '../../services/promo.service';

export const useDeletePromo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => PromoService.deletePromo(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['promos'] });
        }
    });
};
