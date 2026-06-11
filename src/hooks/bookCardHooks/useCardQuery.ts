import { UserService } from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';

export const useAddCartMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { productId: string; quantity: number }) => {
            await UserService.addToCart(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success('savatga qoshildi');
        }
    });
};
