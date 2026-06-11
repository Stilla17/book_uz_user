import { api } from './api';
import type { Order, OrdersResponse } from '@/types/orders';

type UserOrdersResponse = OrdersResponse | Order[];

export const UserOrderService = {
    getUserOrders: async (): Promise<Order[]> => {
        const response = await api.get('/orders/my-orders');
        const data: UserOrdersResponse = response.data?.data ?? response.data;

        if (Array.isArray(data)) return data;

        return data?.orders ?? [];
    }
};
