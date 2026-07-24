'use client';

import DashboardChart from '@/components/admin/sections/DashboardChart';
import { api } from '@/components/admin/services/api';
import { isOrderRevenueEligible } from '@/utils/order';
import { useQuery } from '@tanstack/react-query';

import { BookOpen, CircleDollarSign, PackageCheck, Users } from 'lucide-react';

type AdminOrdersData = {
    orders?: Array<{
        totalAmount?: number;
        paymentStatus?: string;
        paymentType?: string;
        status?: string;
    }>;
    pagination?: {
        total?: number;
        pages?: number;
    };
};

const formatNumber = (value?: number) => Number(value ?? 0).toLocaleString('ru-RU');

const formatCompactAmount = (value?: number) => {
    const amount = Number(value ?? 0);

    if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}B`;
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K`;

    return formatNumber(amount);
};

const getTotalFromPagination = (data: any, fallback = 0) =>
    Number(data?.pagination?.total ?? data?.pagination?.totalItems ?? data?.total ?? fallback);

const fetchBooksTotal = async () => {
    const response = await api.get('/admin/products', {
        params: { page: 1, limit: 1 }
    });
    const data = response.data.data;

    return getTotalFromPagination(data, Array.isArray(data?.products) ? data.products.length : 0);
};

const fetchUsersTotal = async () => {
    const response = await api.get('/admin/users', {
        params: { page: 1, limit: 1 }
    });
    const data = response.data.data;

    return Number(data?.totals?.all ?? data?.pagination?.total ?? 0);
};

const fetchOrdersDashboardStats = async () => {
    const limit = 100;
    const firstResponse = await api.get('/admin/orders', {
        params: { page: 1, limit }
    });
    const firstData: AdminOrdersData = firstResponse.data.data;
    const totalOrders = Number(firstData.pagination?.total ?? firstData.orders?.length ?? 0);
    const totalPages = Number(firstData.pagination?.pages ?? 1);
    const restResponses =
        totalPages > 1
            ? await Promise.all(
                  Array.from({ length: totalPages - 1 }, (_, index) =>
                      api.get('/admin/orders', {
                          params: { page: index + 2, limit }
                      })
                  )
              )
            : [];
    const allOrders = [
        ...(firstData.orders ?? []),
        ...restResponses.flatMap((response) => response.data.data?.orders ?? [])
    ];
    const revenue = allOrders.reduce((sum, order) => {
        if (!isOrderRevenueEligible(order)) return sum;

        return sum + Number(order.totalAmount || 0);
    }, 0);

    return {
        totalOrders,
        revenue
    };
};

const fetchDashboardStats = async () => {
    const [booksTotal, usersTotal, ordersStats] = await Promise.all([
        fetchBooksTotal(),
        fetchUsersTotal(),
        fetchOrdersDashboardStats()
    ]);

    return {
        booksTotal,
        usersTotal,
        ordersTotal: ordersStats.totalOrders,
        revenue: ordersStats.revenue
    };
};

export default function AdminPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'dashboard-stats'],
        queryFn: fetchDashboardStats
    });

    const stats = [
        { label: 'Jami kitoblar', value: formatNumber(data?.booksTotal), icon: BookOpen, color: 'bg-[#ef7f1a]' },
        { label: 'Buyurtmalar', value: formatNumber(data?.ordersTotal), icon: PackageCheck, color: 'bg-[#7c6dc8]' },
        { label: 'Foydalanuvchilar', value: formatNumber(data?.usersTotal), icon: Users, color: 'bg-[#43a27a]' },
        { label: 'Daromad', value: formatCompactAmount(data?.revenue), icon: CircleDollarSign, color: 'bg-[#285c7f]' }
    ];

    return (
        <div className='space-y-6'>
            <section className='min-w-0'>
                <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                    {stats.map(({ label, value, icon: Icon, color }) => (
                        <div
                            key={label}
                            className='min-h-36 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                            <div className='flex items-center justify-between'>
                                <span className={`grid size-11 place-items-center rounded-[18px] ${color} text-white`}>
                                    <Icon size={20} />
                                </span>
                            </div>
                            <div className='mt-5'>
                                <p className='text-2xl font-black text-[#2f2a25] dark:text-white'>
                                    {isLoading ? '...' : value}
                                </p>
                                <p className='mt-1 text-sm font-bold text-[#9d907e] dark:text-slate-400'>{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <DashboardChart />
        </div>
    );
}
