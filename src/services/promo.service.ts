import type { ApiResponse, Coupon } from '@/types';

import { api } from './api';

export const PromoServiceUser = {
    getPromos: async (): Promise<Coupon[]> => {
        const response = await api.get<ApiResponse<Coupon[]>>('/coupons');
        return response.data.data;
    }
};
