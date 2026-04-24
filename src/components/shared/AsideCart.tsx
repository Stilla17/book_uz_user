import React from 'react';

import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { BadgePercent, CreditCard, ShieldCheck, Truck } from 'lucide-react';

const AsideCart = () => {
    return (
        <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className='space-y-4'>
            <div className='rounded-[30px] border border-orange-100 bg-white/90 p-5 shadow-xl shadow-orange-100/50 backdrop-blur dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-none'>
                <h2 className='text-2xl font-black text-slate-900 dark:text-white'>Buyurtma xulosasi</h2>

                <div className='mt-5 space-y-3'>
                    <div className='flex items-center justify-between text-sm text-slate-500 dark:text-slate-400'>
                        <span>Mahsulotlar</span>
                        <span className='font-semibold text-slate-900 dark:text-white'>177 000 so'm</span>
                    </div>
                    <div className='flex items-center justify-between text-sm text-slate-500 dark:text-slate-400'>
                        <span>Chegirma</span>
                        <span className='font-semibold text-emerald-600'>0 so'm</span>
                    </div>
                    <div className='flex items-center justify-between text-sm text-slate-500 dark:text-slate-400'>
                        <span>Yetkazib berish</span>
                        <span className='font-semibold text-slate-900 dark:text-white'>20 000 so'm</span>
                    </div>
                </div>

                <div className='my-5 h-px bg-slate-200 dark:bg-slate-700' />

                <div className='flex items-end justify-between gap-3'>
                    <div>
                        <p className='text-sm text-slate-500 dark:text-slate-400'>To'lov uchun</p>
                        <p className='mt-1 text-3xl font-black text-slate-900 dark:text-white'>149 000 so'm</p>
                    </div>
                    <div className='rounded-2xl bg-orange-50 px-3 py-2 text-sm font-semibold text-[#ef7f1a] dark:bg-slate-800 dark:text-orange-300'>
                        3 ta mahsulot
                    </div>
                </div>

                <div className='mt-6 rounded-[24px] bg-slate-50 p-4 dark:bg-slate-950/70'>
                    <div className='flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200'>
                        <BadgePercent size={16} className='text-[#ef7f1a]' />
                        Promo kod
                    </div>
                    <div className='mt-3 flex gap-2'>
                        <input
                            type='text'
                            placeholder='Masalan: BOOKUZ10'
                            className='h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm transition outline-none placeholder:text-slate-400 focus:border-[#ef7f1a] dark:border-slate-700 dark:bg-slate-900 dark:text-white'
                        />
                        <Button className='h-12 rounded-2xl bg-slate-900 px-5 text-white hover:bg-[#ef7f1a] dark:bg-white dark:text-slate-900'>
                            Qo'llash
                        </Button>
                    </div>
                </div>
                <div className='mt-4 space-y-3 rounded-[24px] bg-slate-50 p-4 dark:bg-slate-950/70'>
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

                <Button className='mt-6 h-14 w-full rounded-2xl bg-[#ef7f1a] text-base font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-[#d96f12] dark:shadow-none'>
                    <CreditCard size={18} />
                    Buyurtmani rasmiylashtirish
                </Button>
            </div>
        </motion.aside>
    );
};

export default AsideCart;
