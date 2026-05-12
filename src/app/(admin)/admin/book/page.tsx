'use client';

import { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { getSearchQueryVariants } from '@/lib/search-transliteration';
import { bookService } from '@/services/book.service';
import { Product } from '@/types';
import { getAuthor, getCategoryLabel, getLocalizedText } from '@/utils/book-formatters';
import { getImageUrl } from '@/utils/image';
import { useQuery } from '@tanstack/react-query';

import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Boxes,
    Eye,
    ImageIcon,
    Pencil,
    Plus,
    Search,
    Star,
    Trash2
} from 'lucide-react';

const BOOKS_LIMIT = 25;

const formatPrice = (price?: number) => `${Number(price || 0).toLocaleString('uz-UZ')} so'm`;

const getBookImage = (book: Product) => book.images?.[0] || book.image;

type ProductListData = Awaited<ReturnType<typeof bookService.getAllProducts>>;

const mergeProductLists = (lists: ProductListData[], limit: number): ProductListData => {
    const seenIds = new Set<string>();
    const products = lists
        .flatMap((list) => list.products)
        .filter((book) => {
            if (seenIds.has(book._id)) return false;

            seenIds.add(book._id);
            return true;
        })
        .slice(0, limit);

    const total = lists.reduce((sum, list) => sum + Number(list.pagination.total || 0), 0);
    const page = lists[0]?.pagination.page ?? 1;

    return {
        products,
        pagination: {
            page,
            limit,
            total,
            pages: Math.max(1, Math.ceil(total / Math.max(limit, 1)))
        }
    };
};

const BooksTableSkeleton = () => (
    <>
        {Array.from({ length: 7 }).map((_, index) => (
            <tr key={index} className='border-b border-[#f0e4d3] last:border-0 dark:border-slate-900'>
                <td className='px-4 py-4'>
                    <div className='flex items-center gap-3'>
                        <div className='size-14 animate-pulse rounded-2xl bg-[#f2e7d8] dark:bg-slate-900' />
                        <div className='min-w-0 flex-1 space-y-2'>
                            <div className='h-4 w-44 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-900' />
                            <div className='h-3 w-28 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-900' />
                        </div>
                    </div>
                </td>
                <td className='px-4 py-4'>
                    <div className='h-4 w-28 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-900' />
                </td>
                <td className='px-4 py-4'>
                    <div className='h-4 w-24 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-900' />
                </td>
                <td className='px-4 py-4'>
                    <div className='h-7 w-28 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-900' />
                </td>
                <td className='px-4 py-4'>
                    <div className='h-7 w-16 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-900' />
                </td>
                <td className='px-4 py-4'>
                    <div className='ml-auto h-8 w-28 animate-pulse rounded-xl bg-[#f2e7d8] dark:bg-slate-900' />
                </td>
            </tr>
        ))}
    </>
);

const BooksCardSkeleton = () => (
    <>
        {Array.from({ length: 5 }).map((_, index) => (
            <article
                key={index}
                className='rounded-[20px] bg-white p-3 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-900 dark:ring-slate-800'>
                <div className='flex gap-3'>
                    <div className='size-16 shrink-0 animate-pulse rounded-2xl bg-[#f2e7d8] dark:bg-slate-800' />
                    <div className='min-w-0 flex-1 space-y-2'>
                        <div className='h-4 w-4/5 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-800' />
                        <div className='h-3 w-1/2 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-800' />
                        <div className='h-4 w-24 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-800' />
                    </div>
                </div>
                <div className='mt-3 flex items-center justify-between'>
                    <div className='h-7 w-28 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-800' />
                    <div className='h-8 w-24 animate-pulse rounded-xl bg-[#f2e7d8] dark:bg-slate-800' />
                </div>
            </article>
        ))}
    </>
);

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

const AdminBookPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);
    const urlSearch = searchParams.get('search') || '';
    const [searchInput, setSearchInput] = useState(urlSearch);
    const debouncedSearch = useDebounce(searchInput, 400);

    useEffect(() => {
        setSearchInput(urlSearch);
    }, [urlSearch]);

    useEffect(() => {
        const nextSearch = debouncedSearch.trim();
        if (nextSearch === urlSearch.trim()) return;

        setPage(1);
        router.replace(nextSearch ? `/admin/book?search=${encodeURIComponent(nextSearch)}` : '/admin/book', {
            scroll: false
        });
    }, [debouncedSearch, router, urlSearch]);

    const queryParams = useMemo(
        () => ({
            page,
            limit: BOOKS_LIMIT,
            keyword: debouncedSearch.trim() || undefined
        }),
        [debouncedSearch, page]
    );

    const { data, isFetching, isLoading } = useQuery({
        queryKey: ['admin-books', queryParams],
        queryFn: async () => {
            const searchVariants = getSearchQueryVariants(debouncedSearch);

            if (searchVariants.length <= 1) {
                return bookService.getAllProducts(queryParams);
            }

            const lists = await Promise.all(
                searchVariants.map((keyword) =>
                    bookService.getAllProducts({
                        ...queryParams,
                        keyword
                    })
                )
            );

            return mergeProductLists(lists, BOOKS_LIMIT);
        },
        placeholderData: (previousData) => previousData
    });

    const books = data?.products ?? [];
    const pagination = data?.pagination ?? { page: 1, limit: BOOKS_LIMIT, total: 0, pages: 1 };
    const totalStock = books.reduce((sum, book) => sum + Number(book.stock || 0), 0);
    const activeBooks = books.filter((book) => Number(book.stock || 0) > 0).length;
    const averagePrice = books.length
        ? books.reduce((sum, book) => sum + Number(book.price || 0), 0) / books.length
        : 0;

    const handleSearch = (value: string) => {
        setSearchInput(value);
    };

    return (
        <div className='space-y-5'>
            <section className='flex flex-col gap-4 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] md:flex-row md:items-center md:justify-between md:p-5 dark:bg-slate-950 dark:ring-slate-800'>
                <div>
                    <p className='text-xs font-black tracking-wide text-[#ef7f1a] uppercase'>Kitoblar bazasi</p>
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
                <div className='rounded-[22px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                    <span className='grid size-11 place-items-center rounded-2xl bg-[#ef7f1a] text-white'>
                        <BookOpen size={20} />
                    </span>
                    <p className='mt-4 text-2xl font-black text-[#2f2a25] dark:text-white'>
                        {pagination.total.toLocaleString('uz-UZ')}
                    </p>
                    <p className='text-sm font-bold text-[#9d907e] dark:text-slate-400'>Jami kitoblar</p>
                </div>

                <div className='rounded-[22px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                    <span className='grid size-11 place-items-center rounded-2xl bg-[#43a27a] text-white'>
                        <Boxes size={20} />
                    </span>
                    <p className='mt-4 text-2xl font-black text-[#2f2a25] dark:text-white'>
                        {totalStock.toLocaleString('uz-UZ')}
                    </p>
                    <p className='text-sm font-bold text-[#9d907e] dark:text-slate-400'>
                        Shu sahifadagi zaxira, {activeBooks} ta mavjud
                    </p>
                </div>

                <div className='rounded-[22px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                    <span className='grid size-11 place-items-center rounded-2xl bg-[#285c7f] text-white'>
                        <Star size={20} />
                    </span>
                    <p className='mt-4 text-2xl font-black text-[#2f2a25] dark:text-white'>
                        {formatPrice(averagePrice)}
                    </p>
                    <p className='text-sm font-bold text-[#9d907e] dark:text-slate-400'>O'rtacha narx</p>
                </div>
            </section>

            <section className='rounded-[24px] bg-[#fffaf2] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                <div className='flex flex-col gap-3 border-b border-[#eadfce] p-4 md:flex-row md:items-center md:justify-between dark:border-slate-800'>
                    <label className='flex h-11 min-w-0 items-center gap-2 rounded-2xl bg-[#f2e7d8] px-4 text-[#817466] md:max-w-sm md:flex-1 dark:bg-slate-900 dark:text-slate-300'>
                        <Search size={18} className='shrink-0' />
                        <Input
                            value={searchInput}
                            onChange={(event) => handleSearch(event.target.value)}
                            placeholder='Kitob nomi, muallif yoki ISBN'
                            className='h-full border-0 bg-transparent p-0 text-sm font-semibold shadow-none'
                        />
                    </label>

                    <div className='text-sm font-bold text-[#8b7e70] dark:text-slate-400'>
                        {isFetching ? 'Yangilanmoqda...' : `${books.length} ta natija ko'rsatildi`}
                    </div>
                </div>

                <div className='hidden overflow-x-auto lg:block'>
                    <table className='w-full min-w-[980px] text-left'>
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
                                books.map((book) => {
                                    const title = getLocalizedText(book.title, 'Nomsiz kitob');
                                    const status = getStockStatus(book.stock);

                                    return (
                                        <tr
                                            key={book._id}
                                            className='border-b border-[#f0e4d3] last:border-0 dark:border-slate-900'>
                                            <td className='px-4 py-4'>
                                                <div className='flex min-w-0 items-center gap-3'>
                                                    <div className='grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#f2e7d8] dark:bg-slate-900'>
                                                        {getBookImage(book) ? (
                                                            <img
                                                                src={getImageUrl(getBookImage(book))}
                                                                alt={title}
                                                                className='h-full w-full object-cover'
                                                            />
                                                        ) : (
                                                            <ImageIcon size={20} className='text-[#9d907e]' />
                                                        )}
                                                    </div>
                                                    <div className='min-w-0'>
                                                        <p className='truncate font-black text-[#2f2a25] dark:text-white'>
                                                            {title}
                                                        </p>
                                                        <p className='mt-1 truncate text-sm font-semibold text-[#9d907e] dark:text-slate-400'>
                                                            {getAuthor(book.authorName || book.author)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='px-4 py-4 text-sm font-bold text-[#6f6255] dark:text-slate-300'>
                                                {getCategoryLabel(book.category, "Kategoriya yo'q")}
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
                                                    {status.label} - {Number(book.stock || 0)} dona
                                                </span>
                                            </td>
                                            <td className='px-4 py-4'>
                                                <span className='inline-flex items-center gap-1 rounded-full bg-[#f2e7d8] px-3 py-1 text-sm font-black text-[#6f6255] dark:bg-slate-900 dark:text-slate-300'>
                                                    {Number(book.ratingAvg || book.rating || 0).toFixed(1)}
                                                    <Star size={14} className='fill-yellow-400 text-yellow-400' />
                                                </span>
                                            </td>
                                            <td className='px-4 py-4'>
                                                <div className='flex justify-end gap-2'>
                                                    <Button
                                                        asChild
                                                        size='icon-sm'
                                                        variant='ghost'
                                                        className='rounded-xl'>
                                                        <Link
                                                            href={`/admin/book/${book.slug || book._id}`}
                                                            aria-label="Ko'rish">
                                                            <Eye size={17} />
                                                        </Link>
                                                    </Button>
                                                    <Button size='icon-sm' variant='ghost' className='rounded-xl'>
                                                        <Pencil size={17} />
                                                    </Button>
                                                    <Button
                                                        size='icon-sm'
                                                        variant='ghost'
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

                <div className='space-y-3 p-4 lg:hidden'>
                    {isLoading ? (
                        <BooksCardSkeleton />
                    ) : (
                        books.map((book) => {
                            const title = getLocalizedText(book.title, 'Nomsiz kitob');
                            const status = getStockStatus(book.stock);

                            return (
                                <article
                                    key={book._id}
                                    className='rounded-[20px] bg-white p-3 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-900 dark:ring-slate-800'>
                                    <div className='flex gap-3'>
                                        <div className='grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#f2e7d8] dark:bg-slate-800'>
                                            {getBookImage(book) ? (
                                                <img
                                                    src={getImageUrl(getBookImage(book))}
                                                    alt={title}
                                                    className='h-full w-full object-cover'
                                                />
                                            ) : (
                                                <ImageIcon size={20} className='text-[#9d907e]' />
                                            )}
                                        </div>
                                        <div className='min-w-0 flex-1'>
                                            <p className='line-clamp-2 font-black text-[#2f2a25] dark:text-white'>
                                                {title}
                                            </p>
                                            <p className='mt-1 truncate text-sm font-semibold text-[#9d907e] dark:text-slate-400'>
                                                {getAuthor(book.authorName || book.author)}
                                            </p>
                                            <p className='mt-2 font-black text-[#ef7f1a]'>{formatPrice(book.price)}</p>
                                        </div>
                                    </div>
                                    <div className='mt-3 flex flex-wrap items-center justify-between gap-2'>
                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black ring-1 ${status.className}`}>
                                            {status.label} - {Number(book.stock || 0)} dona
                                        </span>
                                        <div className='flex gap-1'>
                                            <Button asChild size='icon-sm' variant='ghost' className='rounded-xl'>
                                                <Link
                                                    href={`/admin/book/${book.slug || book._id}`}
                                                    aria-label="Ko'rish">
                                                    <Eye size={17} />
                                                </Link>
                                            </Button>
                                            <Button size='icon-sm' variant='ghost' className='rounded-xl'>
                                                <Pencil size={17} />
                                            </Button>
                                            <Button
                                                size='icon-sm'
                                                variant='ghost'
                                                className='rounded-xl text-red-500 hover:text-red-600'>
                                                <Trash2 size={17} />
                                            </Button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>

                {!isLoading && books.length === 0 ? (
                    <div className='grid min-h-60 place-items-center p-6 text-center'>
                        <div>
                            <div className='mx-auto grid size-14 place-items-center rounded-2xl bg-[#f2e7d8] text-[#9d907e] dark:bg-slate-900 dark:text-slate-400'>
                                <BookOpen size={24} />
                            </div>
                            <p className='mt-4 text-lg font-black text-[#2f2a25] dark:text-white'>Kitob topilmadi</p>
                            <p className='mt-1 text-sm font-semibold text-[#9d907e] dark:text-slate-400'>
                                Qidiruvni o'zgartiring yoki yangi kitob qo'shing.
                            </p>
                        </div>
                    </div>
                ) : null}

                <div className='flex flex-col gap-3 border-t border-[#eadfce] p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800'>
                    <p className='text-sm font-bold text-[#8b7e70] dark:text-slate-400'>
                        Sahifa {pagination.page} / {pagination.pages}
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
                            disabled={page >= pagination.pages || isFetching}
                            onClick={() => setPage((value) => Math.min(value + 1, pagination.pages))}
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
