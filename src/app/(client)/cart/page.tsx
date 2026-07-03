'use client';

import React, { useEffect } from 'react';

import Link from 'next/link';

import AsideCart from '@/components/shared/AsideCart';
import QuantityControl from '@/components/shared/QuantityControl';
import { useBookCart } from '@/hooks/bookHooks/useBookCart';
import { setLoading } from '@/store/features/globalSlice';
import { useAppDispatch } from '@/store/hooks';
import { getText } from '@/utils/book-formatters';
import { formatPrice } from '@/utils/currency';
import { getImageUrl } from '@/utils/image';

import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';

export default function CartPage() {
    const dispatch = useAppDispatch();
    const {
        cartItems,
        loadingCart,
        authLoading,
        isAuthenticated,
        totalPrice,
        totalQuantity,
        updateQuantity,
        removeItem,
        clearItems
    } = useBookCart();

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
                            Tanlangan kitoblar
                        </h1>
                        <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400'>
                            Miqdorni tekshiring, kerak bo'lmagan kitoblarni olib tashlang va tolovga o'ting.
                        </p>
                    </div>

                    <div className='inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'>
                        <ShoppingBag className='size-5 text-[#ef7f1a]' />
                        {totalQuantity} ta mahsulot
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
                                    Xaridni davom ettirish
                                </Link>
                            </div>

                            {cartItems.length > 0 && (
                                <button
                                    type='button'
                                    onClick={clearItems}
                                    className='inline-flex h-11 items-center gap-2 rounded-xl bg-rose-50 px-4 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300'>
                                    <Trash2 size={16} />
                                    Hammasini tozalash
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
                                                alt={getText(item.book.title, "Noma'lum kitob")}
                                                className='h-full w-full object-contain'
                                            />
                                        </div>

                                        <div className='flex min-w-0 flex-1 flex-col justify-between gap-5'>
                                            <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                                                <div className='min-w-0'>
                                                    <h2 className='text-lg leading-6 font-black text-slate-900 sm:text-xl sm:leading-7 dark:text-white'>
                                                        {getText(item.book.title, "Noma'lum kitob")}
                                                    </h2>
                                                    <p className='mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400'>
                                                        Omborda: {item.book.stock || 0} ta
                                                    </p>
                                                </div>

                                                <div className='rounded-xl bg-slate-50 px-4 py-3 text-left lg:text-right dark:bg-slate-950'>
                                                    <p className='text-xl font-black text-[#ef7f1a]'>
                                                        {formatPrice(item.book.price)}
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
                                                    Olib tashlash
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.article>
                            ))
                        ) : (
                            <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900'>
                                <h2 className='text-2xl font-black text-slate-900 dark:text-white'>Savat bo'sh</h2>
                                <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>
                                    Katalogdan kitob qo'shsangiz, shu yerda ko'rinadi.
                                </p>
                            </div>
                        )}
                    </motion.section>

                    <AsideCart cartItems={cartItems} totalPrice={totalPrice} totalQuantity={totalQuantity} />
                </div>
            </div>
        </div>
    );
}
