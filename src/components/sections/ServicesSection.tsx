'use client';

import React, { useMemo } from 'react';

import Link from 'next/link';

import { cn } from '@/lib/utils';

import { motion, useReducedMotion } from 'framer-motion';
import {
    Award,
    BookHeadphones,
    ChevronRight,
    Cloud,
    Coffee,
    Compass,
    CreditCard,
    Crown,
    Flower2,
    Gem,
    Headphones,
    Heart,
    Moon,
    ShieldCheck,
    Sparkles,
    Star,
    Sun,
    Truck,
    Zap
} from 'lucide-react';

export type ServiceItem = {
    id: string;
    title: string;
    desc: string;
    icon: 'delivery' | 'support' | 'audiobooks' | 'secure' | 'payment';
    href?: string;
    isActive?: boolean;
    badge?: string;
};

const iconMap = {
    delivery: Truck,
    support: Headphones,
    audiobooks: BookHeadphones,
    secure: ShieldCheck,
    payment: CreditCard
};

const mockServices: ServiceItem[] = [
    {
        id: 's1',
        title: 'Yetkazib berish',
        desc: 'Toshkent bo‘ylab tez, viloyatlarga esa ishonchli yetkazamiz.',
        icon: 'delivery',
        href: '/checkout',
        isActive: true
    },
    {
        id: 's2',
        title: '24/7 Support',
        desc: 'Telegram/Chat orqali doim aloqadamiz. Savol bo‘lsa yozing.',
        icon: 'support',
        href: '/about',
        isActive: true
    },
    {
        id: 's3',
        title: 'Audiokitoblar',
        desc: 'Ilovada tinglang: yo‘lda, sportda, uyda — qulay format.',
        icon: 'audiobooks',
        href: '/catalog',
        isActive: true
    },
    {
        id: 's4',
        title: 'Kafolat & Ishonch',
        desc: 'Buyurtma xavfsizligi, qaytarish qoidalari va nazorat tizimi.',
        icon: 'secure',
        href: '/about',
        isActive: true
    },
    {
        id: 's5',
        title: 'Qulay to‘lovlar',
        desc: 'Click/Payme/Uzum/Bank kartalar — hammasi bor.',
        icon: 'payment',
        href: '/checkout',
        isActive: true
    }
];

export const ServicesSection = ({
    adminServices,
    title = 'Xizmatlar',
    subtitle = 'Biz sizga qulaylik yaratamiz — tez, xavfsiz va foydali'
}: {
    adminServices?: ServiceItem[];
    title?: string;
    subtitle?: string;
}) => {
    const reduceMotion = useReducedMotion();

    const services = useMemo(() => {
        const src = adminServices?.length ? adminServices : mockServices;
        return src.filter((s) => s.isActive !== false);
    }, [adminServices]);

    // Badge ranglarini aniqlash (dark mode qo'shilgan)
    const getBadgeStyle = (badge: string) => {
        if (badge.includes('24'))
            return 'bg-[#00a0e3]/10 dark:bg-blue-600/20 text-[#00a0e3] dark:text-blue-400 border-[#00a0e3]/20 dark:border-blue-500/30';
        if (badge.includes('Yangi'))
            return 'bg-[#ef7f1a]/10 dark:bg-orange-600/20 text-[#ef7f1a] dark:text-orange-400 border-[#ef7f1a]/20 dark:border-orange-500/30';
        if (badge.includes('100%'))
            return 'bg-green-500/10 dark:bg-green-600/20 text-green-600 dark:text-green-400 border-green-500/20 dark:border-green-500/30';
        return 'bg-[#00a0e3]/10 dark:bg-blue-600/20 text-[#00a0e3] dark:text-blue-400 border-[#00a0e3]/20 dark:border-blue-500/30';
    };

    return (
        <section className='bg-background relative overflow-hidden py-14 dark:bg-slate-900'>
            <div className='brand-grid' />

            <div className='relative z-10 container mx-auto px-4'>
                {/* Header */}
                <motion.div
                    className='mb-7 flex flex-col items-end justify-between gap-4 md:flex-row'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}>
                    <div>
                        <h2 className='text-2xl font-black tracking-tight md:text-3xl'>
                            <span className='text-[#00a0e3] dark:text-blue-400'>{title.split(' ')[0]}</span>
                            <span className='text-[#ef7f1a] dark:text-orange-400'>
                                {' '}
                                {title.split(' ').slice(1).join(' ')}
                            </span>
                        </h2>
                        <p className='mt-1 text-sm text-gray-500 md:text-base dark:text-gray-400'>{subtitle}</p>
                    </div>

                    <Link
                        href='/services'
                        className='group hidden items-center gap-1 text-sm font-extrabold text-[#00a0e3] transition-all hover:text-[#ef7f1a] md:inline-flex dark:text-blue-400 dark:hover:text-orange-400'>
                        Hammasi
                        <ChevronRight size={18} className='transition-transform group-hover:translate-x-1' />
                    </Link>
                </motion.div>

                {/* Cards Grid */}
                <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5'>
                    {services.map((item, idx) => {
                        const Icon = iconMap[item.icon];

                        return (
                            <motion.div
                                key={item.id}
                                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.35 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                className='group relative'>
                                <Link
                                    href={item.href || '#'}
                                    className='relative block h-full overflow-hidden rounded-3xl border-2 border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-2xl dark:hover:shadow-[#00a0e3]/20'>
                                    {/* Background gradient on hover */}
                                    <div className='absolute inset-0 bg-gradient-to-br from-[#00a0e3]/5 via-transparent to-[#ef7f1a]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-blue-600/10 dark:via-transparent dark:to-orange-600/10' />

                                    {/* Floating Particles */}
                                    <motion.div className='absolute inset-0' transition={{ duration: 0.3 }} />

                                    {/* Decorative corner */}
                                    <div className='absolute top-0 right-0 h-20 w-20 translate-x-6 -translate-y-6 transform rounded-bl-full bg-gradient-to-br from-[#00a0e3]/10 to-[#ef7f1a]/10 transition-transform duration-500 group-hover:translate-x-4 group-hover:-translate-y-4 dark:from-blue-600/20 dark:to-orange-600/20' />

                                    {/* Icon section */}
                                    <div className='relative z-10 flex items-start justify-between gap-3'>
                                        <div
                                            className={cn(
                                                'flex h-14 w-14 items-center justify-center rounded-2xl border-2 transition-all duration-300',
                                                'bg-white group-hover:scale-110 dark:bg-slate-800',
                                                idx % 2 === 0
                                                    ? 'border-[#00a0e3]/20 group-hover:border-[#00a0e3] group-hover:bg-[#00a0e3]/5 dark:border-blue-500/30 dark:group-hover:border-blue-600 dark:group-hover:bg-blue-600/20'
                                                    : 'border-[#ef7f1a]/20 group-hover:border-[#ef7f1a] group-hover:bg-[#ef7f1a]/5 dark:border-orange-500/30 dark:group-hover:border-orange-600 dark:group-hover:bg-orange-600/20'
                                            )}>
                                            <Icon
                                                className={cn(
                                                    'transition-colors duration-300',
                                                    idx % 2 === 0
                                                        ? 'text-[#00a0e3] group-hover:text-[#00a0e3] dark:text-blue-400 dark:group-hover:text-blue-400'
                                                        : 'text-[#ef7f1a] group-hover:text-[#ef7f1a] dark:text-orange-400 dark:group-hover:text-orange-400'
                                                )}
                                                size={26}
                                            />
                                        </div>

                                        {item.badge && (
                                            <span
                                                className={cn(
                                                    'rounded-full border px-2.5 py-1 text-[10px] font-black transition-all',
                                                    getBadgeStyle(item.badge)
                                                )}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className='relative z-10 mt-4'>
                                        <h3
                                            className={cn(
                                                'text-[17px] font-extrabold transition-colors duration-300',
                                                idx % 2 === 0
                                                    ? 'text-gray-900 group-hover:text-[#00a0e3] dark:text-white dark:group-hover:text-blue-400'
                                                    : 'text-gray-900 group-hover:text-[#ef7f1a] dark:text-white dark:group-hover:text-orange-400'
                                            )}>
                                            {item.title}
                                        </h3>
                                        <p className='mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400'>
                                            {item.desc}
                                        </p>
                                    </div>

                                    {/* CTA */}
                                    <div
                                        className={cn(
                                            'relative z-10 mt-5 inline-flex items-center gap-1 text-sm font-extrabold transition-all',
                                            idx % 2 === 0
                                                ? 'text-[#00a0e3] group-hover:text-[#00a0e3] dark:text-blue-400 dark:group-hover:text-blue-400'
                                                : 'text-[#ef7f1a] group-hover:text-[#ef7f1a] dark:text-orange-400 dark:group-hover:text-orange-400'
                                        )}>
                                        Batafsil
                                        <ChevronRight
                                            size={16}
                                            className='transition-transform group-hover:translate-x-1'
                                        />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Mobile CTA */}
                <motion.div
                    className='mt-8 flex justify-center md:hidden'
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}>
                    <Link
                        href='/services'
                        className='inline-flex transform items-center gap-2 rounded-full bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:from-blue-600 dark:to-orange-600'>
                        Hammasini ko'rish
                        <ChevronRight size={18} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};
