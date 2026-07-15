'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useParams } from 'next/navigation';

import { BookStructuredData } from '@/components/seo/StructuredData';
import BreadCrumb from '@/components/shared/BreadCrumb';
import DottedLine from '@/components/shared/DottedLine';
import { Loading } from '@/components/shared/Loading';
import Rekomendation from '@/components/shared/Rekomendation';
import TabPanel from '@/components/shared/TabPanel';
import { Button } from '@/components/ui/button';
import { useBookCart } from '@/hooks/bookHooks/useBookCart';
import { useBookStats } from '@/hooks/bookHooks/useBookStats';
import { useBookWishlist } from '@/hooks/bookHooks/useBookWishlist';
import { bookService } from '@/services/book.service';
import { Book } from '@/types/book';
import { getAuthor, getBookPriceInfo, getCategoryLabel, getLocalizedText } from '@/utils/book-formatters';
import { formatPrice } from '@/utils/currency';
import { getImageUrl } from '@/utils/image';
import { useQuery } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import { Eye, Heart, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type DetailBook = Book & {
    category?: Parameters<typeof getCategoryLabel>[0];
    subCategoryId?: string | { _id?: string };
    subCategory?: string | { _id?: string };
    subgenre?: string | { _id?: string };
};

const hiddenBranchNames = ['solnechniy', 'yangi asr avlodi', 'book uz sklad', 'mitti olam', 'ko rgazma 28 06'];

const normalizeBranchName = (name?: string) =>
    (name ?? '')
        .trim()
        .toLocaleLowerCase('uz-UZ')
        .replace(/[ʻʼ’‘`´']/g, ' ')
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();

// ==================== MAIN COMPONENT ====================
export default function BookDetailPage() {
    const { t, i18n } = useTranslation();
    const params = useParams();
    const slug = params?.slug as string;
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const { data: book, isLoading: bookLoading } = useQuery<DetailBook | null>({
        queryKey: ['book', slug],
        queryFn: () => bookService.getBookById(slug) as Promise<DetailBook | null>,
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false
    });

    const viewedBookRef = useRef<string | null>(null);
    const { viewsCount, ratingAvg, ratingCount, userRating, incrementViews, rateBook } = useBookStats({
        bookId: book?._id,
        initialViewsCount: book?.viewsCount ?? book?.views,
        initialRatingAvg: book?.ratingAvg,
        initialRatingCount: book?.ratingCount
    });

    const { isBookmarked, favoriteLoading, toggleFavorite } = useBookWishlist(book ?? undefined, {
        queryKeys: [['book', slug]]
    });
    const { cartItems, addItem, updateQuantity, removeItem } = useBookCart({ loadOnMount: false });
    const cartItem = useMemo(() => cartItems.find((item) => item.book._id === book?._id), [book?._id, cartItems]);
    const cartQuantity = cartItem?.quantity ?? 0;
    const formatBranchName = (name?: string) => (name || t('bookDetail.storeFallback')).replace(/^\s*\d+\s*/, '');

    const availableBranchStocks = useMemo(
        () =>
            book?.branchStocks?.filter((item) => {
                const storeName = normalizeBranchName(item.storeName);
                return (item.available ?? 0) > 0 && !hiddenBranchNames.some((name) => storeName.includes(name));
            }) ?? [],
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
    const priceInfo = getBookPriceInfo(book);

    const bookView = useMemo(
        () => ({
            title: getLocalizedText(book?.title),
            image: book?.images?.[0] || book?.image,
            category: getCategoryLabel(book?.category),
            author: getAuthor(book?.authorName) || t('bookDetail.unknownAuthor'),
            description: getLocalizedText(book?.description)
        }),
        [book, i18n.language, t]
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
    }, [book, bookView.category, bookView.title]);

    const getCartBook = () => {
        if (!book) return null;

        return {
            _id: book._id,
            title: book.title,
            slug: book.slug,
            price: priceInfo.price,
            oldPrice: priceInfo.oldPrice,
            discountPrice: priceInfo.price,
            discount: priceInfo.discount,
            images: book.image ?? book.images?.[0] ?? '',
            stock: stockLimit ?? 0,
            publisher: book.publisher,
            publisherId: book.publisherId,
            publisherName: book.publisherName,
            details: book.details
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
            <div className='min-h-screen py-16 dark:bg-slate-900'>
                <div className='container mx-auto max-w-3xl px-4 text-center'>
                    <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-10 dark:border-slate-700 dark:bg-slate-800'>
                        <h1 className='text-2xl font-black text-slate-900 dark:text-white'>
                            {t('bookDetail.notFoundTitle')}
                        </h1>
                        <p className='mt-3 text-slate-500 dark:text-slate-400'>{t('bookDetail.notFoundDescription')}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen py-4 sm:py-6 dark:bg-slate-900'>
            <BookStructuredData book={book} />

            <div className='container mx-auto max-w-7xl px-3 sm:px-4'>
                <BreadCrumb items={breadcrumbItems} />

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='grid gap-4 rounded-2xl border border-[#f7e3cf] bg-[#fff9f3] p-1.5 shadow-lg shadow-orange-100/70 backdrop-blur sm:gap-8 lg:grid-cols-[minmax(0,460px)_1fr] dark:border-slate-700 dark:bg-slate-800 dark:shadow-none'>
                    <div className='relative min-h-80 overflow-hidden p-4 sm:min-h-105 sm:p-6'>
                        <img
                            src={getImageUrl(bookView.image)}
                            alt={bookView.title}
                            className='h-full max-h-130 w-full object-contain'
                        />
                        {priceInfo.discount ? (
                            <span className='absolute top-4 left-4 rounded-full bg-[#ef7f1a] px-3 py-1.5 text-sm font-black text-white shadow-sm ring-1 ring-white/70 sm:top-6 sm:left-6'>
                                -{priceInfo.discount}%
                            </span>
                        ) : null}
                        {availableBranchStocks.length ? (
                            <div className='mt-5 space-y-3 border-t border-orange-100 pt-4 dark:border-slate-700'>
                                <div className='space-y-2'>
                                    {availableBranchStocks.map((item, index) => {
                                        const available = Math.max(item.available ?? 0, 0);

                                        return (
                                            <div
                                                key={item._id ?? item.storeId ?? index}
                                                className='rounded-lg border border-slate-200 bg-white/70 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/40'>
                                                <div className='flex items-start justify-between gap-3'>
                                                    <div className='flex min-w-0 items-center gap-2'>
                                                        <div className='min-w-0'>
                                                            <p className='truncate font-semibold text-slate-900 dark:text-white'>
                                                                {formatBranchName(item.storeName)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span className='shrink-0 rounded-md bg-green-50 px-2.5 py-1 text-sm font-bold text-green-600 dark:bg-green-500/10 dark:text-green-400'>
                                                        {t('bookDetail.itemsAvailable', { count: available })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : isBookAvailable && !hasBranchStocks ? (
                            <div className='mt-5 rounded-lg border border-green-100 bg-green-50/70 p-3 text-sm font-semibold text-green-600 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400'>
                                {t('bookDetail.stockAvailable', { count: availableStock })}
                            </div>
                        ) : (
                            <span className='flex items-center gap-2 text-sm text-red-500'>
                                <span className='h-3 w-3 rounded-full bg-red-500'></span>
                                {t('bookDetail.outOfStock')}
                            </span>
                        )}
                    </div>

                    <div className='p-4 sm:p-6'>
                        <p className='mb-3 text-sm font-semibold text-[#ef7f1a]'>{bookView.category}</p>
                        <h1 className='text-2xl font-black text-gray-900 sm:text-3xl md:text-4xl dark:text-white'>
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
                                                aria-label={t('bookDetail.starRating', { count: rating })}
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
                        </div>

                        {/* Info Books */}
                        <div className='mt-4'>
                            <DottedLine label='ISBN' value={book?.barcode} />
                            <DottedLine
                                label={t('bookDetail.script')}
                                value={
                                    book?.contentLanguage === 'cyrillic'
                                        ? t('bookDetail.cyrillic')
                                        : t('bookDetail.latin')
                                }
                            />
                            <DottedLine
                                label={t('bookDetail.pages')}
                                value={book?.numberOfPage ? String(book.numberOfPage) : undefined}
                            />
                            <DottedLine
                                label={t('bookDetail.year')}
                                value={book?.year ? String(book.year) : undefined}
                            />
                            <DottedLine label={t('bookDetail.publisher')} value={book?.publisherName} />
                            <DottedLine label={t('bookDetail.language')} value={book?.language?.toUpperCase()} />
                            <DottedLine
                                label={t('bookDetail.cover')}
                                value={book?.cover === 'paper' ? t('bookDetail.paperback') : t('bookDetail.hardcover')}
                            />
                        </div>

                        <div className='mt-8 rounded-3xl'>
                            <div className='flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center'>
                                <div className='mt-2 min-w-0'>
                                    {priceInfo.hasDiscount ? (
                                        <div className='mb-2 flex flex-wrap items-center gap-2'>
                                            <span className='text-base font-bold text-slate-400 line-through dark:text-slate-500'>
                                                {formatPrice(priceInfo.oldPrice)}
                                            </span>
                                            {priceInfo.discount ? (
                                                <span className='rounded-full bg-orange-50 px-2.5 py-1 text-xs font-black text-[#ef7f1a] dark:bg-orange-500/10 dark:text-orange-300'>
                                                    -{priceInfo.discount}%
                                                </span>
                                            ) : null}
                                        </div>
                                    ) : null}
                                    <div className='flex min-w-0 items-end gap-3'>
                                        <span className='text-3xl font-black tracking-tight break-words text-[#ef7f1a] sm:text-4xl'>
                                            {formatPrice(priceInfo.price)}
                                        </span>
                                    </div>
                                </div>

                                <div className='flex items-center gap-1.5'>
                                    <button
                                        type='button'
                                        onClick={decrementCartQuantity}
                                        aria-label={t('bookDetail.decreaseQuantity')}
                                        disabled={!isBookAvailable || (cartQuantity === 0 && selectedQuantity <= 1)}
                                        className='flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#ef7f1a] disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800'>
                                        <Minus size={18} />
                                    </button>

                                    <div className='flex h-11 min-w-16 items-center justify-center rounded-xl bg-gradient-to-b from-slate-50 to-white px-4 text-center text-lg font-black text-slate-900 ring-1 ring-slate-200 dark:from-slate-900 dark:to-slate-950 dark:text-white dark:ring-slate-700'>
                                        {displayedQuantity}
                                    </div>

                                    <button
                                        type='button'
                                        aria-label={t('bookDetail.increaseQuantity')}
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
                                    className='h-12 rounded-2xl bg-[#ef7f1a] text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-[#d96f12] sm:h-14 sm:text-base dark:shadow-none'>
                                    <ShoppingCart size={20} />
                                    {!isBookAvailable
                                        ? t('bookDetail.outOfStock')
                                        : cartQuantity > 0
                                          ? t('bookDetail.inCart')
                                          : t('bookDetail.addToCart')}
                                </Button>
                                <Button
                                    variant='outline'
                                    disabled={favoriteLoading}
                                    onClick={toggleFavorite}
                                    className={`h-12 rounded-2xl border-slate-200 bg-white/80 px-4 text-sm font-bold backdrop-blur hover:border-[#ef7f1a] hover:text-[#ef7f1a] sm:h-14 sm:px-5 sm:text-base dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-slate-500 dark:hover:text-white`}>
                                    <Heart className={isBookmarked ? 'fill-red-500 text-red-500' : ''} size={20} />
                                    {t('bookDetail.favorites')}
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

                <Rekomendation book={book} />
            </div>
        </div>
    );
}
