'use client';

import { useDashboardStatsQuery } from '@/components/admin/hooks/queries/dashboard';
import DashboardChart from '@/components/admin/sections/DashboardChart';

import { BookOpen, CircleDollarSign, PackageCheck, Users } from 'lucide-react';

const formatNumber = (value?: number) => Number(value ?? 0).toLocaleString('ru-RU');

const formatCompactAmount = (value?: number) => {
    const amount = Number(value ?? 0);

    if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}B`;
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K`;

    return formatNumber(amount);
};

export default function AdminPage() {
    const { data, isLoading } = useDashboardStatsQuery();

    const stats = [
        { label: 'Jami kitoblar', value: formatNumber(data?.booksTotal), icon: BookOpen, color: 'bg-[#ef7f1a]' },
        { label: 'Buyurtmalar', value: formatNumber(data?.ordersTotal), icon: PackageCheck, color: 'bg-[#7c6dc8]' },
        { label: 'Foydalanuvchilar', value: formatNumber(data?.usersTotal), icon: Users, color: 'bg-[#43a27a]' },
        {
            label: "To'langan summa",
            value: `${formatCompactAmount(data?.revenue)} so'm`,
            icon: CircleDollarSign,
            color: 'bg-[#285c7f]'
        }
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
