'use client';

import { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useDeleteAuthor } from '@/components/admin/hooks/authorsHooks/useDeleteAuthor';
import { useAuthorListQuery } from '@/components/admin/hooks/queries/author';
import PaginationFooter from '@/components/admin/other/PaginationFooter';
import StatsCardsAdmin from '@/components/admin/other/StatsCardsAdmin';
import HeadSection from '@/components/admin/sections/HeadSection';
import { Button } from '@/components/ui/button';
import { PublishersSkeleton } from '@/components/ui/skeleton';
import { sortAdminItems, useAdminSort } from '@/hooks/useAdminSort';
import { useUrlSearch } from '@/hooks/useUrlSearch';
import { FETCH_PAGINATION_LIMIT } from '@/tools';
import { getImageUrl } from '@/utils/image';
import { getPageFromUrl, updateUrlPage } from '@/utils/pagination';

import { BookOpen, Edit3, Search, Trash2, User, Users } from 'lucide-react';

type AuthorSortKey = 'title' | 'bookCount';

const AdminAuthorsPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlPage = getPageFromUrl(searchParams.get('page'));
    const [page, setPage] = useState(urlPage);
    const { sortKey, sortOrder, handleSort, SortIcon } = useAdminSort<AuthorSortKey>();
    const { searchInput, setSearchInput, debouncedSearch } = useUrlSearch();
    const { data, isFetching, isLoading } = useAuthorListQuery(page, FETCH_PAGINATION_LIMIT, debouncedSearch);
    const { mutate } = useDeleteAuthor();

    useEffect(() => {
        setPage(urlPage);
    }, [urlPage]);

    const authors = data?.authors ?? [];
    const pagination = data?.pagination;
    const getAuthorBookCount = (author: { books?: unknown[] }) => Number(author.books?.length || 0);

    const sortedAuthors = useMemo(() => {
        return sortAdminItems({
            items: authors,
            sortKey,
            sortOrder,
            sortConfig: {
                title: (author) => author.name || '',
                bookCount: getAuthorBookCount
            }
        });
    }, [authors, sortKey, sortOrder]);

    const totalAuthorBooks = authors.reduce((sum, auth) => {
        return sum + getAuthorBookCount(auth);
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
            <HeadSection
                title='Mualliflar'
                text='Muallif profillari, biografiya, reyting va ularga tegishli kitoblarni boshqarish.'
                href='authors'
            />

            <StatsCardsAdmin stats={stats} isLoading={isLoading} />

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
                    <div className='flex flex-wrap items-center gap-2'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => handleSort('title')}
                            className='h-10 rounded-2xl border-[#eadfce] bg-white text-xs font-black dark:border-slate-800 dark:bg-slate-900'>
                            Muallif
                            <SortIcon column='title' />
                        </Button>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => handleSort('bookCount')}
                            className='h-10 rounded-2xl border-[#eadfce] bg-white text-xs font-black dark:border-slate-800 dark:bg-slate-900'>
                            Kitoblar
                            <SortIcon column='bookCount' />
                        </Button>
                        <span className='text-sm font-bold text-[#8b7e70] dark:text-slate-400'>
                            {authors.length} ta muallif ko'rsatildi
                        </span>
                    </div>
                </div>

                <div className='grid gap-3 p-4'>
                    {isLoading ? (
                        <PublishersSkeleton />
                    ) : (
                        sortedAuthors.map((author, index) => (
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
                                        {getAuthorBookCount(author)}
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

                    <PaginationFooter
                        pagination={data?.pagination}
                        page={page}
                        updatePage={updatePage}
                        isFetching={isFetching}
                    />
                </div>
            </section>
        </div>
    );
};

export default AdminAuthorsPage;
