'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ClientService, PublishersResponse } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Building2,
    Edit3,
    Globe2,
    Plus,
    Search,
    Trash2,
    TrendingUp
} from 'lucide-react';

const FETCH_PUBLISHERS_LIMIT = 100;

const PublishersSkeleton = () => (
    <div className='grid gap-3 p-4'>
        {Array.from({ length: 6 }).map((_, index) => (
            <article
                key={index}
                className='grid gap-4 rounded-[20px] bg-white p-4 ring-1 ring-[#eadfce] md:grid-cols-[minmax(0,1fr)_130px_120px_auto] md:items-center dark:bg-slate-900 dark:ring-slate-800'>
                <div className='flex min-w-0 items-center gap-3'>
                    <div className='size-13 shrink-0 animate-pulse rounded-2xl bg-[#f2e7d8] dark:bg-slate-950' />
                    <div className='min-w-0 flex-1 space-y-2'>
                        <div className='h-4 w-44 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-950' />
                        <div className='h-3 w-28 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-950' />
                    </div>
                </div>

                <div className='space-y-2'>
                    <div className='h-3 w-16 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-950' />
                    <div className='h-4 w-10 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-950' />
                </div>

                <div className='space-y-2'>
                    <div className='h-3 w-14 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-950' />
                    <div className='h-4 w-20 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-950' />
                </div>

                <div className='flex justify-end gap-2'>
                    <div className='size-9 animate-pulse rounded-xl bg-[#f2e7d8] dark:bg-slate-950' />
                    <div className='size-9 animate-pulse rounded-xl bg-[#f2e7d8] dark:bg-slate-950' />
                </div>
            </article>
        ))}
    </div>
);

const AdminPublishersPage = () => {
    const [page, setPage] = useState(1);
    const { data, isFetching, isLoading } = useQuery<PublishersResponse>({
        queryKey: ['publishers', page, FETCH_PUBLISHERS_LIMIT],
        queryFn: () => ClientService.getPublishers({ page, limit: FETCH_PUBLISHERS_LIMIT }),
        placeholderData: (previousData) => previousData
    });

    const publishers = data?.publishers ?? [];
    const pagination = data?.pagination;
    const totalBooks = publishers.reduce((sum, publisher) => {
        return sum + Number(publisher.booksCount || 0);
    }, 0);

    const stats = [
        {
            label: 'Jami nashriyot',
            value: pagination?.total.toLocaleString('uz-UZ'),
            icon: Building2,
            color: 'bg-[#ef7f1a]'
        },
        { label: 'Kitoblar', value: totalBooks.toLocaleString('uz-UZ'), icon: BookOpen, color: 'bg-[#285c7f]' }
    ];

    return (
        <div className='space-y-5'>
            <section className='flex flex-col gap-4 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] md:flex-row md:items-center md:justify-between md:p-5 dark:bg-slate-950 dark:ring-slate-800'>
                <div>
                    <p className='text-xs font-black tracking-wide text-[#ef7f1a] uppercase'>Hamkor katalogi</p>
                    <h2 className='mt-1 text-2xl font-black text-[#2f2a25] dark:text-white'>Nashriyotlar</h2>
                    <p className='mt-2 max-w-2xl text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>
                        Nashriyot profillari, ularga tegishli kitoblar va katalogdagi ko'rinishlarini boshqarish.
                    </p>
                </div>

                <Button
                    asChild
                    className='h-11 rounded-2xl bg-[#ef7f1a] px-5 font-black text-white hover:bg-orange-600'>
                    <Link href='/admin/publishers/new'>
                        <Plus size={18} />
                        Yangi nashryot
                    </Link>
                </Button>
            </section>

            <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-2'>
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <div
                        key={label}
                        className='rounded-[22px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <span className={`grid size-11 place-items-center rounded-2xl ${color} text-white`}>
                            <Icon size={20} />
                        </span>
                        <p className='mt-4 text-2xl font-black text-[#2f2a25] dark:text-white'>{value}</p>
                        <p className='text-sm font-bold text-[#9d907e] dark:text-slate-400'>{label}</p>
                    </div>
                ))}
            </section>

            <section className='w-full'>
                <div className='rounded-[24px] bg-[#fffaf2] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                    <div className='flex flex-col gap-3 border-b border-[#eadfce] p-4 md:flex-row md:items-center md:justify-between dark:border-slate-800'>
                        <label className='flex h-11 min-w-0 items-center gap-2 rounded-2xl bg-[#f2e7d8] px-4 text-[#817466] md:max-w-sm md:flex-1 dark:bg-slate-900 dark:text-slate-300'>
                            <Search size={18} />
                            <input
                                type='search'
                                placeholder='Nashriyot nomi yoki davlat'
                                className='h-full min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#9d907e] dark:placeholder:text-slate-500'
                            />
                        </label>
                        <span className='text-sm font-bold text-[#8b7e70] dark:text-slate-400'>
                            {publishers.length} ta nashriyot ko'rsatildi
                        </span>
                    </div>

                    {isLoading ? (
                        <PublishersSkeleton />
                    ) : (
                        <div className='grid gap-3 p-4'>
                            {publishers.map((publisher) => (
                                <article
                                    key={publisher.slug}
                                    className='grid gap-4 rounded-[20px] bg-white p-4 ring-1 ring-[#eadfce] md:grid-cols-[minmax(0,1fr)_130px_120px_auto] md:items-center dark:bg-slate-900 dark:ring-slate-800'>
                                    <div className='flex min-w-0 items-center gap-3'>
                                        <span className='grid size-13 shrink-0 place-items-center rounded-2xl bg-[#f2e7d8] text-[#ef7f1a] dark:bg-slate-950'>
                                            <Building2 size={22} />
                                        </span>
                                        <div className='min-w-0'>
                                            <h3 className='truncate font-black text-[#2f2a25] dark:text-white'>
                                                {publisher.name}
                                            </h3>
                                            <p className='mt-1 truncate text-sm font-bold text-[#9d907e] dark:text-slate-400'>
                                                /{publisher.slug}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className='text-xs font-black text-[#9d907e] uppercase dark:text-slate-500'>
                                            Kitoblar
                                        </p>
                                        <p className='mt-1 font-black text-[#2f2a25] dark:text-white'>
                                            {publisher.booksCount}
                                        </p>
                                    </div>

                                    <div className='flex items-center justify-end gap-2'>
                                        <button className='grid size-9 place-items-center rounded-xl text-[#817466] transition hover:bg-[#f2e7d8] hover:text-[#ef7f1a] dark:text-slate-300 dark:hover:bg-slate-950'>
                                            <Edit3 size={17} />
                                        </button>
                                        <button className='grid size-9 place-items-center rounded-xl text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10'>
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    <div className='flex flex-col gap-3 border-t border-[#eadfce] p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800'>
                        <p className='text-sm font-bold text-[#8b7e70] dark:text-slate-400'>
                            Sahifa {pagination?.page} / {pagination?.totalPages}
                        </p>
                        <div className='flex gap-2'>
                            <Button
                                variant='outline'
                                disabled={page <= 1 || isFetching}
                                onClick={() => setPage((value) => Math.max(value - 1, 1))}
                                className='h-10 rounded-2xl border-[#eadfce] bg-white font-black dark:border-slate-800 dark:bg-slate-900'>
                                <ArrowLeft size={17} />
                                Oldingi
                            </Button>
                            <Button
                                variant='outline'
                                disabled={page >= (pagination?.totalPages ?? 1) || isFetching}
                                onClick={() => setPage((value) => Math.min(value + 1, pagination?.totalPages ?? 1))}
                                className='h-10 rounded-2xl border-[#eadfce] bg-white font-black dark:border-slate-800 dark:bg-slate-900'>
                                Keyingi
                                <ArrowRight size={17} />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminPublishersPage;
