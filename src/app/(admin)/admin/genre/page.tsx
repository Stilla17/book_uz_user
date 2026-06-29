'use client';

import { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useDeleteGenre } from '@/components/admin/hooks/genreHooks/useDeleteGenre';
import { useGenreListQuery } from '@/components/admin/hooks/queries/genre';
import PaginationFooter from '@/components/admin/other/PaginationFooter';
import StatsCardsAdmin from '@/components/admin/other/StatsCardsAdmin';
import HeadSection from '@/components/admin/sections/HeadSection';
import { BooksTableSkeleton } from '@/components/ui/skeleton';
import { sortAdminItems, useAdminSort } from '@/hooks/useAdminSort';
import { useUrlSearch } from '@/hooks/useUrlSearch';
import { FETCH_PAGINATION_LIMIT } from '@/tools';
import { getPageFromUrl, updateUrlPage } from '@/utils/pagination';

import { BookOpen, Edit3, FolderTree, Search, Tags, Trash2 } from 'lucide-react';

type SortKey = 'title' | 'bookCount';

type Genre = {
    bookCount?: number;
    subgenres: {
        books?: unknown[];
    }[];
};

const AdminGenrePage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlPage = getPageFromUrl(searchParams.get('page'));
    const [page, setPage] = useState(urlPage);
    const { sortKey, sortOrder, handleSort, SortIcon } = useAdminSort<SortKey>();
    const { searchInput, setSearchInput, debouncedSearch } = useUrlSearch();
    const { data, isFetching, isLoading } = useGenreListQuery(page, FETCH_PAGINATION_LIMIT, debouncedSearch);
    const { mutate } = useDeleteGenre();

    useEffect(() => {
        setPage(urlPage);
    }, [urlPage]);

    const genres = data?.categories ?? [];
    const pagination = data?.pagination;
    const subgenres = genres.reduce((sum, item) => item.subgenres.length + sum, 0);
    const genreBookCount = genres.reduce((sum, item) => (item.bookCount ?? 0) + sum, 0);

    const stats = [
        { label: 'Jami janrlar', value: pagination?.total ?? genres.length, icon: Tags, color: 'bg-[#ef7f1a]' },
        { label: 'Subjanrlar', value: subgenres, icon: FolderTree, color: 'bg-[#285c7f]' },
        { label: 'Kitoblar', value: genreBookCount, icon: BookOpen, color: 'bg-[#7c6dc8]' }
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

    const getGenreBookCount = (genre: Genre) =>
        genre.bookCount ?? genre.subgenres.reduce((sum, sg) => sum + (sg.books?.length || 0), 0);

    const sortedGenres = useMemo(() => {
        return sortAdminItems({
            items: genres,
            sortKey,
            sortOrder,
            sortConfig: {
                title: (genre) => genre.title?.uz || '',
                bookCount: getGenreBookCount
            }
        });
    }, [genres, sortKey, sortOrder]);

    return (
        <div className='space-y-5'>
            <HeadSection
                title='Janrlar'
                text="Kitoblarni katalog bo'yicha tartiblash uchun janr va subjanrlar boshqaruvi."
                href='genre'
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
                            placeholder='Janr nomi yoki kichik janr qidirish'
                            className='h-full min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#9d907e] dark:placeholder:text-slate-500'
                        />
                    </label>
                    <span className='text-sm font-bold text-[#8b7e70] dark:text-slate-400'>
                        {genres.length} ta janr ko'rsatildi
                    </span>
                </div>

                <div className='overflow-x-auto'>
                    <table className='w-full min-w-180 text-left'>
                        <thead>
                            <tr className='border-b border-[#eadfce] text-xs font-black text-[#9d907e] uppercase dark:border-slate-800 dark:text-slate-500'>
                                <th className='px-4 py-3'>
                                    <button
                                        type='button'
                                        onClick={() => handleSort('title')}
                                        className='inline-flex items-center gap-1 font-black uppercase'>
                                        Janr
                                        <SortIcon column='title' />
                                    </button>
                                </th>
                                <th className='px-4 py-3'>
                                    <button
                                        type='button'
                                        onClick={() => handleSort('bookCount')}
                                        className='inline-flex items-center gap-1 font-black uppercase'>
                                        Kitoblar
                                        <SortIcon column='bookCount' />
                                    </button>
                                </th>
                                <th className='px-4 py-3 text-right'>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <BooksTableSkeleton />
                            ) : (
                                sortedGenres.map((genre, index) => (
                                    <tr
                                        key={genre.slug}
                                        className='border-b border-[#f0e4d3] last:border-0 dark:border-slate-900'>
                                        <td className='px-4 py-4'>
                                            <div className='flex items-center gap-3'>
                                                <span
                                                    className={`grid size-11 place-items-center rounded-2xl bg-[#285c7f] text-white`}>
                                                    <Tags size={18} />
                                                </span>
                                                <span className='font-black text-[#2f2a25] dark:text-white'>
                                                    {index + 1}. {genre.title.uz}
                                                </span>
                                            </div>
                                        </td>
                                        <td className='px-4 py-4 font-black text-[#2f2a25] dark:text-white'>
                                            {getGenreBookCount(genre)}
                                        </td>

                                        <td className='px-4 py-4'>
                                            <div className='flex justify-end gap-2'>
                                                <button className='grid size-9 place-items-center rounded-xl text-[#817466] transition hover:bg-[#f2e7d8] hover:text-[#ef7f1a] dark:text-slate-300 dark:hover:bg-slate-900'>
                                                    <Link href={`/admin/genre/new?id=${genre._id}`}>
                                                        <Edit3 size={17} />
                                                    </Link>
                                                </button>
                                                <button
                                                    onClick={() => mutate(genre._id)}
                                                    className='grid size-9 place-items-center rounded-xl text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10'>
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <PaginationFooter
                    pagination={data?.pagination}
                    page={page}
                    updatePage={updatePage}
                    isFetching={isFetching}
                />
            </section>
        </div>
    );
};

export default AdminGenrePage;
