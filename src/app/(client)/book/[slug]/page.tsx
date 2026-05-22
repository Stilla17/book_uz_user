'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useParams } from 'next/navigation';

import BreadCrumb from '@/components/shared/BreadCrumb';
import DottedLine from '@/components/shared/DottedLine';
import { Loading } from '@/components/shared/Loading';
import TabPanel from '@/components/shared/TabPanel';
import { Button } from '@/components/ui/button';
import { useBookCart } from '@/hooks/useBookCart';
import { useBookStats } from '@/hooks/useBookStats';
import { useBookWishlist } from '@/hooks/useBookWishlist';
import { bookService } from '@/services/book.service';
import { Book } from '@/types/book';
import { getAuthor, getCategoryLabel, getLocalizedText } from '@/utils/book-formatters';
import { getImageUrl } from '@/utils/image';
import { useQuery } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import { Eye, Heart, Minus, PackageCheck, Plus, ShoppingCart, Star, Store } from 'lucide-react';

type DetailBook = Book & {
    category?: Parameters<typeof getCategoryLabel>[0];
};

// ==================== MAIN COMPONENT ====================
export default function BookDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const { data: book, isLoading: bookLoading } = useQuery<DetailBook | null>({
        queryKey: ['book', slug],
        queryFn: () => bookService.getBookById(slug) as Promise<DetailBook | null>,
        enabled: !!slug
    });

    console.log(book);

    const viewedBookRef = useRef<string | null>(null);
    const { viewsCount, ratingAvg, ratingCount, userRating, incrementViews, rateBook } = useBookStats({
        bookId: book?._id,
        initialViewsCount: book?.viewsCount ?? book?.views,
        initialRatingAvg: book?.ratingAvg,
        initialRatingCount: book?.ratingCount
    });

    console.log(book);

    const { isBookmarked, favoriteLoading, toggleFavorite } = useBookWishlist(book ?? undefined, {
        queryKeys: [['book', slug]]
    });
    const { cartItems, addItem, updateQuantity, removeItem } = useBookCart();
    const cartItem = useMemo(() => cartItems.find((item) => item.book._id === book?._id), [book?._id, cartItems]);
    const cartQuantity = cartItem?.quantity ?? 0;
    const availableBranchStocks = useMemo(
        () => book?.branchStocks?.filter((item) => (item.available ?? 0) > 0) ?? [],
        [book?.branchStocks]
    );
    const hasBranchStocks = Boolean(book?.branchStocks?.length);
    const availableStock = useMemo(() => {
        if (!book) return 0;

        const branchStocks = book.branchStocks ?? [];

        if (branchStocks.length > 0) {
            return branchStocks.reduce((total, item) => total + Math.max(item.available ?? 0, 0), 0);
        }

        return Math.max(book.stock ?? 0, 0);
    }, [book]);
    const stockLimit = availableStock > 0 ? availableStock : undefined;
    const isBookAvailable = availableStock > 0;
    const displayedQuantity = cartQuantity > 0 ? cartQuantity : selectedQuantity;

    const bookView = useMemo(
        () => ({
            title: getLocalizedText(book?.title),
            image: book?.images?.[0] || book?.image,
            category: getCategoryLabel(book?.category),
            author: getAuthor(book?.authorName) || 'Muallif noma’lum',
            description: getLocalizedText(book?.description)
        }),
        [book]
    );

    const breadcrumbItems = useMemo<Array<{ label: string; path?: string }>>(() => {
        if (!book) return [];
        return [
            {
                label: bookView.category,
                path: '/catalog'
            },
            {
                label: bookView.title
            }
        ];
    }, [book, bookView.title]);

    const getCartBook = () => {
        if (!book) return null;

        return {
            _id: book._id,
            title: book.title,
            slug: book.slug,
            price: book.price,
            images: book.image ?? book.images?.[0] ?? '',
            stock: stockLimit ?? 0
        };
    };

    const incrementCartQuantity = async () => {
        if (!book || !isBookAvailable || !stockLimit) return;

        if (displayedQuantity >= stockLimit) return;

        if (cartQuantity > 0) {
            await updateQuantity(book._id, cartQuantity + 1);
        } else {
            setSelectedQuantity((quantity) => Math.min(quantity + 1, stockLimit));
        }
    };

    const decrementCartQuantity = async () => {
        if (!book || !isBookAvailable) return;

        if (cartQuantity > 0) {
            if (cartQuantity === 1) {
                await removeItem(book._id);
            } else {
                await updateQuantity(book._id, cartQuantity - 1);
            }

            return;
        }

        setSelectedQuantity((quantity) => Math.max(quantity - 1, 1));
    };

    const addBookToCart = async () => {
        if (!isBookAvailable || cartQuantity > 0) return;

        const cartBook = getCartBook();
        if (!cartBook) return;

        await addItem(cartBook, selectedQuantity);
    };

    useEffect(() => {
        if (!book?._id || viewedBookRef.current === book._id) return;

        viewedBookRef.current = book._id;
        incrementViews();
    }, [book?._id, incrementViews]);

    useEffect(() => {
        setSelectedQuantity(1);
    }, [book?._id]);

    if (bookLoading) {
        return <Loading />;
    }

    if (!book) {
        return (
            <div className='bg-background min-h-screen py-16 dark:bg-slate-900'>
                <div className='container mx-auto max-w-3xl px-4 text-center'>
                    <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-10 dark:border-slate-700 dark:bg-slate-800'>
                        <h1 className='text-2xl font-black text-slate-900 dark:text-white'>Kitob topilmadi</h1>
                        <p className='mt-3 text-slate-500 dark:text-slate-400'>
                            Bu kitob mavjud emas yoki katalogdan olib tashlangan.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-background min-h-screen py-6 dark:bg-slate-900'>
            <div className='container mx-auto max-w-7xl px-4'>
                <BreadCrumb items={breadcrumbItems} />

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='grid gap-8 rounded-2xl border border-[#f7e3cf] bg-[#fff9f3] p-1.5 shadow-lg shadow-orange-100/70 backdrop-blur lg:grid-cols-[minmax(0,460px)_1fr] dark:border-slate-700 dark:bg-slate-800 dark:shadow-none'>
                    <div className='relative min-h-105 overflow-hidden p-6'>
                        <img
                            src={getImageUrl(bookView.image)}
                            alt={bookView.title}
                            className='h-full max-h-130 w-full object-contain'
                        />
                    </div>

                    <div className='p-6'>
                        <p className='mb-3 text-sm font-semibold text-[#ef7f1a]'>{bookView.category}</p>
                        <h1 className='text-3xl font-black text-gray-900 md:text-4xl dark:text-white'>
                            {bookView.title}
                        </h1>
                        <p className='mt-3 text-lg text-gray-500 dark:text-gray-400'>{bookView.author}</p>

                        <div className='mt-5'>
                            <div className='flex items-center gap-4'>
                                <div className='inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-100'>
                                    <span>{Number(ratingAvg || 0).toFixed(1)}</span>
                                    <div className='flex items-center gap-0.5'>
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <button
                                                key={rating}
                                                type='button'
                                                aria-label={`${rating} yulduz`}
                                                onClick={() => rateBook(rating)}
                                                className='text-yellow-400 transition hover:scale-110'>
                                                <Star
                                                    size={17}
                                                    className={
                                                        rating <= (userRating ?? Math.round(ratingAvg))
                                                            ? 'fill-yellow-400'
                                                            : 'fill-transparent'
                                                    }
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <span className='text-xs text-slate-500 dark:text-slate-300'>({ratingCount})</span>
                                </div>
                                <span className='flex items-center gap-2'>
                                    <Eye size={16} className='text-gray-500' />
                                    {viewsCount}
                                </span>
                            </div>

                            {availableBranchStocks.length ? (
                                <div className='mt-5 space-y-3 border-t border-orange-100 pt-4 dark:border-slate-700'>
                                    <div className='flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200'>
                                        <PackageCheck size={18} className='text-green-500' />
                                        Do'konlardagi mavjudlik
                                    </div>

                                    <div className='space-y-2'>
                                        {availableBranchStocks.map((item, index) => {
                                            const available = Math.max(item.available ?? 0, 0);
                                            const quantity = Math.max(item.quantity ?? available, available, 1);
                                            const percent = Math.min((available / quantity) * 100, 100);

                                            return (
                                                <div
                                                    key={item._id ?? item.storeId ?? index}
                                                    className='rounded-lg border border-slate-200 bg-white/70 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/40'>
                                                    <div className='flex items-start justify-between gap-3'>
                                                        <div className='flex min-w-0 items-center gap-2'>
                                                            <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'>
                                                                <Store size={17} />
                                                            </span>
                                                            <div className='min-w-0'>
                                                                <p className='truncate font-semibold text-slate-900 dark:text-white'>
                                                                    {item.storeName || "Do'kon"}
                                                                </p>
                                                                <p className='text-xs text-slate-500 dark:text-slate-400'>
                                                                    Zaxirada mavjud
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <span className='shrink-0 rounded-md bg-green-50 px-2.5 py-1 text-sm font-bold text-green-600 dark:bg-green-500/10 dark:text-green-400'>
                                                            {available} dona
                                                        </span>
                                                    </div>

                                                    <div className='mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800'>
                                                        <div
                                                            className='h-full rounded-full bg-green-500'
                                                            style={{ width: `${percent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : isBookAvailable && !hasBranchStocks ? (
                                <div className='mt-5 rounded-lg border border-green-100 bg-green-50/70 p-3 text-sm font-semibold text-green-600 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400'>
                                    {availableStock} dona mavjud
                                </div>
                            ) : (
                                <span className='flex items-center gap-2 text-sm text-red-500'>
                                    <span className='h-3 w-3 rounded-full bg-red-500'></span>
                                    Mavjud emas
                                </span>
                            )}
                        </div>

                        {/* Info Books */}
                        <div className='mt-4'>
                            <DottedLine label='ISBN' value={book?.barcode} />
                            <DottedLine
                                label='Yozuvi'
                                value={book?.contentLanguage === 'cyrillic' ? 'Kirill' : 'Lotin'}
                            />
                            <DottedLine
                                label='Betlar soni'
                                value={book?.numberOfPage ? String(book.numberOfPage) : undefined}
                            />
                            <DottedLine label='Yili' value={book?.year ? String(book.year) : undefined} />
                            <DottedLine label='Nashryot' value={book?.publisherName} />
                            <DottedLine label='Til' value={book?.language?.toUpperCase()} />
                            <DottedLine label='Muqova' value={book?.cover == 'paper' ? 'Yumshoq' : 'Qattiq'} />
                        </div>

                        <div className='mt-8 rounded-3xl'>
                            <div className='flex flex-col gap-4 lg:flex-row lg:items-center'>
                                <div className='mt-2 flex items-end gap-3'>
                                    <span className='text-4xl font-black tracking-tight text-[#ef7f1a]'>
                                        {book?.price.toLocaleString()} so'm
                                    </span>
                                </div>

                                <div className='flex items-center gap-1.5'>
                                    <button
                                        type='button'
                                        onClick={decrementCartQuantity}
                                        aria-label='Kamaytirish'
                                        disabled={!isBookAvailable || (cartQuantity === 0 && selectedQuantity <= 1)}
                                        className='flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#ef7f1a] disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800'>
                                        <Minus size={18} />
                                    </button>

                                    <div className='flex h-11 min-w-16 items-center justify-center rounded-xl bg-gradient-to-b from-slate-50 to-white px-4 text-center text-lg font-black text-slate-900 ring-1 ring-slate-200 dark:from-slate-900 dark:to-slate-950 dark:text-white dark:ring-slate-700'>
                                        {displayedQuantity}
                                    </div>

                                    <button
                                        type='button'
                                        aria-label='Ko‘paytirish'
                                        disabled={!isBookAvailable || !stockLimit || displayedQuantity >= stockLimit}
                                        onClick={isBookAvailable ? incrementCartQuantity : undefined}
                                        className='flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition hover:bg-[#ef7f1a] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-orange-100'>
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className='mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]'>
                                <Button
                                    onClick={addBookToCart}
                                    disabled={!isBookAvailable || cartQuantity > 0}
                                    className='h-14 rounded-2xl bg-[#ef7f1a] text-base font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-[#d96f12] dark:shadow-none'>
                                    <ShoppingCart size={20} />
                                    {!isBookAvailable
                                        ? 'Mavjud emas'
                                        : cartQuantity > 0
                                          ? 'Savatda'
                                          : "Savatga qo'shish"}
                                </Button>
                                <Button
                                    variant='outline'
                                    disabled={favoriteLoading}
                                    onClick={toggleFavorite}
                                    className={`h-14 rounded-2xl border-slate-200 bg-white/80 px-5 text-base font-bold backdrop-blur hover:border-[#ef7f1a] hover:text-[#ef7f1a] dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-slate-500 dark:hover:text-white`}>
                                    <Heart className={isBookmarked ? 'fill-red-500 text-red-500' : ''} size={20} />
                                    Sevimlilarga
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.section>

                <TabPanel
                    bookId={book?._id}
                    description={bookView.description}
                    author={bookView.author}
                    category={bookView.category}
                    pages={book?.numberOfPage}
                    language={book?.language}
                    publisherName={book?.publisherName}
                    year={book?.year}
                    reviewsCount={book?.reviewsCount}
                />
            </div>
        </div>
    );
}
