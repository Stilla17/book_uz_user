'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Pagination, PaginationNextIcon, PaginationPreviousIcon } from '@/components/shared/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { api } from '@/services/api';
import type { NewsItems, NewsResponse } from '@/types/news';
import { getLocalizedText } from '@/utils/book-formatters';
import { getImageUrl } from '@/utils/image';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import dayjs from 'dayjs';
import { ArrowUpRight, Calendar, Eye, Megaphone, Newspaper, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PAGE_LIMIT = 9;
const NEWS_VIEWS_STORAGE_KEY = 'news_views';

const readNewsViews = (): Record<string, number> => {
    if (typeof window === 'undefined') return {};

    try {
        return JSON.parse(localStorage.getItem(NEWS_VIEWS_STORAGE_KEY) || '{}');
    } catch {
        return {};
    }
};

const getNewsViews = (item: NewsItems) => {
    const savedViews = readNewsViews()[item._id] ?? readNewsViews()[item.slug] ?? 0;
    const apiViews = item.views ?? item.viewsCount ?? item.viewCount ?? 0;

    return Math.max(apiViews, savedViews);
};

const getPublicNews = async (page: number, search: string): Promise<NewsResponse> => {
    const response = await api.get('/news', {
        params: {
            active: true,
            page,
            limit: PAGE_LIMIT,
            search
        }
    });

    return response.data.data;
};

const NewsPage = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const queryClient = useQueryClient();
    const debouncedSearch = useDebounce(searchInput, 400).trim();

    const { data, isLoading } = useQuery({
        queryKey: ['public-news', page, debouncedSearch],
        queryFn: () => getPublicNews(page, debouncedSearch),
        placeholderData: (previousData) => previousData,
        staleTime: 5 * 60 * 1000
    });

    const news = data?.news ?? [];
    const pagination = data?.pagination ?? { page: 1, limit: PAGE_LIMIT, total: 0, pages: 1 };

    useEffect(() => {
        if (!data || page >= pagination.pages) return;

        queryClient.prefetchQuery({
            queryKey: ['public-news', page + 1, debouncedSearch],
            queryFn: () => getPublicNews(page + 1, debouncedSearch),
            staleTime: 5 * 60 * 1000
        });
    }, [data, debouncedSearch, page, pagination.pages, queryClient]);

    const handleSearch = (value: string) => {
        setSearchInput(value);
        setPage(1);
    };

    const formatDate = (date?: string) => (date ? dayjs(date).format('DD.MM.YYYY') : '-');

    if (isLoading) {
        return (
            <div className='flex min-h-screen items-center justify-center dark:bg-slate-900'>
                <div className='text-center'>
                    <div className='relative'>
                        <div className='mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-[#00a0e3]/20 border-t-[#00a0e3]' />
                        <Newspaper
                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00a0e3]'
                            size={32}
                        />
                    </div>
                    <p className='animate-pulse text-gray-500 dark:text-gray-400'>{t('newsPage.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <main className='min-h-screen py-12 dark:bg-slate-900'>
            <div className='container mx-auto max-w-7xl px-4'>
                <section className='mb-10 text-center'>
                    <h1 className='mb-4 text-4xl font-black text-[#ef7f1a] md:text-5xl'>{t('newsPage.title')}</h1>

                    <p className='mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400'>
                        {t('newsPage.description')}
                    </p>
                </section>

                <div className='mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                    <label className='relative w-full md:max-w-md'>
                        <Search size={18} className='absolute top-1/2 left-3 -translate-y-1/2 text-gray-400' />
                        <Input
                            value={searchInput}
                            onChange={(event) => handleSearch(event.target.value)}
                            placeholder={t('newsPage.searchPlaceholder')}
                            className='h-12 rounded-xl border-2 border-gray-200 bg-white pr-10 pl-10 focus:border-[#00a0e3] dark:border-gray-700 dark:bg-slate-800'
                        />
                        {searchInput ? (
                            <button
                                type='button'
                                aria-label={t('newsPage.clearSearch')}
                                onClick={() => handleSearch('')}
                                className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                                <X size={16} />
                            </button>
                        ) : null}
                    </label>
                </div>

                {news.length ? (
                    <>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                            {news.map((item: NewsItems) => {
                                const title = getLocalizedText(item.title, t('newsSection.fallbackTitle'));
                                const excerpt = getLocalizedText(item.excerpt || item.description);
                                const imageUrl = getImageUrl(item.image);

                                return (
                                    <Link
                                        key={item._id}
                                        href={`/news/${item.slug}`}
                                        className='group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800'>
                                        <div className='relative h-[210px] w-full overflow-hidden bg-slate-100 dark:bg-slate-900'>
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={title}
                                                    fill
                                                    sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                                                    className='object-cover transition-transform duration-500 group-hover:scale-110'
                                                />
                                            ) : (
                                                <div className='grid h-full place-items-center text-[#ef7f1a]'>
                                                    <Megaphone size={42} />
                                                </div>
                                            )}
                                        </div>

                                        <div className='space-y-3 p-4'>
                                            <div className='flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500'>
                                                <span className='flex items-center gap-1'>
                                                    <Calendar size={12} />
                                                    {formatDate(item.createdAt)}
                                                </span>
                                                <span className='flex items-center gap-1'>
                                                    <Eye size={12} />
                                                    {getNewsViews(item)}
                                                </span>
                                            </div>

                                            <h3 className='line-clamp-2 min-h-14 text-lg leading-snug font-bold text-gray-900 transition-colors group-hover:text-[#00a0e3] dark:text-white dark:group-hover:text-blue-400'>
                                                {title}
                                            </h3>

                                            <p className='line-clamp-2 min-h-10 text-sm text-gray-500 dark:text-gray-400'>
                                                {excerpt}
                                            </p>

                                            <span className='inline-flex items-center gap-1 text-xs font-bold text-[#ef7f1a] transition-all group-hover:gap-2 dark:text-orange-400'>
                                                {t('newsSection.details')}
                                                <ArrowUpRight size={14} />
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        <Pagination
                            currentPage={page}
                            totalPages={pagination.pages}
                            onPageChange={setPage}
                            previousLabel={PaginationPreviousIcon}
                            nextLabel={PaginationNextIcon}
                            siblingCount={1}
                            variant='square'
                            className='mt-10'
                        />
                    </>
                ) : (
                    <div className='py-16 text-center'>
                        <div className='mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800'>
                            <Newspaper size={44} className='text-gray-400 dark:text-gray-500' />
                        </div>
                        <h3 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>
                            {t('newsPage.notFoundTitle')}
                        </h3>
                        <p className='mb-6 text-gray-500 dark:text-gray-400'>
                            {searchInput ? t('newsPage.noSearchResults', { query: searchInput }) : t('newsPage.empty')}
                        </p>
                        {searchInput ? (
                            <Button
                                onClick={() => handleSearch('')}
                                className='bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] text-white'>
                                {t('newsPage.clearSearch')}
                            </Button>
                        ) : null}
                    </div>
                )}
            </div>
        </main>
    );
};

export default NewsPage;
