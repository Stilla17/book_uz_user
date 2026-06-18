'use client';

import { useMemo } from 'react';

import Link from 'next/link';

import PublisherCard from '@/components/cards/PublisherCard';
import { ClientService } from '@/services/api';
import { FETCH_PAGINATION_LIMIT } from '@/tools';
import { useQuery } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import { Building2, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PREVIEW_PUBLISHERS_LIMIT = 6;
const Publishers = () => {
    const { t } = useTranslation();

    const { data } = useQuery({
        queryKey: ['publishers-preview'],
        queryFn: () => ClientService.getPublishers({ page: 1, limit: FETCH_PAGINATION_LIMIT })
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
        <section className='bg-background relative overflow-hidden py-16 dark:bg-slate-900'>
            <div className='relative z-10 container mx-auto px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className='mb-10 flex flex-col items-center gap-4 md:flex-row md:justify-between'>
                    <div className='flex max-w-2xl gap-4'>
                        <span className={`h-9 w-1 shrink-0 rounded-full bg-[#ef7f1a]/30`} />
                        <h2 className='text-3xl font-black tracking-tight text-slate-900 md:text-4xl dark:text-white'>
                            {t('publish.label')}
                        </h2>
                    </div>
                    {totalPublishers > PREVIEW_PUBLISHERS_LIMIT ? (
                        <div className='flex justify-center'>
                            <Link
                                href='/publishers'
                                className='group flex items-center rounded-full bg-[#ef7f1a]/10 px-5 py-2.5 text-sm font-bold text-[#ef7f1a] transition-all hover:shadow-md md:text-base dark:bg-orange-500/20 dark:text-orange-400'>
                                Barchasini ko'rish
                                <ChevronRight size={18} />
                            </Link>
                        </div>
                    ) : null}
                </motion.div>

                <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
                    {publishers.map((pub, index) => {
                        const visibleClass =
                            index < 2 ? '' : index < 4 ? 'hidden md:block' : index < 6 ? 'hidden xl:block' : 'hidden';

                        return <PublisherCard key={pub._id} publisher={pub} className={visibleClass} />;
                    })}
                </div>
            </div>
        </section>
    );
};

export default Publishers;
