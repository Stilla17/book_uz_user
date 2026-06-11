'use client';

import { useEffect, useMemo, useState } from 'react';

import { useParams } from 'next/navigation';

import { BookCard } from '@/components/cards/BookCard';
import { BookCardSkeleton } from '@/components/cards/BookCardSkeleton';
import BreadCrumb from '@/components/shared/BreadCrumb';
import { Pagination } from '@/components/shared/Pagination';
import { mapProductToCardBook } from '@/helpers/publishers';
import { ClientService } from '@/services/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import { Building2, Search } from 'lucide-react';

const PAGE_LIMIT = 12;

const PublisherBooksPage = () => {
    const params = useParams();
    const slug = params?.slug as string;
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['publisher-products', slug, page, PAGE_LIMIT],
        queryFn: () => ClientService.getPublisherProducts(slug, { page, limit: PAGE_LIMIT }),
        enabled: Boolean(slug),
        placeholderData: (previousData) => previousData,
        staleTime: 5 * 60 * 1000
    });

    const publisher = data?.publisher;
    const products = data?.products ?? [];
    const books = useMemo(() => products.map(mapProductToCardBook), [products]);
    const pagination = data?.pagination ?? { page, limit: PAGE_LIMIT, total: 0, pages: 1 };
    const totalPages = Math.max(1, pagination.pages);
    const currentPage = Math.min(page, totalPages);

    useEffect(() => {
        if (!slug || !data || page >= totalPages) return;

        queryClient.prefetchQuery({
            queryKey: ['publisher-products', slug, page + 1, PAGE_LIMIT],
            queryFn: () => ClientService.getPublisherProducts(slug, { page: page + 1, limit: PAGE_LIMIT }),
            staleTime: 5 * 60 * 1000
        });
    }, [data, page, queryClient, slug, totalPages]);

    const handlePageChange = (nextPage: number) => {
        setPage(nextPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className='bg-background min-h-screen py-6 dark:bg-slate-900'>
            <div className='container mx-auto px-4'>
                <BreadCrumb
                    items={[
                        {
                            label: 'Nashriyotlar',
                            path: '/publishers'
                        },
                        {
                            label: publisher?.name || 'Nashriyot kitoblari'
                        }
                    ]}
                />

                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-8 rounded-2xl border border-orange-100 bg-[#fff9f3] p-6 dark:border-slate-700 dark:bg-slate-800'>
                    <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-[#ef7f1a]/20 bg-[#ef7f1a]/10 px-4 py-2 text-xs font-black tracking-[0.18em] text-[#ef7f1a] uppercase dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-300'>
                        <Building2 size={14} />
                        Nashriyot
                    </div>
                    <h1 className='text-3xl font-black tracking-tight text-slate-900 md:text-4xl dark:text-white'>
                        {publisher?.name || 'Nashriyot kitoblari'}
                    </h1>
                    <p className='mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base dark:text-slate-300'>
                        {pagination.total} ta kitob topildi
                    </p>
                </motion.section>

                {isLoading ? (
                    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <BookCardSkeleton key={index} />
                        ))}
                    </div>
                ) : books.length ? (
                    <>
                        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-6'>
                            {books.map((book) => (
                                <BookCard key={book._id} book={book} slug={book.slug} />
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            className='mt-8'
                        />
                    </>
                ) : (
                    <div className='rounded-[1.75rem] border border-dashed border-slate-300 bg-white/90 p-10 text-center dark:border-slate-700 dark:bg-slate-900/85'>
                        <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'>
                            <Search size={28} />
                        </div>
                        <h3 className='mt-4 text-xl font-bold text-slate-900 dark:text-white'>Kitob topilmadi</h3>
                        <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>
                            Bu nashriyotga tegishli kitoblar hozircha mavjud emas.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default PublisherBooksPage;
