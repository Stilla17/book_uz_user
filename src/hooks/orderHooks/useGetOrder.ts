import { UserOrderService } from '@/services/order.service';
import { useQuery } from '@tanstack/react-query';

export const useGetOrder = (enabled = true) => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: UserOrderService.getUserOrders,
        enabled
    });
};
