import type { CreatePromoPayload } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PromoService } from '../../services/promo.service';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';

type UpdatePromoVariables = {
    id: string;
    data: Partial<CreatePromoPayload>;
};

type PromoErrorResponse = {
    message?: string;
};

export const useUpdatePromo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdatePromoVariables) => PromoService.updatePromo(id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['promos'] });
        },
        onError: (error: AxiosError<PromoErrorResponse>) => {
            toast.error(error.response?.data?.message || 'Promokodni yangilashda xatolik yuz berdi');
        }
    });
};
