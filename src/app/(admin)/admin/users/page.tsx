'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAdminUsersQuery } from '@/components/admin/hooks/queries/users';
import PaginationFooter from '@/components/admin/other/PaginationFooter';
import StatsCardsAdmin from '@/components/admin/other/StatsCardsAdmin';
import HeadSection from '@/components/admin/sections/HeadSection';
import { BooksTableSkeleton } from '@/components/ui/skeleton';
import { useAdminSort } from '@/hooks/useAdminSort';
import { useUrlSearch } from '@/hooks/useUrlSearch';
import { api } from '@/services/api';
import { FETCH_PAGINATION_LIMIT } from '@/tools';
import type { AdminUserListItem } from '@/types/admin-users';
import { getPageFromUrl, updateUrlPage } from '@/utils/pagination';

import dayjs from 'dayjs';
import { ContactRound, Edit3, Mail, Search, Table2, UserCheck, Users } from 'lucide-react';

type UserSortKey = 'name' | 'phone' | 'source' | 'orders' | 'registeredAt' | 'birthDate';

const formatDate = (value?: string) => {
    if (!value) return '-';

    const date = dayjs(value);

    return date.isValid() ? date.format('DD.MM.YYYY') : '-';
};

const UserRow = ({ user, index }: { user: AdminUserListItem; index: number }) => (
    <tr className='border-b border-[#f0e4d3] bg-white transition last:border-0 hover:bg-[#fffaf2] dark:border-slate-900 dark:bg-slate-950 dark:hover:bg-slate-900'>
        <td className='px-4 py-4'>
            <div className='min-w-0'>
                <Link
                    href={`/admin/users/${user.id}`}
                    className='font-black whitespace-nowrap text-[#2f2a25] transition hover:text-[#ef7f1a] dark:text-white dark:hover:text-orange-400'>
                    {index + 1}. {user.name}
                </Link>
                <p className='mt-1 flex items-center gap-1.5 text-xs font-bold text-[#9d907e] dark:text-slate-500'>
                    <Mail size={13} />
                    {user.telegramUsername || 'Email kiritilmagan'}
                </p>
            </div>
        </td>
        <td className='px-4 py-4'>
            {user.phones.length ? (
                <div className='flex flex-col gap-1'>
                    {user.phones.map((phone) => (
                        <a
                            key={phone}
                            href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                            className='text-sm font-bold whitespace-nowrap text-[#6f6255] hover:text-[#ef7f1a] dark:text-slate-300 dark:hover:text-orange-400'>
                            {phone}
                        </a>
                    ))}
                </div>
            ) : (
                <span className='text-sm font-bold text-[#8b7e70] dark:text-slate-400'>-</span>
            )}
        </td>
        <td className='px-4 py-4'>
            <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${
                    user.source === 'AMO_CRM'
                        ? 'bg-blue-50 text-[#285c7f] ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20'
                        : 'bg-orange-50 text-[#d7690d] ring-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/20'
                }`}>
                {user.source === 'AMO_CRM' ? 'amoCRM' : 'Book.uz'}
            </span>
        </td>
        <td className='px-4 py-4 font-black text-[#2f2a25] dark:text-white'>{user.salesCount}</td>
        <td className='px-4 py-4 text-sm font-bold whitespace-nowrap text-[#8b7e70] dark:text-slate-400'>
            {formatDate(user.createdAt)}
        </td>
        <td className='px-4 py-4 text-sm font-bold whitespace-nowrap text-[#8b7e70] dark:text-slate-400'>
            {formatDate(user.birthDate)}
        </td>
        <td>
            <button className='grid size-9 place-items-center rounded-xl text-[#817466] transition hover:bg-[#f2e7d8] hover:text-[#ef7f1a] dark:text-slate-300 dark:hover:bg-slate-950'>
                <Link href={`/admin/users/new?id=${user.id}`}>
                    {user.source !== 'AMO_CRM' ? <Edit3 size={17} /> : ''}
                </Link>
            </button>
        </td>
    </tr>
);

const AdminUsersPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlPage = getPageFromUrl(searchParams.get('page'));
    const [page, setPage] = useState(urlPage);
    const { sortKey, sortOrder, handleSort, SortIcon } = useAdminSort<UserSortKey>();
    const { searchInput, setSearchInput, debouncedSearch } = useUrlSearch();
    const { data, isFetching, isLoading, isError } = useAdminUsersQuery(
        page,
        FETCH_PAGINATION_LIMIT,
        debouncedSearch,
        sortKey,
        sortOrder
    );

    useEffect(() => {
        setPage(urlPage);
    }, [urlPage]);

    const users = data?.users ?? [];
    const amoContacts = data?.amoContacts ?? [];
    const items = data?.items ?? [];
    const pagination = data?.pagination;
    const totals = data?.totals;

    const stats = [
        {
            label: 'Jami foydalanuvchilar',
            value: totals?.all ?? pagination?.total ?? items.length,
            icon: Users,
            color: 'bg-[#ef7f1a]'
        },
        { label: 'Book.uz userlar', value: totals?.users ?? users.length, icon: UserCheck, color: 'bg-emerald-600' },
        {
            label: 'amoCRM kontaktlar',
            value: totals?.amoContacts ?? amoContacts.length,
            icon: ContactRound,
            color: 'bg-[#285c7f]'
        }
    ];

    const updatePage = (nextPage: number) => {
        updateUrlPage({
            nextPage,
            totalPages: pagination?.pages ?? 1,
            searchParams,
            replace: router.replace,
            setPage
        });
    };

    const downloadExelFile = async () => {
        const response = await api.get('/admin/users/export-excel', {
            responseType: 'blob'
        });

        const blob = await response.data;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = 'mijozlar.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className='space-y-5'>
            <HeadSection
                title='Foydalanuvchilar'
                text="Book.uz foydalanuvchilari va amoCRM kontaktlarini bitta joyda ko'rish."
                href='users'
            />

            <StatsCardsAdmin stats={stats} isLoading={isLoading} />

            <section className='overflow-hidden rounded-[24px] bg-[#fffaf2] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                <div className='flex flex-col gap-3 border-b border-[#eadfce] p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800'>
                    <label className='flex h-11 min-w-0 items-center gap-2 rounded-2xl bg-[#f2e7d8] px-4 text-[#817466] sm:max-w-sm sm:flex-1 dark:bg-slate-900 dark:text-slate-300'>
                        <Search size={18} className='shrink-0' />
                        <input
                            type='search'
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder="Ism, email, telefon yoki tug'ilgan sana"
                            className='h-full min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#9d907e] dark:placeholder:text-slate-500'
                        />
                    </label>
                    <div className='flex items-center gap-6'>
                        <p className='text-sm font-bold text-[#8b7e70] dark:text-slate-400'>
                            {pagination?.total ?? items.length} ta natija
                        </p>
                        <button className='text-green-400' onClick={downloadExelFile}>
                            <Table2 />
                        </button>
                    </div>
                </div>

                <div className='overflow-x-auto'>
                    <table className='w-full min-w-[1120px] text-left'>
                        <thead>
                            <tr className='border-b border-[#eadfce] text-xs font-black text-[#9d907e] uppercase dark:border-slate-800 dark:text-slate-500'>
                                <th className='px-4 py-3'>
                                    <button
                                        type='button'
                                        onClick={() => handleSort('name')}
                                        className='inline-flex items-center gap-1 font-black uppercase'>
                                        Foydalanuvchi
                                        <SortIcon column='name' />
                                    </button>
                                </th>
                                <th className='px-4 py-3'>
                                    <button
                                        type='button'
                                        onClick={() => handleSort('phone')}
                                        className='inline-flex items-center gap-1 font-black uppercase'>
                                        Telefon
                                        <SortIcon column='phone' />
                                    </button>
                                </th>
                                <th className='px-4 py-3'>
                                    <button
                                        type='button'
                                        onClick={() => handleSort('source')}
                                        className='inline-flex items-center gap-1 font-black uppercase'>
                                        Manba
                                        <SortIcon column='source' />
                                    </button>
                                </th>
                                <th className='px-4 py-3'>
                                    <button
                                        type='button'
                                        onClick={() => handleSort('orders')}
                                        className='inline-flex items-center gap-1 font-black uppercase'>
                                        Buyurtmalar
                                        <SortIcon column='orders' />
                                    </button>
                                </th>
                                <th className='px-4 py-3'>
                                    <button
                                        type='button'
                                        onClick={() => handleSort('registeredAt')}
                                        className='inline-flex items-center gap-1 font-black uppercase'>
                                        Ro'yxatdan o'tgan
                                        <SortIcon column='registeredAt' />
                                    </button>
                                </th>
                                <th className='px-4 py-3'>
                                    <button
                                        type='button'
                                        onClick={() => handleSort('birthDate')}
                                        className='inline-flex items-center gap-1 font-black uppercase'>
                                        Tug'ilgan sana
                                        <SortIcon column='birthDate' />
                                    </button>
                                </th>
                                <th>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <BooksTableSkeleton />
                            ) : isError ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className='bg-white px-4 py-12 text-center text-sm font-bold text-red-500 dark:bg-slate-950'>
                                        Foydalanuvchilarni yuklab bo'lmadi.
                                    </td>
                                </tr>
                            ) : items.length ? (
                                items.map((user, index) => (
                                    <UserRow key={`${user.source}-${user.id}`} user={user} index={index} />
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className='bg-white px-4 py-12 text-center text-sm font-bold text-[#8b7e70] dark:bg-slate-950 dark:text-slate-400'>
                                        Foydalanuvchi topilmadi.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <PaginationFooter pagination={pagination} page={page} updatePage={updatePage} isFetching={isFetching} />
            </section>
        </div>
    );
};

export default AdminUsersPage;
