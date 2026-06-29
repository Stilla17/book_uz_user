'use client';

import { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useOrderQuery } from '@/components/admin/hooks/queries/order';
import PaginationFooter from '@/components/admin/other/PaginationFooter';
import StatsCardsAdmin from '@/components/admin/other/StatsCardsAdmin';
import { BooksTableSkeleton } from '@/components/ui/skeleton';
import { orderStatusConfig } from '@/data';
import { sortAdminItems, useAdminSort } from '@/hooks/useAdminSort';
import { useUrlSearch } from '@/hooks/useUrlSearch';
import { FETCH_PAGINATION_LIMIT } from '@/tools';
import { OrderStatus } from '@/types/orders';
import { getPageFromUrl, updateUrlPage } from '@/utils/pagination';

import dayjs from 'dayjs';
import { Banknote, Clock3, Search, ShoppingBag } from 'lucide-react';

export type StatusFilter = 'ALL' | OrderStatus;
type OrderSortKey = 'customer' | 'date' | 'amount' | 'payment';

const confirmedPaymentStatuses = new Set(['PAID', 'CONFIRMED', 'SUCCESS', 'COMPLETED']);

const isConfirmedPayment = (paymentStatus?: string) => {
    return confirmedPaymentStatuses.has(String(paymentStatus || '').toUpperCase());
};

const AdminOrdersPage = () => {
    const [active, setActive] = useState<StatusFilter>('ALL');
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlPage = getPageFromUrl(searchParams.get('page'));
    const [page, setPage] = useState(urlPage);
    const { sortKey, sortOrder, handleSort, SortIcon } = useAdminSort<OrderSortKey>();
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
    const confirmedPaymentTotal = orders?.orders.reduce((sum, item) => {
        if (!isConfirmedPayment(item.paymentStatus)) return sum;

        return item.totalAmount + sum;
    }, 0);
    const formatterPrice = new Intl.NumberFormat('ru-RU').format(Number(confirmedPaymentTotal));

    const sortedOrders = useMemo(() => {
        return sortAdminItems({
            items: orders?.orders ?? [],
            sortKey,
            sortOrder,
            sortConfig: {
                customer: (order) => order.guestName || '',
                date: (order) => new Date(order.createdAt || 0).getTime(),
                amount: (order) => Number(order.totalAmount || 0),
                payment: (order) => order.paymentType || ''
            }
        });
    }, [orders?.orders, sortKey, sortOrder]);

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
            <StatsCardsAdmin stats={stats} isLoading={isLoading} />

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
                                <th className='px-4 py-3'>
                                    <button
                                        type='button'
                                        onClick={() => handleSort('customer')}
                                        className='inline-flex items-center gap-1 font-black uppercase'>
                                        Mijoz
                                        <SortIcon column='customer' />
                                    </button>
                                </th>
                                <th className='px-4 py-3'>
                                    <button
                                        type='button'
                                        onClick={() => handleSort('date')}
                                        className='inline-flex items-center gap-1 font-black uppercase'>
                                        Buyurtma vaqti
                                        <SortIcon column='date' />
                                    </button>
                                </th>
                                <th className='px-4 py-3'>Telefon raqam</th>
                                <th className='px-4 py-3'>
                                    <button
                                        type='button'
                                        onClick={() => handleSort('amount')}
                                        className='inline-flex items-center gap-1 font-black uppercase'>
                                        Summa
                                        <SortIcon column='amount' />
                                    </button>
                                </th>
                                <th className='px-4 py-3'>
                                    <button
                                        type='button'
                                        onClick={() => handleSort('payment')}
                                        className='inline-flex items-center gap-1 font-black uppercase'>
                                        To'lov
                                        <SortIcon column='payment' />
                                    </button>
                                </th>
                                <th className='px-4 py-3'>Holat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <BooksTableSkeleton />
                            ) : (
                                sortedOrders.map((order, index) => {
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
