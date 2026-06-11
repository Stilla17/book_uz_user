import { StatusFilter } from '@/app/(admin)/admin/orders/page';
import { Order, OrdersResponse } from '@/types/orders';
import { useQuery } from '@tanstack/react-query';

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
