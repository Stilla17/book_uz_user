'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { api } from '@/services/api';
import { getImageUrl } from '@/utils/image';

import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, ChevronRight, Eye, Megaphone } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type LocalizedText = string | { uz?: string; ru?: string; en?: string } | null | undefined;

type NewsItem = {
    _id: string;
    title?: LocalizedText;
    titleRu?: string;
    titleEn?: string;
    slug?: string;
    excerpt?: LocalizedText;
    description?: LocalizedText;
    image?: string;
    imageUrl?: string;
    views?: number;
    viewsCount?: number;
    viewCount?: number;
    createdAt?: string;
    publishedAt?: string;
};

const NEWS_VIEWS_STORAGE_KEY = 'news_views';
const NEWS_VIEWS_EVENT = 'news-views-change';

const getText = (value: LocalizedText, fallback = '') => {
    if (!value) return fallback;
    if (typeof value === 'string') return value || fallback;

    return value.uz || value.ru || value.en || fallback;
};

const normalizeNewsResponse = (data: any): NewsItem[] => {
    const payload = data?.data ?? data;
    const items = Array.isArray(payload?.news)
        ? payload.news
        : Array.isArray(payload?.items)
          ? payload.items
          : Array.isArray(payload)
            ? payload
            : [];

    return items;
};

export const NewsSection = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [savedViews, setSavedViews] = useState<Record<string, number>>({});

    dayjs.locale('uz');

    // Yangiliklarni yuklash
    useEffect(() => {
        loadNews();
    }, []);

    useEffect(() => {
        const loadSavedViews = () => {
            try {
                setSavedViews(JSON.parse(localStorage.getItem(NEWS_VIEWS_STORAGE_KEY) || '{}'));
            } catch {
                setSavedViews({});
            }
        };

        loadSavedViews();
        window.addEventListener('storage', loadSavedViews);
        window.addEventListener(NEWS_VIEWS_EVENT, loadSavedViews);

        return () => {
            window.removeEventListener('storage', loadSavedViews);
            window.removeEventListener(NEWS_VIEWS_EVENT, loadSavedViews);
        };
    }, []);

    const loadNews = async () => {
        try {
            setLoading(true);
            const response = await api.get('/news', {
                params: {
                    active: true,
                    page: 1,
                    limit: 8
                }
            });

            setNews(normalizeNewsResponse(response.data));
        } catch (error) {
            console.error('Yangiliklar yuklanmadi:', error);
            setNews([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return dayjs(dateString).format('D MMMM YYYY');
    };

    const getNewsViews = (item: NewsItem) => {
        const apiViews = item.views ?? item.viewsCount ?? item.viewCount ?? 0;
        const localViews = Math.max(savedViews[item._id] ?? 0, item.slug ? (savedViews[item.slug] ?? 0) : 0);

        return Math.max(apiViews, localViews);
    };

    if (loading) {
        return (
            <section className='bg-background py-16 dark:bg-slate-900'>
                <div className='container mx-auto px-4'>
                    <div className='flex h-64 items-center justify-center'>
                        <div className='h-12 w-12 animate-spin rounded-full border-4 border-[#00a0e3]/20 border-t-[#00a0e3]' />
                    </div>
                </div>
            </section>
        );
    }

    if (news.length === 0) {
        return null; // Yangiliklar bo'lmasa, komponent ko'rsatilmaydi
    }

    return (
        <section className='bg-background relative overflow-hidden py-16 dark:bg-slate-900'>
            {/* Animated Background Elements */}
            <div className='pointer-events-none absolute inset-0 overflow-hidden'>
                {/* Grid Pattern */}
                <div className='brand-grid' />
            </div>

            <div className='max-w-8xl relative z-10 container mx-auto px-4'>
                {/* Section Header */}
                <div className='mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end'>
                    <div className='space-y-2'>
                        <div className='inline-flex items-center gap-2 rounded-full border border-[#ef7f1a] bg-[#ef7f1a]/15 px-4 py-2'>
                            <Megaphone size={16} className='text-[#ef7f1a] dark:text-orange-400' />
                            <span className='text-xs font-bold text-[#ef7f1a] dark:text-white'>BLOG & YANGILIKLAR</span>
                        </div>
                        <h2 className='text-2xl font-black md:text-3xl'>
                            <span className='text-[#00a0e3] dark:text-blue-400'>Platforma</span>{' '}
                            <span className='text-[#ef7f1a] dark:text-orange-400'>yangiliklari</span>
                        </h2>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                            Eng so'nggi yangiliklar va aksiyalardan xabardor bo'ling
                        </p>
                    </div>

                    <Link
                        href='/news'
                        className='group inline-flex items-center gap-2 rounded-full bg-[#ef7f1a]/15 px-6 py-3 text-sm font-bold text-[#ef7f1a] transition-all duration-300 dark:bg-[#5b3a2b] dark:text-[#ef7f1a]'>
                        Barchasini ko'rish
                        <ChevronRight
                            size={16}
                            className='transition-transform duration-300 group-hover:translate-x-1'
                        />
                    </Link>
                </div>

                <Swiper
                    slidesPerView={4}
                    spaceBetween={16}
                    loop={news.length > 3}
                    autoplay={{
                        delay: 4500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true
                    }}
                    modules={[Autoplay, Pagination]}
                    breakpoints={{
                        0: { slidesPerView: 1.1, spaceBetween: 14 },
                        640: { slidesPerView: 2, spaceBetween: 18 },
                        768: { slidesPerView: 3, spaceBetween: 20 },
                        1024: { slidesPerView: 4, spaceBetween: 20 }
                    }}
                    className='news-swiper !overflow-visible pb-12'>
                    {news.map((item, index) => {
                        const title = getText(item.title, item.titleRu || item.titleEn || 'Yangilik');
                        const description = getText(item.excerpt, getText(item.description));
                        const imageUrl = getImageUrl(item.image || item.imageUrl);
                        const href = item.slug ? `/news/${item.slug}` : '/news';
                        const date = formatDate(item.publishedAt || item.createdAt);

                        return (
                            <SwiperSlide key={item._id} className='h-auto'>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    viewport={{ once: true }}
                                    className='h-full'>
                                    <Link
                                        href={href}
                                        className='group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800'>
                                        <div className='relative h-[190px] w-full overflow-hidden bg-slate-100 dark:bg-slate-900'>
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={title}
                                                    fill
                                                    sizes='(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 360px'
                                                    className='object-cover transition-transform duration-500 group-hover:scale-110'
                                                />
                                            ) : (
                                                <div className='grid h-full place-items-center text-[#ef7f1a]'>
                                                    <Megaphone size={34} />
                                                </div>
                                            )}
                                        </div>

                                        <div className='flex grow flex-col space-y-2 p-4'>
                                            {date ? (
                                                <div className='flex items-center gap-3 text-[10px] text-gray-400 dark:text-gray-500'>
                                                    <span className='flex items-center gap-1'>
                                                        <Calendar
                                                            size={10}
                                                            className='text-gray-400 dark:text-gray-500'
                                                        />
                                                        {date}
                                                    </span>
                                                    <span className='flex items-center gap-1'>
                                                        <Eye size={10} className='text-gray-400 dark:text-gray-500' />
                                                        {getNewsViews(item)}
                                                    </span>
                                                </div>
                                            ) : null}

                                            <h3 className='line-clamp-2 min-h-12 text-base leading-snug font-bold text-gray-900 transition-colors group-hover:text-[#00a0e3] dark:text-white dark:group-hover:text-blue-400'>
                                                {title}
                                            </h3>

                                            {description ? (
                                                <p className='line-clamp-2 min-h-8 text-xs leading-4 text-gray-500 dark:text-gray-400'>
                                                    {description}
                                                </p>
                                            ) : null}

                                            <div className='mt-auto pt-2'>
                                                <span className='inline-flex items-center gap-1 text-xs font-bold text-[#ef7f1a] transition-all group-hover:gap-2 dark:text-orange-400'>
                                                    Batafsil
                                                    <ArrowUpRight size={14} />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </section>
    );
};
