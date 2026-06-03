import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { PromoService } from '../../services/promo.service';
import type { CreatePromoPayload } from '@/types';

type PromoErrorResponse = {
    message?: string;
};

export const useCreatePromo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePromoPayload) => PromoService.createPromo(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['promos'] });
        },
        onError: (error: AxiosError<PromoErrorResponse>) => {
            toast.error(error.response?.data?.message || 'Promokod yaratishda xatolik yuz berdi');
        }
    });
};
