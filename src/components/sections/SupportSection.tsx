'use client';

import React, { useState } from 'react';

import MiniCard from '@/components/shared/MiniCard';
import { supportStats } from '@/data/support';
import { useFaq } from '@/hooks/faqsHooks/useFaq';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Clock, Mail, MessageCircle, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type LocalizedText = {
    uz?: string;
    ru?: string;
    en?: string;
};

type FaqItem = {
    _id?: string;
    question: LocalizedText;
    answer: LocalizedText;
};

const contact = [
    {
        icon: <Phone size={18} />,
        title: 'Telefon',
        val: '+998 71 200-99-99',
        sub: "Bepul qo'ng'iroq",
        color: 'blue'
    },
    {
        icon: <Mail size={18} />,
        title: 'Email',
        val: 'support@book.uz',
        sub: '24/7',
        color: 'orange'
    },
    {
        icon: <MessageCircle size={18} />,
        title: 'Telegram',
        val: '@bookuz_bot',
        sub: 'Online',
        color: 'blue'
    },
    {
        icon: <Clock size={18} />,
        title: 'Ish vaqti',
        val: '09:00 - 22:00',
        sub: 'Dushanba-Yakshanba',
        color: 'orange'
    }
];

export const SupportSection = () => {
    const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'chat'>('faq');
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const { i18n } = useTranslation();
    const { data, isError, isLoading } = useFaq();
    const currentLanguage = (i18n.language?.split('-')[0] || 'uz') as keyof LocalizedText;
    const responseData = data?.data ?? data;
    const faqs: FaqItem[] = Array.isArray(responseData?.faqs)
        ? responseData.faqs
        : Array.isArray(responseData)
          ? responseData
          : [];

    const getLocalizedText = (value: LocalizedText) => {
        return value?.[currentLanguage] || value?.uz || value?.ru || value?.en || '';
    };

    return (
        <section className='relative overflow-hidden py-12 dark:bg-slate-900'>
            <div className='relative z-10 container mx-auto max-w-6xl px-4'>
                {/* Header */}
                <div className='mb-10 text-center'>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className='mb-2 text-3xl font-black md:text-4xl'>
                        <span className='text-[#00a0e3] dark:text-blue-400'>Sizga qanday</span>{' '}
                        <span className='text-[#ef7f1a] dark:text-orange-400'>yordam bera olamiz?</span>
                    </motion.h2>
                </div>

                {/* Quick Stats */}
                <MiniCard items={supportStats} initialDelay={0} itemDelayStep={0.05} />

                {/* Support Tabs */}
                <div className='mx-auto mb-8 flex max-w-xs rounded-xl bg-gray-100 p-1 dark:bg-slate-700'>
                    {[
                        { id: 'faq', label: 'FAQ' },
                        { id: 'contact', label: 'Aloqa' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`relative flex-1 rounded-lg py-2.5 text-xs font-bold transition-all ${
                                activeTab === tab.id ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId='activeSupportTab'
                                    className='absolute inset-0 rounded-lg bg-[#ef7f1a] dark:from-blue-600 dark:to-orange-600'
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                />
                            )}
                            <span className='relative z-10'>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Dynamic Content */}
                <div className='mx-auto min-h-[350px] max-w-3xl'>
                    <AnimatePresence mode='wait'>
                        {activeTab === 'faq' && (
                            <motion.div
                                key='faq'
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className='space-y-2'>
                                {isLoading ? (
                                    Array.from({ length: 4 }).map((_, index) => (
                                        <div
                                            key={index}
                                            className='h-16 animate-pulse rounded-xl border border-gray-100 bg-white dark:border-slate-700 dark:bg-slate-800'>
                                            <div className='m-4 h-4 rounded-full bg-gray-100 dark:bg-slate-700' />
                                        </div>
                                    ))
                                ) : isError ? (
                                    <div className='rounded-xl border border-red-100 bg-red-50 p-4 text-center text-sm font-bold text-red-500 dark:border-red-500/20 dark:bg-red-500/10'>
                                        FAQ ma'lumotlarini yuklashda xatolik yuz berdi.
                                    </div>
                                ) : faqs.length === 0 ? (
                                    <div className='rounded-xl border border-gray-100 bg-white p-6 text-center text-sm font-bold text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-400'>
                                        Hozircha FAQ savollari mavjud emas.
                                    </div>
                                ) : (
                                    faqs.map((f, i) => (
                                        <motion.div
                                            layout
                                            key={f._id ?? i}
                                            transition={{ duration: 0.22, ease: 'easeOut' }}
                                            className='overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-slate-700 dark:bg-slate-800'>
                                            <button
                                                type='button'
                                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                                className='flex w-full items-center justify-between gap-4 p-4 text-left'>
                                                <span className='text-sm font-bold text-gray-800 dark:text-gray-200'>
                                                    {getLocalizedText(f.question)}
                                                </span>
                                                <div
                                                    className={`shrink-0 rounded-full p-1.5 transition-all ${
                                                        openFaq === i
                                                            ? 'bg-[#ef7f1a] text-white dark:bg-orange-600'
                                                            : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-400'
                                                    }`}>
                                                    <ChevronDown
                                                        size={14}
                                                        className={`transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                                                    />
                                                </div>
                                            </button>
                                            <AnimatePresence initial={false}>
                                                {openFaq === i && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.22, ease: 'easeOut' }}
                                                        className='overflow-hidden border-t border-gray-50 dark:border-slate-700'>
                                                        <div className='px-4 pt-2 pb-4 text-xs leading-5 text-gray-500 dark:text-gray-400'>
                                                            {getLocalizedText(f.answer)}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'contact' && (
                            <motion.div
                                key='contact'
                                className='grid grid-cols-1 gap-3 md:grid-cols-2'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}>
                                {contact.map((c, i) => (
                                    <div
                                        key={i}
                                        className='group rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-[#00a0e3]/20 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500/30'>
                                        <div
                                            className={`flex items-center gap-3 ${
                                                c.color === 'blue'
                                                    ? 'text-[#00a0e3] dark:text-blue-400'
                                                    : 'text-[#ef7f1a] dark:text-orange-400'
                                            } mb-2`}>
                                            {c.icon}
                                            <span className='text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500'>
                                                {c.title}
                                            </span>
                                        </div>
                                        <div className='ml-9 text-sm font-black text-gray-900 dark:text-white'>
                                            {c.val}
                                        </div>
                                        <div className='mt-1 ml-9 text-[10px] text-gray-400 dark:text-gray-500'>
                                            {c.sub}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom Support Link */}
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className='text-center'>
                    <a
                        href='tel:+998901234567'
                        className='inline-flex items-center gap-2 text-xs text-gray-500 transition-colors hover:text-[#00a0e3] dark:text-gray-400 dark:hover:text-blue-400'>
                        <Phone size={14} />
                        <span>+998 (90) 123-45-67</span>
                        <ChevronRight size={14} />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};
