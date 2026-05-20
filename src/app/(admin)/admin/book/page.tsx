'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useDeleteBook } from '@/components/admin/hooks/bookHooks/useDeleteBook';
import { useBookListQuery } from '@/components/admin/hooks/queries/book';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BooksTableSkeleton } from '@/components/ui/skeleton';
import { useUrlSearch } from '@/hooks/useUrlSearch';
import { getAuthor, getCategoryLabel, getLocalizedText } from '@/utils/book-formatters';
import { getLatestImageUrl } from '@/utils/image';
import { getPageFromUrl, updateUrlPage } from '@/utils/pagination';

import { ArrowLeft, ArrowRight, BookOpen, Eye, ImageIcon, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';

const formatPrice = (price?: number) => `${Number(price || 0).toLocaleString('uz-UZ')} so'm`;

const getBookBarcode = (book: {
    barcode?: string | number;
    isbn?: string | number;
    details?: { isbn?: string | number };
}) => book.barcode || book.isbn || book.details?.isbn || '';

const getBookPages = (book: { pages?: number; numberOfPage?: number; details?: { pages?: number } }) =>
    book.pages || book.numberOfPage || book.details?.pages;

const getBookWeight = (book: { weight?: string; details?: { weight?: string } }) => book.weight || book.details?.weight;

const getStockStatus = (stock?: number) => {
    if (!stock || stock <= 0) {
        return {
            label: 'Tugagan',
            className: 'bg-red-50 text-red-600 ring-red-100 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20'
        };
    }

    if (stock < 10) {
        return {
            label: 'Kam qolgan',
            className:
                'bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20'
        };
    }

    return {
        label: 'Mavjud',
        className:
            'bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20'
    };
};

const ADMIN_AUTHORS_LIMIT = 100;
type StockFilter = 'all' | 'low' | 'available' | 'out';

const AdminBookPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlPage = getPageFromUrl(searchParams.get('page'));
    const [page, setPage] = useState(urlPage);
    const [stockFilter, setStockFilter] = useState<StockFilter>('all');
    const { searchInput, setSearchInput, debouncedSearch } = useUrlSearch();
    const { data, isFetching, isLoading } = useBookListQuery(page, ADMIN_AUTHORS_LIMIT, debouncedSearch);
    const { mutate } = useDeleteBook();

    const books = data?.products ?? [];
    const filteredBooks = books.filter((book) => {
        const stock = Number(book.stock || 0);

        if (stockFilter === 'out') return stock <= 0;
        if (stockFilter === 'low') return stock > 0 && stock < 10;
        if (stockFilter === 'available') return stock >= 10;

        return true;
    });
    const pagination = data?.pagination;

    useEffect(() => {
        setPage(urlPage);
    }, [urlPage]);

    const stats = [
        {
            label: 'Jami kitoblar',
            value: data?.pagination.total,
            icon: BookOpen,
            color: 'bg-[#ef7f1a]'
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

    const stockFilterButtons: Array<{
        value: StockFilter;
        label: string;
        className: string;
        activeClassName: string;
    }> = [
        {
            value: 'low',
            label: 'Kam',
            className:
                'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300',
            activeClassName: 'ring-2 ring-amber-400'
        },
        {
            value: 'available',
            label: 'Mavjud',
            className:
                'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300',
            activeClassName: 'ring-2 ring-emerald-400'
        },
        {
            value: 'out',
            label: 'Tugagan',
            className:
                'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300',
            activeClassName: 'ring-2 ring-red-400'
        }
    ];

    return (
        <div className='space-y-5'>
            <section className='flex flex-col gap-4 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] md:flex-row md:items-center md:justify-between md:p-5 dark:bg-slate-950 dark:ring-slate-800'>
                <div>
                    <h2 className='mt-1 text-2xl font-black text-[#2f2a25] dark:text-white'>Barcha kitoblar</h2>
                    <p className='mt-2 max-w-2xl text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>
                        Ombordagi kitoblar, narxlar va mavjudlik holatini boshqarish uchun umumiy ro'yxat.
                    </p>
                </div>

                <Button
                    asChild
                    className='h-11 rounded-2xl bg-[#ef7f1a] px-5 font-black text-white hover:bg-orange-600'>
                    <Link href='/admin/book/new'>
                        <Plus size={18} />
                        Yangi kitob
                    </Link>
                </Button>
            </section>

            <section className='grid gap-4 md:grid-cols-3'>
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
                                <th className='px-4 py-3'>Kitob</th>
                                <th className='px-4 py-3'>Kategoriya</th>
                                <th className='px-4 py-3'>Narx</th>
                                <th className='px-4 py-3'>Zaxira</th>
                                <th className='px-4 py-3'>Reyting</th>
                                <th className='px-4 py-3 text-right'>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <BooksTableSkeleton />
                            ) : (
                                filteredBooks.map((book, index) => {
                                    const status = getStockStatus(book.stock);
                                    const imageUrl = getLatestImageUrl(book.images) || getLatestImageUrl(book.image);
                                    const barcode = getBookBarcode(book);
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
                                            <td className='px-4 py-4 text-sm font-bold text-[#6f6255] dark:text-slate-300'>
                                                {getCategoryLabel(book.category)}
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
                                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black ring-1 ${status.className}`}>
                                                    {status.label} - {book.stock} dona
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
                                                        <Link href={`/admin/book/${book.slug}`}>
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
                            onClick={() => updatePage(page + 1)}
                            disabled={page >= (pagination?.pages ?? 1) || isFetching}
                            className='h-10 rounded-2xl border-[#eadfce] bg-white font-black dark:border-slate-800 dark:bg-slate-900'>
                            Keyingi
                            <ArrowRight size={17} />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminBookPage;
