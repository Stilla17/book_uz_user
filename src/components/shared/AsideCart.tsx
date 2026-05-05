import React from 'react';

import Link from 'next/link';

import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { BadgePercent, CreditCard, ShieldCheck, Truck } from 'lucide-react';

type AsideCartProps = {
    totalPrice: number;
    totalQuantity: number;
};

const formatPrice = (price: number) => `${price.toLocaleString()} so'm`;

const AsideCart = ({ totalPrice, totalQuantity }: AsideCartProps) => {
    const deliveryPrice = totalQuantity > 0 ? 20000 : 0;
    const paymentTotal = totalPrice + deliveryPrice;

    return (
        <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className='space-y-4 xl:sticky xl:top-24 xl:h-fit'>
            <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                <h2 className='text-xl font-black text-slate-900 dark:text-white'>Buyurtma xulosasi</h2>

                <div className='mt-5 space-y-3'>
                    <div className='flex items-center justify-between text-sm text-slate-500 dark:text-slate-400'>
                        <span>Mahsulotlar</span>
                        <span className='font-semibold text-slate-900 dark:text-white'>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className='flex items-center justify-between text-sm text-slate-500 dark:text-slate-400'>
                        <span>Chegirma</span>
                        <span className='font-semibold text-emerald-600'>0 so'm</span>
                    </div>
                    <div className='flex items-center justify-between text-sm text-slate-500 dark:text-slate-400'>
                        <span>Yetkazib berish</span>
                        <span className='font-semibold text-slate-900 dark:text-white'>
                            {formatPrice(deliveryPrice)}
                        </span>
                    </div>
                </div>

                <div className='my-5 h-px bg-slate-200 dark:bg-slate-800' />

                <div className='flex items-end justify-between gap-3'>
                    <div>
                        <p className='text-sm text-slate-500 dark:text-slate-400'>To'lov uchun</p>
                        <p className='mt-1 text-2xl font-black text-slate-900 dark:text-white'>
                            {formatPrice(paymentTotal)}
                        </p>
                    </div>
                    <div className='rounded-xl bg-orange-50 px-3 py-2 text-sm font-semibold text-[#ef7f1a] dark:bg-slate-800 dark:text-orange-300'>
                        {totalQuantity} ta mahsulot
                    </div>
                </div>

                <div className='mt-6 rounded-xl bg-slate-50 p-4 dark:bg-slate-950'>
                    <div className='flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200'>
                        <BadgePercent size={16} className='text-[#ef7f1a]' />
                        Promo kod
                    </div>
                    <div className='mt-3 flex gap-2'>
                        <input
                            type='text'
                            placeholder='Masalan: BOOKUZ10'
                            className='h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm transition outline-none placeholder:text-slate-400 focus:border-[#ef7f1a] dark:border-slate-800 dark:bg-slate-900 dark:text-white'
                        />
                        <Button className='h-12 rounded-xl bg-slate-900 px-5 text-white hover:bg-[#ef7f1a] dark:bg-white dark:text-slate-900'>
                            Qo'llash
                        </Button>
                    </div>
                </div>
                <div className='mt-4 space-y-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-950'>
                    <div className='flex items-start gap-3'>
                        <ShieldCheck size={18} className='mt-0.5 text-emerald-600' />
                        <div>
                            <p className='font-semibold text-slate-900 dark:text-white'>Xavfsiz to'lov</p>
                            <p className='mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400'>
                                To'lov malumotlari himoyalangan kanal orqali qayta ishlanadi.
                            </p>
                        </div>
                    </div>

                    <div className='flex items-start gap-3'>
                        <Truck size={18} className='mt-0.5 text-[#ef7f1a]' />
                        <div>
                            <p className='font-semibold text-slate-900 dark:text-white'>Tezkor yetkazib berish</p>
                            <p className='mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400'>
                                Toshkent boylab 24 soat ichida, viloyatlarga esa qisqa muddatda.
                            </p>
                        </div>
                    </div>
                </div>

                <Button className='mt-6 h-14 w-full rounded-xl bg-[#ef7f1a] text-base font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-[#d96f12] dark:shadow-none'>
                    <Link href='/checkout' className='flex items-center justify-center gap-2'>
                        <CreditCard size={18} />
                        Buyurtmani rasmiylashtirish
                    </Link>
                </Button>
            </div>
        </motion.aside>
    );
};

export default AsideCart;
