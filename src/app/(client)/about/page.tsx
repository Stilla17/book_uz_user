'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import { useBranchUserQuery } from '@/components/admin/hooks/queries/branch';
import { BranchMap } from '@/components/map/Map';
import MiniCard from '@/components/shared/MiniCard';
import { Button } from '@/components/ui/button';
import { statistics, timelineEvents, values } from '@/data/about';
import { useBookCount } from '@/hooks/bookHooks/useBookCount';

import { AnimatePresence, motion } from 'framer-motion';
import {
    BookOpen,
    Clock,
    Eye,
    Facebook,
    Heart,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Sparkles,
    Target,
    Twitter,
    Youtube
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage ?? i18n.language;
    const tabs: Array<{ id: 'values' | 'history'; label: string; icon: React.ReactNode }> = [
        { id: 'history', label: t('aboutPage.tabs.history'), icon: <Clock size={18} /> },
        { id: 'values', label: t('aboutPage.tabs.values'), icon: <Heart size={18} /> }
    ];
    const [activeTab, setActiveTab] = useState<'history' | 'values'>('history');
    const [focusRequest, setFocusRequest] = useState<{ name: string; id: number } | null>(null);
    const { data: apiBranches = [] } = useBranchUserQuery();
    const branches = apiBranches
        .map((branch) => ({
            name: branch.branchName ?? branch.name ?? t('aboutPage.branchFallback'),
            coords: [Number(branch.latitude), Number(branch.longitude)] as [number, number]
        }))
        .filter((branch) => Number.isFinite(branch.coords[0]) && Number.isFinite(branch.coords[1]));
    const { data: book } = useBookCount();
    const booksCount = book?.pagination?.total ?? 0;
    const statisticKeys = ['books', 'users', 'rating', 'branches'] as const;
    const aboutStatistics = statistics.map((item, index) => {
        if (index === 0) {
            return {
                ...item,
                value: `${booksCount.toLocaleString(language)}+`,
                label: t(`aboutPage.statistics.${statisticKeys[index]}`)
            };
        }

        if (index === 3) {
            return {
                ...item,
                value: `${branches.length}+`,
                label: t(`aboutPage.statistics.${statisticKeys[index]}`)
            };
        }

        return { ...item, label: t(`aboutPage.statistics.${statisticKeys[index]}`) };
    });
    const localizedValues = values.map((value) => ({
        ...value,
        title: language.startsWith('ru') ? value.titleRu : language.startsWith('en') ? value.titleEn : value.title,
        description: language.startsWith('ru')
            ? value.descriptionRu
            : language.startsWith('en')
              ? value.descriptionEn
              : value.description
    }));
    const localizedTimelineEvents = timelineEvents.map((event) => ({
        ...event,
        title: language.startsWith('ru') ? event.titleRu : language.startsWith('en') ? event.titleEn : event.title,
        description: language.startsWith('ru')
            ? event.descriptionRu
            : language.startsWith('en')
              ? event.descriptionEn
              : event.description
    }));

    return (
        <div className='relative min-h-screen overflow-hidden py-12 dark:bg-slate-900'>
            <div className='relative z-10 container mx-auto max-w-7xl px-4'>
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-16 text-center'>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className='mb-6 inline-flex items-center gap-2 rounded-full border border-[#00a0e3]/25 bg-white/85 px-6 py-2 shadow-[0_14px_40px_-28px_rgba(0,160,227,0.75)] backdrop-blur dark:border-[#ef7f1a]/35 dark:bg-slate-900/80'>
                        <span className='grid h-7 w-7 place-items-center rounded-full bg-[#00a0e3]/10 text-[#00a0e3] dark:bg-[#ef7f1a]/15 dark:text-[#ef7f1a]'>
                            <Sparkles size={15} />
                        </span>
                        <span className='text-sm font-black tracking-wide text-[#005CB9] dark:text-orange-200'>
                            {t('aboutPage.badge')}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className='mb-6 text-3xl font-black sm:text-5xl md:text-7xl'>
                        <span className='bg-[#ef7f1a] bg-clip-text text-transparent'>
                            {t('aboutPage.hero.titleFirst')}
                        </span>
                        <br />
                        <span className='text-gray-900 dark:text-white'>{t('aboutPage.hero.titleSecond')}</span>
                    </motion.h1>

                    <p className='mx-auto max-w-3xl text-base leading-7 text-gray-500 sm:text-xl dark:text-gray-400'>
                        {t('aboutPage.hero.description', { count: booksCount.toLocaleString(language) })}
                    </p>

                    {/* CTA Buttons with new colors */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className='mt-8 flex flex-col justify-center gap-4 sm:flex-row'>
                        <Link href='/catalog'>
                            <Button className='group rounded-xl border border-[#ef7f1a]/20 bg-[#ef7f1a] px-8 py-6 text-lg font-black text-white shadow-[0_18px_44px_-26px_rgba(239,127,26,0.95)] transition-all hover:-translate-y-0.5 dark:border-orange-300/20 dark:bg-[#ef7f1a]'>
                                <BookOpen size={20} className='mr-2' />
                                {t('aboutPage.hero.cta')}
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Statistics Grid */}
                <MiniCard items={aboutStatistics} />

                {/* Tabs with new colors */}
                <div className='mb-8'>
                    <div className='flex flex-wrap justify-center gap-3 sm:gap-4'>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all ${
                                    activeTab === tab.id
                                        ? 'scale-105 bg-[#ef7f1a] text-white shadow-lg'
                                        : 'border border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-300'
                                }`}>
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode='wait'>
                    {/* Values Tab */}
                    {activeTab === 'values' && (
                        <motion.div
                            key='values'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className='mb-20'>
                            <h2 className='mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white'>
                                {t('aboutPage.valuesTitleBefore')}{' '}
                                <span className='bg-[#ef7f1a] bg-clip-text text-transparent'>
                                    {t('aboutPage.valuesTitleHighlight')}
                                </span>
                            </h2>

                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                {localizedValues.map((value, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className={`rounded-2xl border`}>
                                        <div className='h-full rounded-2xl bg-white p-6 dark:bg-slate-800'>
                                            <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-[#ef7f1a]/20 bg-[#ef7f1a]/10 text-[#ef7f1a] dark:border-orange-400/30 dark:bg-orange-500/20 dark:text-orange-300'>
                                                {value.icon}
                                            </div>
                                            <h3 className='mb-2 text-xl font-bold text-gray-900 dark:text-white'>
                                                {value.title}
                                            </h3>
                                            <p className='text-gray-600 dark:text-gray-400'>{value.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <motion.div
                            key='history'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className='mb-20'>
                            <h2 className='mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white'>
                                {t('aboutPage.historyTitleBefore')}{' '}
                                <span className='bg-[#ef7f1a] bg-clip-text text-transparent'>
                                    {t('aboutPage.historyTitleHighlight')}
                                </span>
                            </h2>

                            <div className='relative'>
                                {/* Timeline Line */}
                                <div className='absolute left-1/2 hidden h-full w-1 -translate-x-1/2 transform bg-[#999999] md:block' />

                                {localizedTimelineEvents.map((event, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`relative mb-12 flex flex-col items-center md:flex-row ${
                                            index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}>
                                        {/* Year Badge */}
                                        <div className='flex justify-center md:w-1/2 md:justify-end md:pr-12'>
                                            <div
                                                className={`rounded-2xl border border-[#ef7f1a]/20 bg-[#ef7f1a] p-8 text-center shadow-lg shadow-orange-500/15 ${
                                                    index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
                                                }`}>
                                                <span className='text-4xl font-black text-white'>{event.year}</span>
                                            </div>
                                        </div>

                                        {/* Timeline Dot */}
                                        <div className='absolute left-1/2 hidden h-8 w-8 -translate-x-1/2 transform items-center justify-center rounded-full border border-4 bg-white md:flex dark:bg-slate-800'>
                                            <div className='h-4 w-4 rounded-full bg-[#ef7f1a]' />
                                        </div>

                                        {/* Content */}
                                        <div className='mt-4 md:mt-0 md:w-1/2 md:pl-12'>
                                            <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800'>
                                                <div className='mb-3 flex items-center gap-3'>
                                                    <div className='flex h-10 w-10 items-center justify-center rounded-full border border-[#ef7f1a]/20 bg-[#ef7f1a]/10 text-[#ef7f1a] dark:border-orange-400/30 dark:bg-orange-500/20 dark:text-orange-300'>
                                                        {event.icon}
                                                    </div>
                                                    <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                                                        {event.title}
                                                    </h3>
                                                </div>
                                                <p className='text-gray-600 dark:text-gray-400'>{event.description}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mission & Vision with new colors */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className='mb-20 grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div className='rounded-2xl border p-8'>
                        <Target size={40} className='mb-4 text-[#00a0e3]' />
                        <h3 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                            {t('aboutPage.mission.title')}
                        </h3>
                        <p className='text-lg leading-relaxed text-gray-600 dark:text-gray-400'>
                            {t('aboutPage.mission.description')}
                        </p>
                    </div>

                    <div className='rounded-2xl border p-8'>
                        <Eye size={40} className='mb-4 text-[#ef7f1a]' />
                        <h3 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                            {t('aboutPage.vision.title')}
                        </h3>
                        <p className='text-lg leading-relaxed text-gray-600 dark:text-gray-400'>
                            {t('aboutPage.vision.description')}
                        </p>
                    </div>
                </motion.div>

                {/* Contact Info with new colors */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className='flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between'>
                    <div className='flex w-full flex-col gap-8 sm:gap-12 lg:w-auto'>
                        <div className='flex gap-4'>
                            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#00a0e3]/10 text-[#00a0e3]'>
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className='mb-2 font-bold text-gray-900 dark:text-white'>
                                    {t('aboutPage.contact.addressTitle')}
                                </h3>
                                <p className='text-gray-500 dark:text-gray-400'>
                                    {t('aboutPage.contact.addressLineOne')}
                                    <br />
                                    {t('aboutPage.contact.addressLineTwo')}
                                </p>
                            </div>
                        </div>

                        <div className='flex gap-4'>
                            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#ef7f1a]/10 text-[#ef7f1a]'>
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className='mb-2 font-bold text-gray-900 dark:text-white'>
                                    {t('aboutPage.contact.phone')}
                                </h3>
                                <a
                                    href='tel:+998712300050'
                                    className='text-gray-500 transition-colors hover:text-[#00a0e3] dark:text-gray-400'>
                                    +998(71) 230-00-50
                                </a>
                            </div>
                        </div>

                        <div className='flex gap-4'>
                            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 text-[#00a0e3]'>
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className='mb-2 font-bold text-gray-900 dark:text-white'>
                                    {t('aboutPage.contact.email')}
                                </h3>
                                <a
                                    href='mailto:info@book.uz'
                                    className='text-gray-500 transition-colors hover:text-[#00a0e3] dark:text-gray-400'>
                                    info@book.uz
                                </a>
                            </div>
                        </div>

                        {/* Social Links with new colors */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.3 }}
                            className='mt-6 flex flex-wrap justify-start gap-3 sm:mt-12 sm:gap-4'>
                            {[
                                { icon: <Facebook size={20} />, href: '#', label: 'Facebook' },
                                { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
                                { icon: <Instagram size={20} />, href: '#', label: 'Instagram' },
                                { icon: <Youtube size={20} />, href: '#', label: 'YouTube' },
                                { icon: <Linkedin size={20} />, href: '#', label: 'LinkedIn' }
                            ].map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-[#00a0e3] hover:text-white dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-[#ef7f1a]'
                                    title={social.label}>
                                    {social.icon}
                                </motion.a>
                            ))}
                        </motion.div>
                    </div>

                    <div className='w-full lg:w-1/2'>
                        <div className='relative overflow-hidden rounded-[2rem] border border-[#00a0e3]/20 bg-white/80 p-5 shadow-xl backdrop-blur-sm dark:border-[#00a0e3]/30 dark:bg-slate-800/70'>
                            <div className='mb-4 flex items-center justify-between'>
                                <h3 className='text-xl font-black text-gray-900 dark:text-white'>
                                    {t('aboutPage.map.branches', { count: branches.length })}
                                </h3>
                                <span className='rounded-full bg-[#ef7f1a]/10 px-3 py-1 text-xs font-bold text-[#ef7f1a] dark:bg-orange-500/20 dark:text-orange-300'>
                                    {t('aboutPage.map.country')}
                                </span>
                            </div>

                            <div className='h-90 w-full overflow-hidden rounded-2xl'>
                                {branches.length ? (
                                    <BranchMap focusRequest={focusRequest} branches={branches} />
                                ) : (
                                    <div className='grid h-full place-items-center bg-gray-100 text-center text-sm font-bold text-gray-500 dark:bg-slate-900 dark:text-slate-400'>
                                        {t('aboutPage.map.empty')}
                                    </div>
                                )}
                            </div>

                            <div className='mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3'>
                                {branches.map((branch) => (
                                    <button
                                        type='button'
                                        key={`legend-${branch.name}`}
                                        onClick={() => setFocusRequest({ name: branch.name, id: Date.now() })}
                                        className='flex min-w-0 items-center gap-2 rounded-lg bg-gray-100 px-2 py-1 text-left text-gray-700 transition hover:bg-[#ef7f1a]/15 dark:bg-slate-700/60 dark:text-gray-200 dark:hover:bg-orange-500/20'>
                                        <MapPin size={12} className='fill-[#ef7f1a] text-[#ef7f1a]' />
                                        <span className='truncate font-semibold'>{branch.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
