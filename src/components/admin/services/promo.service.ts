import { api } from './api';
import type { ApiResponse, Coupon, CreatePromoPayload } from '@/types';

export const PromoService = {
    getPromos: async () => {
        const response = await api.get<ApiResponse<Coupon[]>>('/admin/coupons');
        return response.data.data;
    },

    createPromo: async (data: CreatePromoPayload) => {
        const response = await api.post('/admin/coupons', data);
        return response.data;
    },

    deletePromo: async (id: string) => {
        const response = await api.delete(`/admin/coupons/${id}`);
        return response.data;
    },

    updatePromo: async (id: string, data: Partial<CreatePromoPayload>) => {
        const response = await api.put(`/admin/coupons/${id}`, data);
        return response.data;
    }
};
