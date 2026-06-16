import { Product } from '@/types';

import { api } from './api';

export type TopSalesPeriod = 'week' | 'month';

export type TopSalesResponse = {
    period: TopSalesPeriod;
    from?: string;
    to?: string;
    syncedAt?: string | null;
    products: Product[];
};

export const topSalesService = {
    async getTopSales(period: TopSalesPeriod, limit = 10): Promise<TopSalesResponse> {
        const response = await api.get('/top-sales', {
            params: { period, limit }
        });

        return (
            response.data?.data ?? {
                period,
                products: [],
                syncedAt: null
            }
        );
    }
};
