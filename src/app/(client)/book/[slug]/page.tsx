'use client';

import React, { useMemo } from 'react';

import { useParams } from 'next/navigation';

import BreadCrumb from '@/components/shared/BreadCrumb';
import DottedLine from '@/components/shared/DottedLine';
import { Loading } from '@/components/shared/Loading';
import TabPanel from '@/components/shared/TabPanel';
import { Button } from '@/components/ui/button';
import { useBookCart } from '@/hooks/useBookCart';
import { useBookWishlist } from '@/hooks/useBookWishlist';
import { bookService } from '@/services/book.service';
import { Book } from '@/types/book';
import { getAuthor, getCategoryLabel, getLocalizedText } from '@/utils/book-formatters';
import { getImageUrl } from '@/utils/image';
import { useQuery } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import { Heart, Minus, Plus, ShoppingCart, Star } from 'lucide-react';

type DetailBook = Book & {
    category?: Parameters<typeof getCategoryLabel>[0];
};

// ==================== MAIN COMPONENT ====================
export default function BookDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const { data: book, isLoading: bookLoading } = useQuery<DetailBook | null>({
        queryKey: ['book', slug],
        queryFn: () => bookService.getBookById(slug) as Promise<DetailBook | null>,
        enabled: !!slug
    });

    const { isBookmarked, favoriteLoading, toggleFavorite } = useBookWishlist(book ?? undefined, {
        queryKeys: [['book', slug]]
    });
    const { cartItems, addItem, updateQuantity, removeItem } = useBookCart();
    const cartItem = useMemo(() => cartItems.find((item) => item.book._id === book?._id), [book?._id, cartItems]);
    const cartQuantity = cartItem?.quantity ?? 0;
    const stockLimit = book?.stock && book.stock > 0 ? book.stock : undefined;

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
            stock: book.stock ?? 0
        };
    };

    const incrementCartQuantity = async () => {
        const cartBook = getCartBook();
        if (!book || !cartBook) return;

        if (stockLimit && cartQuantity >= stockLimit) return;

        if (cartQuantity > 0) {
            await updateQuantity(book._id, cartQuantity + 1);
        } else {
            await addItem(cartBook);
        }
    };

    const decrementCartQuantity = async () => {
        if (!book || cartQuantity <= 0) return;

        if (cartQuantity === 1) {
            await removeItem(book._id);
        } else {
            await updateQuantity(book._id, cartQuantity - 1);
        }
    };

    const addBookToCart = async () => {
        if (cartQuantity > 0) return;

        if ((book?.stock ?? 0) > 0) {
            await incrementCartQuantity();
        }
    };

    if (bookLoading) {
        return <Loading />;
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-6 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900'>
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

                        <div className='mt-5 flex flex-wrap items-center gap-3'>
                            <span className='inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-100'>
                                {Number(book?.ratingAvg || 0).toFixed(1)}
                                <Star size={16} className='fill-yellow-400 text-yellow-400' />
                            </span>
                            {book?.stock && book.stock > 0 ? (
                                <span className='flex items-center gap-2 text-sm text-green-500'>
                                    <span className='relative flex h-3 w-3'>
                                        <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75'></span>
                                        <span className='relative inline-flex h-3 w-3 rounded-full bg-green-500'></span>
                                    </span>
                                    {book.stock} dona mavjud
                                </span>
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
                                    {book?.oldPrice ? (
                                        <span className='pb-1 text-base font-semibold text-slate-400 line-through dark:text-slate-500'>
                                            {book.oldPrice.toLocaleString()} so'm
                                        </span>
                                    ) : null}
                                </div>

                                <div className='flex items-center gap-1.5'>
                                    <button
                                        type='button'
                                        onClick={decrementCartQuantity}
                                        aria-label='Kamaytirish'
                                        className='flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#ef7f1a] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800'>
                                        <Minus size={18} />
                                    </button>

                                    <div className='flex h-11 min-w-16 items-center justify-center rounded-xl bg-gradient-to-b from-slate-50 to-white px-4 text-center text-lg font-black text-slate-900 ring-1 ring-slate-200 dark:from-slate-900 dark:to-slate-950 dark:text-white dark:ring-slate-700'>
                                        {cartQuantity}
                                    </div>

                                    <button
                                        type='button'
                                        aria-label='Ko‘paytirish'
                                        disabled={Boolean(
                                            !book?.stock ||
                                            book.stock <= 0 ||
                                            (stockLimit && cartQuantity >= stockLimit)
                                        )}
                                        onClick={incrementCartQuantity}
                                        className='flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition hover:bg-[#ef7f1a] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-orange-100'>
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className='mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]'>
                                <Button
                                    onClick={addBookToCart}
                                    className='h-14 rounded-2xl bg-[#ef7f1a] text-base font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-[#d96f12] dark:shadow-none'>
                                    <ShoppingCart size={20} />
                                    {cartQuantity > 0 ? 'Savatda' : "Savatga qo'shish"}
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
