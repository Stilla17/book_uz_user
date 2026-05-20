'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useDeleteAuthor } from '@/components/admin/hooks/authorsHooks/useDeleteAuthor';
import { useAuthorListQuery } from '@/components/admin/hooks/queries/author';
import { Button } from '@/components/ui/button';
import { PublishersSkeleton } from '@/components/ui/skeleton';
import { useUrlSearch } from '@/hooks/useUrlSearch';
import { getImageUrl } from '@/utils/image';
import { getPageFromUrl, updateUrlPage } from '@/utils/pagination';

import { ArrowLeft, ArrowRight, BookOpen, Edit3, Plus, Search, Trash2, User, Users } from 'lucide-react';

const ADMIN_AUTHORS_LIMIT = 100;

const AdminAuthorsPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlPage = getPageFromUrl(searchParams.get('page'));
    const [page, setPage] = useState(urlPage);
    const { searchInput, setSearchInput, debouncedSearch } = useUrlSearch();
    const { data, isFetching, isLoading } = useAuthorListQuery(page, ADMIN_AUTHORS_LIMIT, debouncedSearch);
    const { mutate } = useDeleteAuthor();

    useEffect(() => {
        setPage(urlPage);
    }, [urlPage]);

    const authors = data?.authors ?? [];
    const pagination = data?.pagination;
    const totalAuthorBooks = authors.reduce((sum, auth) => {
        return sum + Number(auth.books?.length || 0);
    }, 0);

    const stats = [
        { label: 'Jami mualliflar', value: pagination?.total, icon: Users, color: 'bg-[#ef7f1a]' },
        { label: 'Kitoblar', value: totalAuthorBooks, icon: BookOpen, color: 'bg-[#285c7f]' }
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

    return (
        <div className='space-y-5'>
            <section className='flex flex-col gap-4 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] md:flex-row md:items-center md:justify-between md:p-5 dark:bg-slate-950 dark:ring-slate-800'>
                <div>
                    <h2 className='mt-1 text-2xl font-black text-[#2f2a25] dark:text-white'>Mualliflar</h2>
                    <p className='mt-2 max-w-2xl text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>
                        Muallif profillari, biografiya, reyting va ularga tegishli kitoblarni boshqarish.
                    </p>
                </div>

                <Button
                    asChild
                    className='h-11 rounded-2xl bg-[#ef7f1a] px-5 text-sm font-black text-white hover:bg-orange-600'>
                    <Link href='/admin/authors/new'>
                        <Plus size={18} />
                        Yangi muallif
                    </Link>
                </Button>
            </section>

            <section className='grid gap-4 xl:grid-cols-2'>
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <div
                        key={label}
                        className='rounded-[22px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <span className={`grid size-11 place-items-center rounded-2xl ${color} text-white`}>
                            <Icon size={20} />
                        </span>
                        <p className='mt-4 text-2xl font-black text-[#2f2a25] dark:text-white'>{value || 0}</p>
                        <p className='text-sm font-bold text-[#9d907e] dark:text-slate-400'>{label}</p>
                    </div>
                ))}
            </section>

            <section className='rounded-[24px] bg-[#fffaf2] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                <div className='flex flex-col gap-3 border-b border-[#eadfce] p-4 md:flex-row md:items-center md:justify-between dark:border-slate-800'>
                    <label className='flex h-11 min-w-0 items-center gap-2 rounded-2xl bg-[#f2e7d8] px-4 text-[#817466] md:max-w-sm md:flex-1 dark:bg-slate-900 dark:text-slate-300'>
                        <Search size={18} />
                        <input
                            type='search'
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder='Muallif nomi, davlat yoki slug'
                            className='h-full min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#9d907e] dark:placeholder:text-slate-500'
                        />
                    </label>
                    <span className='text-sm font-bold text-[#8b7e70] dark:text-slate-400'>
                        {authors.length} ta muallif ko'rsatildi
                    </span>
                </div>

                <div className='grid gap-3 p-4'>
                    {isLoading ? (
                        <PublishersSkeleton />
                    ) : (
                        authors.map((author, index) => (
                            <article
                                key={author._id}
                                className='grid gap-4 rounded-4xl bg-white p-4 ring-1 ring-[#eadfce] md:grid-cols-[minmax(0,1fr)_120px_110px] md:items-center dark:bg-slate-900 dark:ring-slate-800'>
                                <div className='flex min-w-0 items-center gap-3'>
                                    {author.image === '' ? (
                                        <span className='grid size-13 shrink-0 place-items-center rounded-2xl bg-[#f2e7d8] text-[#ef7f1a] dark:bg-slate-950'>
                                            <User size={22} />
                                        </span>
                                    ) : (
                                        <img
                                            src={getImageUrl(author.image)}
                                            alt={author.name}
                                            className='size-13 rounded-full object-cover'
                                        />
                                    )}

                                    <div className='min-w-0'>
                                        <h3 className='truncate font-black text-[#2f2a25] dark:text-white'>
                                            {index + 1}. {author.name}
                                        </h3>
                                    </div>
                                </div>

                                <div>
                                    <p className='text-xs font-black text-[#9d907e] uppercase dark:text-slate-500'>
                                        Kitoblar
                                    </p>
                                    <p className='mt-1 font-black text-[#2f2a25] dark:text-white'>
                                        {author.books?.length}
                                    </p>
                                </div>

                                <div className='flex items-center justify-end gap-2'>
                                    <button className='grid size-9 place-items-center rounded-xl text-[#817466] transition hover:bg-[#f2e7d8] hover:text-[#ef7f1a] dark:text-slate-300 dark:hover:bg-slate-950'>
                                        <Link href={`/admin/authors/new?id=${author._id}`}>
                                            <Edit3 size={17} />
                                        </Link>
                                    </button>
                                    <button
                                        onClick={() => mutate(author._id)}
                                        className='grid size-9 place-items-center rounded-xl text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10'>
                                        <Trash2 size={17} />
                                    </button>
                                </div>
                            </article>
                        ))
                    )}

                    <div className='flex flex-col gap-3 border-t border-[#eadfce] p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800'>
                        <p className='text-sm font-bold text-[#8b7e70] dark:text-slate-400'>
                            Sahifa {pagination?.page} / {pagination?.pages}
                        </p>
                        <div className='flex gap-2'>
                            <Button
                                variant='outline'
                                disabled={page <= 1 || isFetching}
                                onClick={() => updatePage(page - 1)}
                                className='h-10 rounded-2xl border-[#eadfce] bg-white font-black dark:border-slate-800 dark:bg-slate-900'>
                                <ArrowLeft size={17} />
                                Oldingi
                            </Button>
                            <Button
                                variant='outline'
                                disabled={page >= (pagination?.pages ?? 1) || isFetching}
                                onClick={() => updatePage(page + 1)}
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

export default AdminAuthorsPage;
