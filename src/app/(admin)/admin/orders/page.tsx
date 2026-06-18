'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useOrderQuery } from '@/components/admin/hooks/queries/order';
import PaginationFooter from '@/components/admin/other/PaginationFooter';
import HeadSection from '@/components/admin/sections/HeadSection';
import { BooksTableSkeleton } from '@/components/ui/skeleton';
import { orderStatusConfig } from '@/data';
import { useUrlSearch } from '@/hooks/useUrlSearch';
import { FETCH_PAGINATION_LIMIT } from '@/tools';
import { OrderStatus } from '@/types/orders';
import { getPageFromUrl, updateUrlPage } from '@/utils/pagination';

import dayjs from 'dayjs';
import { Banknote, Clock3, Search, ShoppingBag } from 'lucide-react';

export type StatusFilter = 'ALL' | OrderStatus;

const AdminOrdersPage = () => {
    const [active, setActive] = useState<StatusFilter>('ALL');
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlPage = getPageFromUrl(searchParams.get('page'));
    const [page, setPage] = useState(urlPage);
    const { searchInput, setSearchInput, debouncedSearch } = useUrlSearch();
    const {
        data: orders,
        isFetching,
        isLoading
    } = useOrderQuery(debouncedSearch, FETCH_PAGINATION_LIMIT, page, active);

    const pagination = orders?.pagination;

    useEffect(() => {
        setPage(urlPage);
    }, [urlPage]);

    const updatePage = (nextPage: number) => {
        updateUrlPage({
            nextPage,
            totalPages: pagination?.pages ?? 1,
            searchParams,
            replace: router.replace,
            setPage
        });
    };

    const filterStatus = orders?.orders.reduce(
        (sum, item) => (item.paymentStatus.includes('PENDING') ? sum + 1 : sum),
        0
    );
    const totalAmountItems = orders?.orders.reduce((sum, item) => item.totalAmount + sum, 0);
    const formatterPrice = new Intl.NumberFormat('ru-RU').format(Number(totalAmountItems));

    const filteredOrders = orders?.orders.filter((order) => {
        const value = searchInput.toLowerCase();

        return (
            order._id.toLowerCase().includes(value) ||
            (order.guestName ?? '').toLowerCase().includes(value) ||
            order.shippingAddress?.phone?.includes(value)
        );
    });

    const stats = [
        {
            label: 'Jami buyurtmalar',
            value: orders?.orders.length,
            icon: ShoppingBag,
            color: 'bg-[#ef7f1a]'
        },
        {
            label: 'Yangi buyurtmalar',
            value: filterStatus,
            icon: Clock3,
            color: 'bg-[#285c7f]'
        },

        {
            label: 'Bugungi tushum',
            value: formatterPrice + " so'm",
            icon: Banknote,
            color: 'bg-emerald-600'
        }
    ];

    const statusFilters: Array<{
        label: string;
        value: StatusFilter;
    }> = [
        { label: 'Barchasi', value: 'ALL' },
        { label: 'Kutilmoqda', value: 'PENDING' },
        { label: 'Qabul qilindi', value: 'PROCESSING' },
        { label: "Yo'lda", value: 'DELIVERING' },
        { label: 'Yetkazildi', value: 'DELIVERED' },
        { label: 'Bekor qilindi', value: 'CANCELLED' }
    ];

    return (
        <div className='space-y-5'>
            <section className='flex justify-between gap-4 max-sm:flex-wrap'>
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <article
                        key={label}
                        className='w-full rounded-[22px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <div className='flex items-start justify-between gap-3'>
                            <span className={`grid size-11 place-items-center rounded-2xl ${color} text-white`}>
                                <Icon size={20} />
                            </span>
                        </div>
                        <p className='mt-4 text-2xl font-black text-[#2f2a25] dark:text-white'>{value}</p>
                        <p className='text-sm font-bold text-[#9d907e] dark:text-slate-400'>{label}</p>
                    </article>
                ))}
            </section>

            <section className='overflow-hidden rounded-[24px] bg-[#fffaf2] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                <div className='flex flex-col gap-3 border-b border-[#eadfce] p-4 xl:flex-row xl:items-center xl:justify-between dark:border-slate-800'>
                    <label className='flex h-11 min-w-0 items-center gap-2 rounded-2xl bg-[#f2e7d8] px-4 text-[#817466] xl:max-w-sm xl:flex-1 dark:bg-slate-900 dark:text-slate-300'>
                        <Search size={18} className='shrink-0' />
                        <input
                            type='search'
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder='ID, mijoz yoki telefon raqami'
                            className='h-full min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#9d907e] dark:placeholder:text-slate-500'
                        />
                    </label>

                    <div className='flex flex-wrap gap-2'>
                        {statusFilters.map((filter) => (
                            <button
                                key={filter.value}
                                type='button'
                                onClick={() => {
                                    setActive(filter.value);
                                    setPage(1);
                                }}
                                className={`h-10 rounded-xl px-4 text-sm font-black ${
                                    active === filter.value ? 'bg-[#ef7f1a] text-white' : 'bg-white text-[#817466]'
                                }`}>
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='overflow-x-auto'>
                    <table className='w-full min-w-[1040px] text-left'>
                        <thead>
                            <tr className='border-b border-[#eadfce] text-xs font-black text-[#9d907e] uppercase dark:border-slate-800 dark:text-slate-500'>
                                <th className='px-4 py-3'>№</th>
                                <th className='px-4 py-3'>Mijoz</th>
                                <th className='px-4 py-3'>Buyurtma vaqti</th>
                                <th className='px-4 py-3'>Telefon raqam</th>
                                <th className='px-4 py-3'>Summa</th>
                                <th className='px-4 py-3'>To'lov</th>
                                <th className='px-4 py-3'>Holat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <BooksTableSkeleton />
                            ) : (
                                filteredOrders?.map((order, index) => {
                                    const statusConfig = orderStatusConfig[order.status] ?? {
                                        label: order.status || "Noma'lum",
                                        className:
                                            'bg-slate-50 text-slate-700 ring-slate-100 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-500/20'
                                    };

                                    return (
                                        <tr
                                            key={order._id}
                                            className='border-b border-[#f0e4d3] bg-white transition last:border-0 hover:bg-[#fffaf2] dark:border-slate-900 dark:bg-slate-950 dark:hover:bg-slate-900'>
                                            <td className='p-0'>
                                                <Link
                                                    href={`/admin/orders/slug?id=${order._id}`}
                                                    aria-label={`${order._id} buyurtmasini ko'rish`}
                                                    className='block px-4 py-4'>
                                                    <p className='font-black text-[#2f2a25] dark:text-white'>
                                                        {index + 1}
                                                    </p>
                                                </Link>
                                            </td>
                                            <td className='p-0'>
                                                <Link
                                                    href={`/admin/orders/slug?id=${order._id}`}
                                                    className='block px-4 py-4'>
                                                    <p className='font-black text-[#2f2a25] dark:text-white'>
                                                        {order.guestName}
                                                    </p>
                                                </Link>
                                            </td>
                                            <td className='p-0'>
                                                <Link
                                                    href={`/admin/orders/slug?id=${order._id}`}
                                                    className='block px-4 py-4'>
                                                    <p className='mt-1 text-xs font-bold text-[#9d907e] dark:text-slate-500'>
                                                        {dayjs(order.createdAt).format('DD.MM.YYYY | HH:mm')}
                                                    </p>
                                                </Link>
                                            </td>
                                            <td className='p-0'>
                                                <Link
                                                    href={`/admin/orders/slug?id=${order._id}`}
                                                    className='block px-4 py-4 font-black whitespace-nowrap text-[#2f2a25] dark:text-white'>
                                                    <p className='mt-1 text-xs font-bold text-[#9d907e] dark:text-slate-500'>
                                                        {order.shippingAddress?.phone}
                                                    </p>
                                                </Link>
                                            </td>
                                            <td className='p-0'>
                                                <Link
                                                    href={`/admin/orders/slug?id=${order._id}`}
                                                    className='block px-4 py-4 font-black whitespace-nowrap text-[#2f2a25] dark:text-white'>
                                                    {order.totalAmount}
                                                </Link>
                                            </td>
                                            <td className='p-0'>
                                                <Link
                                                    href={`/admin/orders/slug?id=${order._id}`}
                                                    className='block px-4 py-4 text-sm font-bold text-[#6f6255] dark:text-slate-300'>
                                                    {order.paymentType}
                                                </Link>
                                            </td>
                                            <td className='p-0'>
                                                <Link
                                                    href={`/admin/orders/slug?id=${order._id}`}
                                                    className='block px-4 py-4'>
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${statusConfig.className}`}>
                                                        {statusConfig.label}
                                                    </span>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <PaginationFooter pagination={pagination} page={page} updatePage={updatePage} isFetching={isFetching} />
            </section>
        </div>
    );
};

export default AdminOrdersPage;
