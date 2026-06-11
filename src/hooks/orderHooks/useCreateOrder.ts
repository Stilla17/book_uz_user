import { UserService } from '@/services/api';
import { useMutation } from '@tanstack/react-query';

export const useCreateOrder = () => {
    return useMutation({
        mutationFn: UserService.createOrder,
        onSuccess: (data) => {
            console.log('Order created successfully:', data);
        }
    });
};
