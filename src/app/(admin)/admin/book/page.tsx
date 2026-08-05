'use client';

import { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useDeleteBook } from '@/components/admin/hooks/bookHooks/useDeleteBook';
import { useBookListQuery } from '@/components/admin/hooks/queries/book';
import PaginationFooter from '@/components/admin/other/PaginationFooter';
import StatsCardsAdmin from '@/components/admin/other/StatsCardsAdmin';
import HeadSection from '@/components/admin/sections/HeadSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BooksTableSkeleton } from '@/components/ui/skeleton';
import { StockFilter, getBookBarcodes, getStockStatus } from '@/helpers/admin/newBook';
import { sortAdminItems, useAdminSort } from '@/hooks/useAdminSort';
import { useUrlSearch } from '@/hooks/useUrlSearch';
import { FETCH_PAGINATION_LIMIT } from '@/tools';
import { getAuthor, getLocalizedText } from '@/utils/book-formatters';
import { formatPrice } from '@/utils/currency';
import { getBookImageUrl } from '@/utils/image';
import { getPageFromUrl, updateUrlPage } from '@/utils/pagination';

import { BookOpen, Eye, ImageIcon, Pencil, Search, Star, Trash2 } from 'lucide-react';

type SortKey = 'price' | 'title';

const AdminBookPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlPage = getPageFromUrl(searchParams.get('page'));
    const [page, setPage] = useState(urlPage);
    const [stockFilter, setStockFilter] = useState<StockFilter>('all');
    const { sortKey, sortOrder, handleSort: setAdminSort, SortIcon } = useAdminSort<SortKey>();
    const { searchInput, setSearchInput, debouncedSearch } = useUrlSearch();
    const { data, isFetching, isLoading } = useBookListQuery(
        page,
        FETCH_PAGINATION_LIMIT,
        debouncedSearch,
        sortKey === 'default' ? undefined : sortKey,
        sortKey === 'default' ? undefined : sortOrder
    );

    const { mutate } = useDeleteBook();

    const books = data?.products ?? [];

    const sortedBooks = useMemo(() => {
        return sortAdminItems({
            items: books,
            sortKey,
            sortOrder,
            sortConfig: {
                price: (book) => Number(book.price || 0),
                title: (book) => getLocalizedText(book.title)
            }
        });
    }, [books, sortKey, sortOrder]);

    const filteredBooks = sortedBooks.filter((book) => {
        const stock = Number(book.stock || 0);

        if (stockFilter === 'out') return stock <= 0;
        if (stockFilter === 'low') return stock > 0 && stock < 10;
        if (stockFilter === 'available') return stock >= 10;

        return true;
    });
    const pageSize = FETCH_PAGINATION_LIMIT;
    const paginatedBooks = filteredBooks;
    const displayPagination =
        stockFilter === 'all'
            ? (data?.pagination ?? {
                  page,
                  limit: pageSize,
                  total: filteredBooks.length,
                  pages: Math.max(1, Math.ceil(filteredBooks.length / pageSize))
              })
            : {
                  page,
                  limit: pageSize,
                  total: filteredBooks.length,
                  pages: Math.max(1, Math.ceil(filteredBooks.length / pageSize))
              };

    useEffect(() => {
        setPage(urlPage);
    }, [urlPage]);

    const stockCounts = useMemo(
        () =>
            books.reduce(
                (counts, book) => {
                    const stock = Number(book.stock || 0);
                    stock <= 0 ? (counts.out += 1) : stock < 10 ? (counts.low += 1) : (counts.available += 1);
                    return counts;
                },
                {
                    low: 0,
                    available: 0,
                    out: 0
                }
            ),
        [books]
    );
    const stats = [
        {
            label: 'Jami kitoblar',
            value: data?.pagination?.total ?? 0,
            icon: BookOpen,
            color: 'bg-[#ef7f1a]'
        },
        {
            label: 'Active kitoblar',
            value: data?.products?.filter((book) => book.isActive).length ?? 0,
            icon: BookOpen,
            color: 'bg-[#ef7f1a]'
        }
    ];

    const updatePage = (nextPage: number) => {
        updateUrlPage({
            nextPage,
            totalPages: displayPagination.pages,
            searchParams,
            replace: router.replace,
            setPage
        });
    };

    const stockFilterButtons: Array<{
        value: StockFilter;
        label: string;
        count: number;
        className: string;
        activeClassName: string;
    }> = [
        {
            value: 'low',
            label: 'Kam',
            count: stockCounts.low,
            className:
                'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300',
            activeClassName: 'ring-2 ring-amber-400'
        },
        {
            value: 'available',
            label: 'Mavjud',
            count: stockCounts.available,
            className:
                'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300',
            activeClassName: 'ring-2 ring-emerald-400'
        },
        {
            value: 'out',
            label: 'Tugagan',
            count: stockCounts.out,
            className:
                'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300',
            activeClassName: 'ring-2 ring-red-400'
        }
    ];

    const handleSort = (key: SortKey) => {
        setAdminSort(key);

        updateUrlPage({
            nextPage: 1,
            totalPages: displayPagination.pages,
            searchParams,
            replace: router.replace,
            setPage
        });
    };

    return (
        <div className='space-y-5'>
            <HeadSection
                title='Kitoblar'
                text="Barcha kitoblar, narxlar va mavjudlik holatini boshqarish uchun umumiy ro'yxat."
                href='book'
            />

            <StatsCardsAdmin stats={stats} isLoading={isLoading} />

            <section className='rounded-[24px] bg-[#fffaf2] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                <div className='flex flex-col gap-3 border-b border-[#eadfce] p-4 md:flex-row md:items-center md:justify-between dark:border-slate-800'>
                    <div className='flex min-w-0 flex-col gap-3 md:flex-1 md:flex-row md:items-center'>
                        <label className='flex h-11 min-w-0 items-center gap-2 rounded-2xl bg-[#f2e7d8] px-4 text-[#817466] md:max-w-sm md:flex-1 dark:bg-slate-900 dark:text-slate-300'>
                            <Search size={18} className='shrink-0' />
                            <Input
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                                placeholder='Kitob nomi, muallif yoki ISBN'
                                className='h-full border-0 bg-transparent p-0 text-sm font-semibold shadow-none'
                            />
                        </label>

                        <div className='flex flex-wrap gap-2'>
                            {stockFilterButtons.map((filter) => (
                                <Button
                                    key={filter.value}
                                    type='button'
                                    variant='outline'
                                    onClick={() =>
                                        setStockFilter((current) => (current === filter.value ? 'all' : filter.value))
                                    }
                                    className={`h-10 rounded-2xl px-4 text-xs font-black ${filter.className} ${
                                        stockFilter === filter.value ? filter.activeClassName : ''
                                    }`}>
                                    {filter.label}
                                    <span className='ml-2 rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-black dark:bg-slate-950/50'>
                                        {filter.count}
                                    </span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className='text-sm font-bold text-[#8b7e70] dark:text-slate-400'>
                        {filteredBooks.length} ta natija ko'rsatildi
                    </div>
                </div>

                <div className='hidden overflow-x-auto lg:block'>
                    <table className='w-full min-w-245 text-left'>
                        <thead>
                            <tr className='border-b border-[#eadfce] text-xs font-black text-[#9d907e] uppercase dark:border-slate-800 dark:text-slate-500'>
                                <th className='px-4 py-3'>
                                    <button
                                        type='button'
                                        onClick={() => handleSort('title')}
                                        className='inline-flex items-center gap-1 font-black uppercase'>
                                        Kitob
                                        <SortIcon column='title' />
                                    </button>
                                </th>
                                <th className='px-4 py-3'>
                                    <button
                                        type='button'
                                        onClick={() => handleSort('price')}
                                        className='inline-flex items-center gap-1 font-black uppercase'>
                                        Narx
                                        <SortIcon column='price' />
                                    </button>
                                </th>
                                <th className='px-4 py-3'>Zaxira</th>
                                <th className='px-4 py-3'>Reyting</th>
                                <th className='px-4 py-3 text-right'>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <BooksTableSkeleton />
                            ) : (
                                paginatedBooks.map((book, index) => {
                                    const status = getStockStatus(book.stock);
                                    const imageUrl = getBookImageUrl(book);
                                    const barcode = getBookBarcodes(book);
                                    return (
                                        <tr
                                            key={book._id}
                                            className='border-b border-[#f0e4d3] last:border-0 dark:border-slate-900'>
                                            <td className='px-4 py-4'>
                                                <div className='flex min-w-0 items-center gap-3'>
                                                    <div className='grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#f2e7d8] dark:bg-slate-900'>
                                                        {imageUrl ? (
                                                            <img
                                                                src={imageUrl}
                                                                alt={getLocalizedText(book.title)}
                                                                className='h-full w-full object-cover'
                                                            />
                                                        ) : (
                                                            <ImageIcon size={20} className='text-[#9d907e]' />
                                                        )}
                                                    </div>
                                                    <div className='min-w-0'>
                                                        <p className='truncate font-black text-[#2f2a25] dark:text-white'>
                                                            {index + 1}. {getLocalizedText(book.title)}
                                                        </p>
                                                        <p className='mt-1 truncate text-sm font-semibold text-[#9d907e] dark:text-slate-400'>
                                                            {getAuthor(book.authorName || book.author)}
                                                        </p>
                                                        {barcode ? (
                                                            <p className='mt-1 truncate text-xs font-bold text-[#b0a391] dark:text-slate-500'>
                                                                ISBN / Barcode: {barcode}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className='px-4 py-4'>
                                                <p className='font-black text-[#2f2a25] dark:text-white'>
                                                    {formatPrice(book.price)}
                                                </p>
                                                {book.oldPrice ? (
                                                    <p className='text-xs font-bold text-[#9d907e] line-through dark:text-slate-500'>
                                                        {formatPrice(book.oldPrice)}
                                                    </p>
                                                ) : null}
                                            </td>
                                            <td className='px-4 py-4'>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black text-nowrap ring-1 ${status.className}`}>
                                                    {status.label} {book.stock} dona
                                                </span>
                                            </td>
                                            <td className='px-4 py-4'>
                                                <span className='inline-flex items-center gap-1 rounded-full bg-[#f2e7d8] px-3 py-1 text-sm font-black text-[#6f6255] dark:bg-slate-900 dark:text-slate-300'>
                                                    {Number(book.ratingAvg).toFixed(1)}
                                                    <Star size={14} className='fill-yellow-400 text-yellow-400' />
                                                </span>
                                            </td>
                                            <td className='px-4 py-4'>
                                                <div className='flex justify-end gap-2'>
                                                    <Button size='icon-sm' variant='ghost' className='rounded-xl'>
                                                        <Link href={`/admin/book/${book.slug || book._id}`}>
                                                            <Eye size={17} />
                                                        </Link>
                                                    </Button>
                                                    <Button size='icon-sm' variant='ghost' className='rounded-xl'>
                                                        <Link href={`/admin/book/new?id=${book._id}`}>
                                                            <Pencil size={17} />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size='icon-sm'
                                                        variant='ghost'
                                                        onClick={() => mutate(book._id)}
                                                        className='rounded-xl text-red-500 hover:text-red-600'>
                                                        <Trash2 size={17} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <PaginationFooter
                    pagination={displayPagination}
                    page={page}
                    updatePage={updatePage}
                    isFetching={isFetching}
                />
            </section>
        </div>
    );
};

export default AdminBookPage;
