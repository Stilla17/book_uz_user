'use client';

import { useMemo, useState } from 'react';

import PublisherCard from '@/components/cards/PublisherCard';
import BreadCrumb from '@/components/shared/BreadCrumb';
import { Pagination } from '@/components/shared/Pagination';
import { ClientService } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

const PUBLISHERS_PER_PAGE = 12;
const FETCH_PUBLISHERS_LIMIT = 100;

const PublishersPage = () => {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['publishers', FETCH_PUBLISHERS_LIMIT],
        queryFn: () => ClientService.getPublishers({ page: 1, limit: FETCH_PUBLISHERS_LIMIT })
    });

    const sortedPublishers = useMemo(
        () =>
            [...(data?.publishers ?? [])].sort(
                (firstPublisher, secondPublisher) => secondPublisher.booksCount - firstPublisher.booksCount
            ),
        [data?.publishers]
    );
    const totalPublishers = data?.pagination.total ?? sortedPublishers.length;
    const totalPages = Math.max(1, Math.ceil(sortedPublishers.length / PUBLISHERS_PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const publishers = useMemo(() => {
        const startIndex = (currentPage - 1) * PUBLISHERS_PER_PAGE;

        return sortedPublishers.slice(startIndex, startIndex + PUBLISHERS_PER_PAGE);
    }, [currentPage, sortedPublishers]);

    const handlePageChange = (nextPage: number) => {
        setPage(nextPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className='min-h-screen bg-background py-6 dark:bg-slate-900'>
            <div className='container mx-auto px-4'>
                <BreadCrumb
                    items={[
                        {
                            label: 'Nashriyotlar'
                        }
                    ]}
                />

                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-8 rounded-2xl border border-orange-100 bg-[#fff9f3] p-6 dark:border-slate-700 dark:bg-slate-800'>
                    <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-[#ef7f1a]/20 bg-[#ef7f1a]/10 px-4 py-2 text-xs font-black tracking-[0.18em] text-[#ef7f1a] uppercase dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-300'>
                        <Building2 size={14} />
                        Nashriyotlar
                    </div>
                    <h1 className='text-3xl font-black tracking-tight text-slate-900 md:text-4xl dark:text-white'>
                        Barcha nashriyotlar
                    </h1>
                    <p className='mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base dark:text-slate-300'>
                        Kitoblar katalogidagi nashriyotlarni ko'ring va ularning kitoblari sonini solishtiring.
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
                            <span>{totalPublishers} ta nashriyot</span>
                            <span>
                                {currentPage} / {totalPages} sahifa
                            </span>
                        </div>

                        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
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
