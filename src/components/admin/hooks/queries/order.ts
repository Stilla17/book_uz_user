import { StatusFilter } from '@/app/(admin)/admin/orders/page';
import { Order, OrdersResponse } from '@/types/orders';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { OrderService } from '../../services/order.service';

export const useOrderQuery = (search: string, limit: number, page: number, status: StatusFilter) => {
    return useQuery<OrdersResponse>({
        queryKey: ['orders', search, page, limit, status],
        queryFn: () => OrderService.getOrders(search, limit, page, status)
    });
};

export const useOrderIdQuery = (id: string) => {
    return useQuery<Order>({
        queryKey: ['orders', 'detail', id],
        queryFn: () => OrderService.getOrderId(id),
        enabled: Boolean(id)
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: OrderService.updateOrderStatus,
        onSuccess: (order: Order) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard-stats'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard', 'site-sales'] });
            queryClient.setQueryData(['orders', 'detail', order._id], order);
        }
    });
};
