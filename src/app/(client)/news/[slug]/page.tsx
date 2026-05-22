'use client';

import { useEffect, useRef } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import type { NewsItems, NewsResponse } from '@/types/news';
import { getLocalizedText } from '@/utils/book-formatters';
import { getImageUrl } from '@/utils/image';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import dayjs from 'dayjs';
import { ArrowLeft, Calendar, Eye, Megaphone, Newspaper } from 'lucide-react';

type NewsDetailResponse = NewsItems & {
    content?: NewsItems['description'];
};

const NEWS_VIEWS_STORAGE_KEY = 'news_views';
const NEWS_VIEWS_EVENT = 'news-views-change';

const readNewsViews = (): Record<string, number> => {
    if (typeof window === 'undefined') return {};

    try {
        return JSON.parse(localStorage.getItem(NEWS_VIEWS_STORAGE_KEY) || '{}');
    } catch {
        return {};
    }
};

const writeNewsViews = (newsId: string, slug: string, views: number) => {
    if (typeof window === 'undefined') return;

    try {
        const savedViews = readNewsViews();
        const nextViews = Math.max(views, savedViews[newsId] ?? 0, savedViews[slug] ?? 0);
        localStorage.setItem(
            NEWS_VIEWS_STORAGE_KEY,
            JSON.stringify({
                ...savedViews,
                [newsId]: nextViews,
                [slug]: nextViews
            })
        );
        window.dispatchEvent(new Event(NEWS_VIEWS_EVENT));
    } catch {
        localStorage.setItem(NEWS_VIEWS_STORAGE_KEY, JSON.stringify({ [newsId]: views, [slug]: views }));
        window.dispatchEvent(new Event(NEWS_VIEWS_EVENT));
    }
};

const getNewsDetail = async (slug: string): Promise<NewsDetailResponse> => {
    const response = await api.get(`/news/${slug}`);
    return response.data.data;
};

const NewsDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const slug = params?.slug as string;
    const viewedRef = useRef('');

    const { data: news, isLoading } = useQuery({
        queryKey: ['news', 'detail', slug],
        queryFn: () => getNewsDetail(slug),
        enabled: Boolean(slug)
    });

    useEffect(() => {
        if (!slug || !news?._id || viewedRef.current === news._id) return;

        viewedRef.current = news._id;
        const savedViews = readNewsViews();
        const currentViews = Math.max(news.views ?? 0, savedViews[news._id] ?? 0, savedViews[slug] ?? 0);
        const nextViews = currentViews + 1;

        api.post(`/news/${slug}/view`, {
            views: nextViews
        }).catch(() => null);
        writeNewsViews(news._id, slug, nextViews);
        queryClient.setQueryData<NewsDetailResponse>(['news', 'detail', slug], (current) =>
            current ? { ...current, views: nextViews } : current
        );
        queryClient.setQueriesData<NewsResponse>({ queryKey: ['public-news'] }, (current) => {
            if (!current) return current;

            return {
                ...current,
                news: current.news.map((item) => (item._id === news._id ? { ...item, views: nextViews } : item))
            };
        });
        queryClient.invalidateQueries({ queryKey: ['public-news'] });
    }, [news, queryClient, slug]);

    if (isLoading) {
        return (
            <div className='flex min-h-screen items-center justify-center'>
                <div className='h-12 w-12 animate-spin rounded-full border-4 border-[#00a0e3]/20 border-t-[#00a0e3]' />
            </div>
        );
    }

    if (!news) {
        return (
            <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 text-center dark:bg-slate-900'>
                <div>
                    <Newspaper size={44} className='mx-auto text-gray-400' />
                    <h1 className='mt-4 text-2xl font-black text-gray-900 dark:text-white'>Yangilik topilmadi</h1>
                    <Button asChild className='mt-5 bg-[#ef7f1a] text-white hover:bg-orange-600'>
                        <Link href='/news'>Yangiliklarga qaytish</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const title = getLocalizedText(news.title, 'Yangilik');
    const excerpt = getLocalizedText(news.excerpt);
    const content = getLocalizedText(news.content || news.description);
    const imageUrl = getImageUrl(news.image);

    return (
        <main className='min-h-screen bg-background py-10 dark:bg-slate-900'>
            <div className='container mx-auto max-w-4xl px-4'>
                <button
                    type='button'
                    onClick={() => router.back()}
                    className='mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-[#00a0e3] dark:text-gray-400'>
                    <ArrowLeft size={16} />
                    Orqaga
                </button>

                <article className='overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-slate-700 dark:bg-slate-800'>
                    <div className='relative h-[300px] w-full overflow-hidden bg-slate-100 md:h-[420px] dark:bg-slate-900'>
                        {imageUrl ? (
                            <Image src={imageUrl} alt={title} fill priority className='object-cover' />
                        ) : (
                            <div className='grid h-full place-items-center text-[#ef7f1a]'>
                                <Megaphone size={48} />
                            </div>
                        )}
                    </div>

                    <div className='p-6 md:p-8'>
                        <div className='mb-4 flex flex-wrap items-center gap-3 text-xs text-gray-400'>
                            <span className='inline-flex items-center gap-1'>
                                <Calendar size={13} />
                                {news.createdAt ? dayjs(news.createdAt).format('DD.MM.YYYY') : '-'}
                            </span>
                            <span className='inline-flex items-center gap-1'>
                                <Eye size={13} />
                                {news.views ?? 0}
                            </span>
                        </div>

                        <h1 className='mb-4 text-2xl font-black text-gray-900 md:text-4xl dark:text-white'>
                            {title}
                        </h1>

                        {excerpt ? (
                            <div className='mb-6 rounded-xl border-l-4 border-[#00a0e3] bg-[#00a0e3]/5 p-4 dark:bg-blue-600/10'>
                                <p className='italic text-gray-700 dark:text-gray-300'>{excerpt}</p>
                            </div>
                        ) : null}

                        <div className='prose prose-lg max-w-none dark:prose-invert'>
                            {content.split('\n').map((paragraph, index) =>
                                paragraph.trim() ? <p key={index}>{paragraph}</p> : null
                            )}
                        </div>
                    </div>
                </article>
            </div>
        </main>
    );
};

export default NewsDetailPage;
