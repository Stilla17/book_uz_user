import { api } from '@/components/admin/services/api';
import { useQuery } from '@tanstack/react-query';

export type DashboardStats = {
    booksTotal: number;
    usersTotal: number;
    ordersTotal: number;
    revenue: number;
};

const fetchDashboardStats = async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/dashboard/stats');
    const data = response.data.data as {
        counters?: { totalOrders?: number; totalUsers?: number; totalProducts?: number };
        revenue?: { total?: number };
    };

    return {
        booksTotal: Number(data.counters?.totalProducts ?? 0),
        usersTotal: Number(data.counters?.totalUsers ?? 0),
        ordersTotal: Number(data.counters?.totalOrders ?? 0),
        revenue: Number(data.revenue?.total ?? 0)
    };
};

export const useDashboardStatsQuery = () =>
    useQuery({
        queryKey: ['admin', 'dashboard-stats'],
        queryFn: fetchDashboardStats,
        staleTime: 60_000
    });
