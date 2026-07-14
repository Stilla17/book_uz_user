'use client';

import { useEffect, useState } from 'react';

import PublisherCard from '@/components/cards/PublisherCard';
import BreadCrumb from '@/components/shared/BreadCrumb';
import { Pagination } from '@/components/shared/Pagination';
import { ClientService } from '@/services/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PUBLISHERS_PER_PAGE = 12;

const PublishersPage = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['publishers', page, PUBLISHERS_PER_PAGE],
        queryFn: () => ClientService.getPublishers({ page, limit: PUBLISHERS_PER_PAGE }),
        placeholderData: (previousData) => previousData,
        staleTime: 5 * 60 * 1000
    });

    const publishers = data?.publishers ?? [];
    const totalPublishers = data?.pagination.total ?? publishers.length;
    const totalPages = Math.max(1, data?.pagination.pages ?? 1);
    const currentPage = Math.min(page, totalPages);

    useEffect(() => {
        if (!data || page >= totalPages) return;

        queryClient.prefetchQuery({
            queryKey: ['publishers', page + 1, PUBLISHERS_PER_PAGE],
            queryFn: () => ClientService.getPublishers({ page: page + 1, limit: PUBLISHERS_PER_PAGE }),
            staleTime: 5 * 60 * 1000
        });
    }, [data, page, queryClient, totalPages]);

    const handlePageChange = (nextPage: number) => {
        setPage(nextPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className='min-h-screen py-6 dark:bg-slate-900'>
            <div className='container mx-auto px-4'>
                <BreadCrumb
                    items={[
                        {
                            label: t('publish.title')
                        }
                    ]}
                />

                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-8 rounded-2xl border border-orange-100 bg-[#fff9f3] p-6 dark:border-slate-700 dark:bg-slate-800'>
                    <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-[#ef7f1a]/20 bg-[#ef7f1a]/10 px-4 py-2 text-xs font-black tracking-[0.18em] text-[#ef7f1a] uppercase dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-300'>
                        <Building2 size={14} />
                        {t('publish.title')}
                    </div>
                    <h1 className='text-3xl font-black tracking-tight text-slate-900 md:text-4xl dark:text-white'>
                        {t('publishersPage.allPublishers')}
                    </h1>
                    <p className='mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base dark:text-slate-300'>
                        {t('publishersPage.description')}
                    </p>
                </motion.section>

                {isLoading ? (
                    <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className='h-58 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
                            />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className='mb-5 flex items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400'>
                            <span>{t('publishersPage.totalPublishers', { count: totalPublishers })}</span>
                            <span>{t('publishersPage.pageCount', { current: currentPage, total: totalPages })}</span>
                        </div>

                        <div
                            className={`grid gap-4 transition-opacity md:grid-cols-2 xl:grid-cols-3 ${
                                isFetching ? 'opacity-60' : 'opacity-100'
                            }`}>
                            {publishers.map((publisher) => (
                                <PublisherCard key={publisher._id} publisher={publisher} />
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            className='mt-8'
                        />
                    </>
                )}
            </div>
        </main>
    );
};

export default PublishersPage;
