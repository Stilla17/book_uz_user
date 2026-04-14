'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { UserBanner, userBannerService } from '@/services/userBanner.service';

import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, ChevronRight, Megaphone } from 'lucide-react';

// Yangilik banneri uchun type
type NewsBanner = UserBanner;

export const NewsSection = () => {
    const [news, setNews] = useState<NewsBanner[]>([]);
    const [loading, setLoading] = useState(true);

    dayjs.locale('uz');

    // Yangiliklarni yuklash
    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            setLoading(true);
            // Bannerlardan faqat 'news' tipidagilarni olish
            const banners = await userBannerService.getNewsBanners();

            // Faol va tartiblangan yangiliklar
            const activeNews = banners.filter((banner) => banner.isActive).sort((a, b) => a.order - b.order);

            setNews(activeNews);
        } catch (error) {
            console.error('Yangiliklar yuklanmadi:', error);
            setNews([]);
        } finally {
            setLoading(false);
        }
    };

    // Yangilik bosilganda statistikani yangilash
    const handleNewsClick = (bannerId: string, link?: string) => {
        userBannerService.trackClick(bannerId);
        if (link) {
            window.location.href = link;
        }
    };

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('D MMMM YYYY');
    };

    if (loading) {
        return (
            <section className='bg-gradient-to-b from-white to-gray-50 py-16 dark:from-slate-900 dark:to-slate-800'>
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
        <section className='relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-16 dark:from-slate-900 dark:to-slate-800'>
            {/* Animated Background Elements */}
            <div className='pointer-events-none absolute inset-0 overflow-hidden'>
                {/* Grid Pattern */}
                <div className='brand-grid' />
            </div>

            <div className='relative z-10 container mx-auto max-w-6xl px-4'>
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

                {/* News Grid */}
                <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
                    {news.slice(0, 3).map((item, index) => {
                        return (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                onClick={() => handleNewsClick(item._id, item.buttonLink)}
                                className='group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800'>
                                {/* Floating Particles */}
                                <motion.div className='absolute inset-0' transition={{ duration: 0.3 }} />

                                {/* Image */}
                                <div className='relative h-[180px] w-full overflow-hidden'>
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title.uz}
                                        fill
                                        className='object-cover transition-transform duration-500 group-hover:scale-110'
                                    />
                                </div>

                                {/* Content */}
                                <div className='space-y-2 p-4'>
                                    <div className='flex items-center gap-2 text-[10px] text-gray-400 dark:text-gray-500'>
                                        <div className='flex items-center gap-1'>
                                            <Calendar size={10} className='text-gray-400 dark:text-gray-500' />
                                            <span>{formatDate(item.createdAt)}</span>
                                        </div>
                                    </div>

                                    <h3 className='line-clamp-2 text-base leading-snug font-bold text-gray-900 transition-colors group-hover:text-[#00a0e3] dark:text-white dark:group-hover:text-blue-400'>
                                        {item.title.uz}
                                    </h3>

                                    {item.description?.uz && (
                                        <p className='line-clamp-2 text-xs text-gray-500 dark:text-gray-400'>
                                            {item.description.uz}
                                        </p>
                                    )}

                                    <div className='pt-2'>
                                        <span className='inline-flex items-center gap-1 text-xs font-bold text-[#ef7f1a] transition-all group-hover:gap-2 dark:text-orange-400'>
                                            Batafsil
                                            <ArrowUpRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
