'use client';

import { useState } from 'react';

import PublisherCard from '@/components/cards/PublisherCard';
import BreadCrumb from '@/components/shared/BreadCrumb';
import { Pagination } from '@/components/shared/Pagination';
import { ClientService } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

const PUBLISHERS_PER_PAGE = 12;

const PublishersPage = () => {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['publishers', page, PUBLISHERS_PER_PAGE],
        queryFn: () => ClientService.getPublishers({ page, limit: PUBLISHERS_PER_PAGE })
    });

    const publishers = data?.publishers ?? [];
    const pagination = data?.pagination ?? {
        page,
        limit: PUBLISHERS_PER_PAGE,
        total: publishers.length,
        totalPages: 1
    };
    const totalPages = Math.max(1, pagination.totalPages);
    const currentPage = Math.min(page, totalPages);

    const handlePageChange = (nextPage: number) => {
        setPage(nextPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className='min-h-screen bg-gradient-to-b from-white to-slate-50 py-6 dark:from-slate-900 dark:to-slate-950'>
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
                            <span>{pagination.total} ta nashriyot</span>
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
