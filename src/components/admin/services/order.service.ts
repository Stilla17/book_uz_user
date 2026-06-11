import { StatusFilter } from '@/app/(admin)/admin/orders/page';

import { api } from './api';

export const OrderService = {
    getOrders: async (search: string, limit: number, page: number, status: StatusFilter) => {
        const response = await api.get('/admin/orders', {
            params: {
                search,
                limit,
                page,
                status: status === 'ALL' ? undefined : status
            }
        });

        return response.data.data;
    },

    getOrderId: async (id: string) => {
        const response = await api.get(`/admin/orders/${id}`);
        return response.data.data;
    }
};
