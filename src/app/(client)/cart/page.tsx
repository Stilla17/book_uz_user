'use client';

import React from 'react';

import Link from 'next/link';

import AsideCart from '@/components/shared/AsideCart';

import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Minus, Plus, Trash2 } from 'lucide-react';

const cartItems = [
    {
        id: '1',
        title: 'Sariq devni minib',
        author: "Xudoyberdi To'xtaboyev",
        format: 'Qattiq muqova',
        price: '45 000',
        oldPrice: '60 000',
        image: 'https://backend.book.uz/user-api/img/img-file-5a14f0417dee3390eddd4478f513e9ad.JPG'
    }
];

export default function CartPage() {
    return (
        <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(239,127,26,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.08),_transparent_32%),linear-gradient(180deg,_#fffaf5_0%,_#fff_48%,_#f8fafc_100%)] py-8 dark:bg-[radial-gradient(circle_at_top_left,_rgba(239,127,26,0.10),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.08),_transparent_30%),linear-gradient(180deg,_#0f172a_0%,_#111827_50%,_#0b1220_100%)]'>
            <div className='container mx-auto max-w-7xl px-4'>
                <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]'>
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className='space-y-4'>
                        <div className='flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-orange-100 bg-white/85 p-4 shadow-lg shadow-orange-100/50 backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none'>
                            <Link
                                href='/catalog'
                                className='inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:text-[#ef7f1a] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'>
                                <ArrowLeft size={16} />
                                Xaridni davom ettirish
                            </Link>

                            <div className='flex flex-wrap items-center gap-2'>
                                <button
                                    type='button'
                                    className='inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300'>
                                    <Trash2 size={16} />
                                    Hammasini tozalash
                                </button>
                            </div>
                        </div>

                        {cartItems.map((item, index) => (
                            <motion.article
                                key={item.id}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.08 + index * 0.05 }}
                                className='rounded-[30px] border border-orange-100 bg-white/90 p-4 shadow-lg shadow-orange-100/50 backdrop-blur dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-none'>
                                <div className='flex flex-col gap-5 md:flex-row'>
                                    <div className='mx-auto flex h-52 w-full max-w-40 items-center justify-center overflow-hidden rounded-[24px] bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950'>
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className='h-full w-full object-contain'
                                        />
                                    </div>

                                    <div className='flex min-w-0 flex-1 flex-col justify-between gap-5'>
                                        <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                                            <div className='min-w-0'>
                                                <div className='inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#ef7f1a] dark:bg-slate-800 dark:text-orange-300'>
                                                    {item.format}
                                                </div>
                                                <h2 className='mt-3 text-2xl font-black text-slate-900 dark:text-white'>
                                                    {item.title}
                                                </h2>
                                                <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>
                                                    {item.author}
                                                </p>
                                            </div>

                                            <div className='rounded-2xl bg-slate-50 px-4 py-3 text-left lg:text-right dark:bg-slate-800/70'>
                                                <p className='mt-1 text-2xl font-black text-[#ef7f1a]'>
                                                    {item.price} so'm
                                                </p>
                                            </div>
                                        </div>

                                        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                                            <div className='inline-flex w-fit items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-950'>
                                                <button
                                                    type='button'
                                                    className='flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white hover:text-[#ef7f1a] dark:text-slate-300 dark:hover:bg-slate-800'>
                                                    <Minus size={18} />
                                                </button>
                                                <div className='flex h-11 min-w-16 items-center justify-center rounded-xl bg-white px-4 text-lg font-black text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'>
                                                    1
                                                </div>
                                                <button
                                                    type='button'
                                                    className='flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-[#ef7f1a] dark:bg-white dark:text-slate-900'>
                                                    <Plus size={18} />
                                                </button>
                                            </div>

                                            <div className='flex flex-wrap items-center gap-3'>
                                                <button
                                                    type='button'
                                                    className='inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'>
                                                    <Heart size={16} />
                                                    Sevimliga saqlash
                                                </button>
                                                <button
                                                    type='button'
                                                    className='inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300'>
                                                    <Trash2 size={16} />
                                                    Olib tashlash
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </motion.section>

                    <AsideCart />
                </div>
            </div>
        </div>
    );
}
