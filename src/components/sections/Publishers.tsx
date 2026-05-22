'use client';

import { useMemo } from 'react';
import Link from 'next/link';

import PublisherCard from '@/components/cards/PublisherCard';
import { ClientService } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import { Building2, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PREVIEW_PUBLISHERS_LIMIT = 6;
const FETCH_PUBLISHERS_LIMIT = 100;

const Publishers = () => {
    const { t } = useTranslation();

    const { data } = useQuery({
        queryKey: ['publishers-preview'],
        queryFn: () => ClientService.getPublishers({ page: 1, limit: FETCH_PUBLISHERS_LIMIT })
    });
    const publishers = useMemo(
        () =>
            [...(data?.publishers ?? [])]
                .sort((firstPublisher, secondPublisher) => secondPublisher.booksCount - firstPublisher.booksCount)
                .slice(0, PREVIEW_PUBLISHERS_LIMIT),
        [data?.publishers]
    );
    const totalPublishers = data?.pagination.total ?? publishers.length;

    return (
        <section className='relative overflow-hidden bg-background py-16 dark:bg-slate-900'>
            <div className='brand-grid pointer-events-none absolute inset-0 opacity-80' />

            <div className='relative z-10 container mx-auto px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className='mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
                    <div className='max-w-2xl'>
                        <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-[#ef7f1a]/20 bg-[#ef7f1a]/10 px-4 py-2 text-xs font-black tracking-[0.18em] text-[#ef7f1a] uppercase dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-300'>
                            <Building2 size={14} />
                            {t('publish.title')}
                        </div>
                        <h2 className='text-3xl font-black tracking-tight text-slate-900 md:text-4xl dark:text-white'>
                            {t('publish.label')}
                        </h2>
                        <p className='mt-3 max-w-xl text-sm leading-6 text-slate-600 md:text-base dark:text-slate-300'>
                            {t('publish.desc')}
                        </p>
                    </div>
                </motion.div>

                <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
                    {publishers.map((pub, index) => {
                        const visibleClass =
                            index < 2
                                ? ''
                                : index < 4
                                  ? 'hidden md:block'
                                  : index < 6
                                    ? 'hidden xl:block'
                                    : 'hidden';

                        return <PublisherCard key={pub._id} publisher={pub} className={visibleClass} />;
                    })}
                </div>

                {totalPublishers > PREVIEW_PUBLISHERS_LIMIT ? (
                    <div className='mt-8 flex justify-center'>
                        <Link
                            href='/publishers'
                            className='inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ef7f1a] px-6 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-[#d96f12] dark:shadow-none'>
                            Barchasini ko'rish
                            <ChevronRight size={18} />
                        </Link>
                    </div>
                ) : null}
            </div>
        </section>
    );
};

export default Publishers;
