'use client';

import React, { useEffect, useMemo } from 'react';

import Link from 'next/link';

import { BookCard } from '@/components/cards/BookCard';
import AsideCart from '@/components/shared/AsideCart';
import QuantityControl from '@/components/shared/QuantityControl';
import { useBookCart } from '@/hooks/bookHooks/useBookCart';
import { useAllBooksQuery } from '@/hooks/queries/useBookQueries';
import { setLoading } from '@/store/features/globalSlice';
import { useAppDispatch } from '@/store/hooks';
import { getText } from '@/utils/book-formatters';
import { formatPrice } from '@/utils/currency';
import { getImageUrl } from '@/utils/image';

import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CartPage() {
    const { t } = useTranslation();
    const formatCartPrice = (value?: number) => formatPrice(value, t('bookCard.currency'));
    const dispatch = useAppDispatch();
    const { cartItems, loadingCart, authLoading, totalPrice, totalQuantity, updateQuantity, removeItem, clearItems } =
        useBookCart();

    const { data, isLoading: booksLoading } = useAllBooksQuery({
        page: 1,
        limit: 10000,
        minPrice: 20_000
    });

    // Yangi asr Nashryoti boyicha bosin

    const randomBooks = useMemo(() => {
        const books = (data?.products ?? []).filter(
            (book) => Number(book.price) >= 20_000 && book.stock && book.stock > 0
        );

        for (let i = books.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [books[i], books[randomIndex]] = [books[randomIndex], books[i]];
        }
        return books.slice(0, 5);
    }, [data?.products]);

    useEffect(() => {
        dispatch(setLoading(authLoading || loadingCart));

        return () => {
            dispatch(setLoading(false));
        };
    }, [authLoading, dispatch, loadingCart]);

    if (authLoading || loadingCart) return null;

    return (
        <div className='min-h-screen bg-slate-50 py-5 sm:py-8 dark:bg-slate-950'>
            <div className='container mx-auto max-w-7xl px-3 sm:px-4'>
                <div className='mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between dark:border-slate-800'>
                    <div>
                        <h1 className='mt-2 text-2xl font-black text-slate-950 sm:text-3xl dark:text-white'>
                            {t('cartPage.title')}
                        </h1>
                        <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400'>
                            {t('cartPage.subtitle')}
                        </p>
                    </div>

                    <div className='inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'>
                        <ShoppingBag className='size-5 text-[#ef7f1a]' />
                        {t('cartPage.productCount', { count: totalQuantity })}
                    </div>
                </div>

                <div className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-6'>
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className='min-w-0 space-y-4'>
                        <div className='flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                            <div className='flex flex-wrap items-center gap-3'>
                                <Link
                                    href='/catalog'
                                    className='inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:text-[#ef7f1a] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'>
                                    <ArrowLeft size={16} />
                                    {t('cartPage.continueShopping')}
                                </Link>
                            </div>

                            {cartItems.length > 0 && (
                                <button
                                    type='button'
                                    onClick={clearItems}
                                    className='inline-flex h-11 items-center gap-2 rounded-xl bg-rose-50 px-4 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300'>
                                    <Trash2 size={16} />
                                    {t('cartPage.clearAll')}
                                </button>
                            )}
                        </div>

                        {cartItems.length > 0 ? (
                            cartItems.map((item, index) => (
                                <motion.article
                                    key={item.book._id}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.08 + index * 0.05 }}
                                    className='rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 dark:border-slate-800 dark:bg-slate-900'>
                                    <div className='flex flex-col gap-5 md:flex-row md:items-center'>
                                        <div className='mx-auto flex h-40 w-full max-w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-3 sm:h-44 sm:max-w-36 sm:p-4 md:mx-0 dark:bg-slate-950'>
                                            <img
                                                src={getImageUrl(item.book.images)}
                                                alt={getText(item.book.title, t('cartPage.unknownBook'))}
                                                className='h-full w-full object-contain'
                                            />
                                        </div>

                                        <div className='flex min-w-0 flex-1 flex-col justify-between gap-5'>
                                            <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                                                <div className='min-w-0'>
                                                    <h2 className='text-lg leading-6 font-black text-slate-900 sm:text-xl sm:leading-7 dark:text-white'>
                                                        {getText(item.book.title, t('cartPage.unknownBook'))}
                                                    </h2>
                                                    <p className='mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400'>
                                                        {t('cartPage.stockCount', { count: item.book.stock || 0 })}
                                                    </p>
                                                </div>

                                                <div className='rounded-xl bg-slate-50 px-4 py-3 text-left lg:text-right dark:bg-slate-950'>
                                                    <p className='text-xl font-black text-[#ef7f1a]'>
                                                        {formatCartPrice(item.book.price)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                                                <QuantityControl
                                                    quantity={item.quantity}
                                                    min={1}
                                                    max={item.book.stock || undefined}
                                                    onDecrement={() => updateQuantity(item.book._id, item.quantity - 1)}
                                                    onIncrement={() => updateQuantity(item.book._id, item.quantity + 1)}
                                                />

                                                <button
                                                    type='button'
                                                    onClick={() => removeItem(item.book._id)}
                                                    className='inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-rose-50 px-4 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300'>
                                                    <Trash2 size={16} />
                                                    {t('cartPage.remove')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.article>
                            ))
                        ) : (
                            <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900'>
                                <h2 className='text-2xl font-black text-slate-900 dark:text-white'>
                                    {t('cartPage.emptyTitle')}
                                </h2>
                                <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>
                                    {t('cartPage.emptyDescription')}
                                </p>
                            </div>
                        )}
                    </motion.section>

                    <AsideCart cartItems={cartItems} totalPrice={totalPrice} totalQuantity={totalQuantity} />
                </div>

                <div className='mt-12 mb-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900'>
                    <p className='text-center text-xl font-semibold text-green-500 dark:text-slate-400'>
                        Pastdagi kitoblardan birini sotib oling va TOSHKENT bo'ylab bepul yetkazib berish imkoniyatini
                        qo'lga kiriting!!!
                    </p>
                </div>

                {booksLoading ? (
                    <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900'>
                        <p className='text-sm text-slate-500 dark:text-slate-400'>{t('cartPage.loadingBooks')}</p>
                    </div>
                ) : (
                    <div className='grid w-full grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 [&>*]:min-w-0'>
                        {randomBooks.map((book) => (
                            <BookCard key={book._id} book={book} slug={book.slug} freeDeliveryEligible />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
