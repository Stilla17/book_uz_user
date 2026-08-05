'use client';

import { useState } from 'react';

import Link from 'next/link';

import BreadCrumb from '@/components/shared/BreadCrumb';
import { Pagination } from '@/components/shared/Pagination';
import { useAllAuthorsQuery } from '@/hooks/queries/useAuthorQueries';
import type { AuthorItems } from '@/types/author.types';
import { getImageUrl } from '@/utils/image';
import { paginateCollection } from '@/utils/paginated-collection';

import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AUTHORS_PER_PAGE = 12;
const AUTHOR_FALLBACK_IMAGE = '/images/unUser.png';

const AuthorsPage = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);

    const {
        data: allAuthors = [],
        isLoading,
        isFetching
    } = useAllAuthorsQuery();

    const {
        items: authors,
        total: totalAuthors,
        totalPages,
        currentPage
    } = paginateCollection(allAuthors, page, AUTHORS_PER_PAGE);

    const handlePageChange = (nextPage: number) => {
        setPage(nextPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className='min-h-screen py-6 dark:bg-slate-900'>
            <div className='container mx-auto px-4'>
                <BreadCrumb items={[{ label: t('authorsSection.title') }]} />

                {isLoading ? (
                    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className='h-72 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
                            />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className='mb-5 flex items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400'>
                            <span>{t('authorsPage.totalAuthors', { count: totalAuthors })}</span>
                            <span>{t('authorsPage.pageCount', { current: currentPage, total: totalPages })}</span>
                        </div>

                        {authors.length ? (
                            <div
                                className={`grid gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
                                    isFetching ? 'opacity-60' : 'opacity-100'
                                }`}>
                                {authors.map((author) => (
                                    <AuthorCard key={author._id} author={author} />
                                ))}
                            </div>
                        ) : (
                            <div className='rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400'>
                                {t('authorsPage.empty')}
                            </div>
                        )}

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

const AuthorCard = ({ author }: { author: AuthorItems }) => {
    const { t } = useTranslation();

    return (
        <motion.article
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className='group overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_18px_50px_-26px_rgba(15,23,42,0.45)] transition-all hover:-translate-y-1 hover:border-[#ef7f1a]/40 dark:border-slate-700 dark:bg-slate-900'>
            <div className='flex h-48 items-center justify-center bg-slate-50 p-5 dark:bg-slate-800'>
                <img
                    src={getImageUrl(author.image) || AUTHOR_FALLBACK_IMAGE}
                    alt={author.name}
                    className='size-36 rounded-full object-cover shadow-sm transition-transform duration-300 group-hover:scale-105'
                />
            </div>

            <div className='p-5'>
                <h2 className='truncate text-lg font-black text-slate-900 dark:text-white'>{author.name}</h2>

                <div className='mt-3 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300'>
                    <BookOpen size={16} className='text-[#ef7f1a]' />
                    <span>{t('authorsSection.booksCount', { count: author.booksCount ?? 0 })}</span>
                </div>

                <Link
                    href={`/catalog?author=${encodeURIComponent(author._id)}`}
                    className='mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-sm font-bold text-[#005CB9] dark:border-slate-700 dark:text-blue-300'>
                    {t('authorsPage.viewBooks')}
                    <ChevronRight size={17} />
                </Link>
            </div>
        </motion.article>
    );
};

export default AuthorsPage;
