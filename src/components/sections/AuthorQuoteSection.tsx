'use client';

import React, { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { UserBanner, userBannerService } from '@/services/userBanner.service';

import { motion } from 'framer-motion';
import {
    Award,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Cloud,
    Coffee,
    Compass,
    Crown,
    Diamond,
    Feather,
    Flame,
    Flower2,
    Gem,
    Headphones,
    Heart,
    Leaf,
    Moon,
    Pause,
    Play,
    Quote,
    Sparkles,
    Star,
    Sun,
    TrendingUp,
    Zap
} from 'lucide-react';
// Swiper CSS
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export interface QuoteItem {
    id: string;
    text: string;
    author: string;
    authorImage: string;
    bgColor?: string;
    authorId: string;
    order: number;
    isActive: boolean;
}

interface AuthorQuoteSectionProps {
    autoPlay?: boolean;
    title?: string;
}

export const AuthorQuoteSection = ({
    autoPlay = true,
    title = 'Mashhur mualliflardan iqtiboslar'
}: AuthorQuoteSectionProps) => {
    const [loading, setLoading] = useState(true);
    const [quotes, setQuotes] = useState<UserBanner[]>([]);
    const [isPaused, setIsPaused] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const swiperRef = useRef<any>(null);
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    const fetchQuotes = async () => {
        try {
            setLoading(true);
            const data = await userBannerService.getQuoteBanners();
            setQuotes(data);
        } catch (error) {
            console.error('Iqtiboslarni yuklashda xatolik:', error);
            setQuotes([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchQuotes();
    }, []);

    useEffect(() => {
        if (swiperRef.current && prevRef.current && nextRef.current) {
            swiperRef.current.params.navigation.prevEl = prevRef.current;
            swiperRef.current.params.navigation.nextEl = nextRef.current;
            swiperRef.current.navigation.init();
            swiperRef.current.navigation.update();
        }
    }, [quotes]);

    const handleQuoteClick = (bannerId: string, link?: string) => {
        userBannerService.trackClick(bannerId);
        if (link) {
            window.location.href = link;
        }
    };

    const handleSlideChange = (swiper: any) => {
        setActiveIndex(swiper.realIndex);
        if (quotes[swiper.realIndex]) {
            userBannerService.trackView(quotes[swiper.realIndex]._id);
        }
    };

    // Floating icons array
    const floatingIcons = [
        Sparkles,
        Star,
        Heart,
        Crown,
        Zap,
        Award,
        Gem,
        Diamond,
        Flower2,
        Sun,
        Moon,
        Cloud,
        Coffee,
        Compass,
        Feather,
        Leaf,
        BookOpen,
        Headphones,
        TrendingUp,
        Flame,
        Quote
    ];

    if (loading) {
        return (
            <section className='relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-16 dark:from-slate-900 dark:to-slate-800'>
                <div className='relative z-10 container mx-auto px-4'>
                    <div className='mb-8 h-8 w-64 animate-pulse rounded-full bg-gradient-to-r from-[#00a0e3]/20 to-[#ef7f1a]/20 dark:from-blue-600/20 dark:to-orange-600/20'></div>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className='h-[350px] animate-pulse rounded-3xl bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 dark:from-blue-600/10 dark:to-orange-600/10'></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (quotes.length === 0) {
        return null;
    }

    const gradients = [
        'bg-gradient-to-br from-[#00a0e3]/5 to-[#ef7f1a]/5 dark:from-blue-900/20 dark:to-orange-900/20',
        'bg-gradient-to-tr from-[#ef7f1a]/5 to-[#00a0e3]/5 dark:from-orange-900/20 dark:to-blue-900/20',
        'bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 dark:from-blue-900/30 dark:to-orange-900/30',
        'bg-gradient-to-bl from-[#ef7f1a]/10 to-[#00a0e3]/10 dark:from-orange-900/30 dark:to-blue-900/30',
        'bg-gradient-to-t from-[#00a0e3]/5 to-[#ef7f1a]/5 dark:from-blue-900/20 dark:to-orange-900/20'
    ];

    return (
        <section className='relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-16 dark:from-slate-900 dark:to-slate-900'>
            {/* Animated Background Elements */}
            <div className='brand-grid' />

            <div className='relative z-10 container mx-auto px-4'>
                <motion.div
                    className='mb-10 flex items-center justify-between'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}>
                    <div className='flex items-center gap-3'>
                        <div className='rounded-lg bg-[#ef7f1a]/10 p-3 dark:bg-orange-500/20'>
                            <Quote size={20} className='text-[#ef7f1a] dark:text-orange-400' />
                        </div>
                        <div>
                            <h2 className='text-2xl font-black md:text-3xl'>
                                <span className='text-[#00a0e3] dark:text-blue-400'>{title.split(' ')[0]}</span>
                                <span className='text-[#ef7f1a] dark:text-orange-400'>
                                    {' '}
                                    {title.split(' ').slice(1).join(' ')}
                                </span>
                            </h2>
                            <p className='mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                                <Sparkles size={14} className='text-[#ef7f1a] dark:text-orange-400' />
                                {quotes.length} ta iqtibos
                            </p>
                        </div>
                    </div>

                    <div className='flex gap-2'>
                        <button
                            ref={prevRef}
                            className='rounded-full border border-gray-100 bg-white p-3 shadow-md transition-all hover:bg-[#00a0e3] hover:text-white dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-blue-600'
                            onClick={() => swiperRef.current?.slidePrev()}>
                            <ChevronLeft size={20} className='text-gray-700 dark:text-gray-300' />
                        </button>
                        <button
                            ref={nextRef}
                            className='rounded-full border border-gray-100 bg-white p-3 shadow-md transition-all hover:bg-[#ef7f1a] hover:text-white dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-orange-600'
                            onClick={() => swiperRef.current?.slideNext()}>
                            <ChevronRight size={20} className='text-gray-700 dark:text-gray-300' />
                        </button>
                    </div>
                </motion.div>

                <Swiper
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
                    effect='coverflow'
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 2,
                        slideShadows: false
                    }}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true
                    }}
                    autoplay={
                        autoPlay && !isPaused
                            ? {
                                  delay: 5000,
                                  disableOnInteraction: false,
                                  pauseOnMouseEnter: true
                              }
                            : false
                    }
                    loop={true}
                    breakpoints={{
                        640: { slidesPerView: 1.2, spaceBetween: 20 },
                        768: { slidesPerView: 1.5, spaceBetween: 25 },
                        1024: { slidesPerView: 2, spaceBetween: 30 }
                    }}
                    className='quote-swiper'
                    onSlideChange={handleSlideChange}>
                    {quotes.map((item, index) => {
                        const gradient = item.backgroundColor || gradients[index % gradients.length];

                        return (
                            <SwiperSlide key={item._id}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className={`${gradient} group relative flex h-[350px] flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 p-8 shadow-lg transition-all duration-500 hover:shadow-2xl md:h-[400px] md:p-12 dark:border-slate-700`}
                                    onClick={() => handleQuoteClick(item._id, item.buttonLink)}>
                                    <motion.div
                                        className='absolute inset-0'
                                        animate={{
                                            background: `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, rgba(0, 160, 227, 0.05), transparent 70%)`
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />

                                    <div className='absolute inset-0 opacity-5 dark:opacity-10'>
                                        <div className='absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-[#00a0e3] dark:bg-blue-600'></div>
                                        <div className='absolute bottom-0 left-0 -mb-20 -ml-20 h-40 w-40 rounded-full bg-[#ef7f1a] dark:bg-orange-600'></div>
                                    </div>

                                    <Quote
                                        size={40}
                                        className='absolute top-6 right-6 text-[#00a0e3]/10 dark:text-blue-600/20'
                                    />

                                    <div className='relative z-10 max-w-[60%] md:max-w-[65%]'>
                                        {item.quote?.text?.uz && (
                                            <motion.p
                                                className='mb-4 line-clamp-4 text-xl leading-relaxed font-bold text-gray-800 italic md:text-2xl dark:text-white'
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}>
                                                "{item.quote.text.uz}"
                                            </motion.p>
                                        )}

                                        <motion.div
                                            className='space-y-2'
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}>
                                            <span className='block text-sm font-medium text-gray-700 md:text-base dark:text-gray-300'>
                                                <span className='text-[#00a0e3] dark:text-blue-400'>—</span>{' '}
                                                {item.quote?.authorName || item.title.uz}
                                            </span>
                                            <div className='h-0.5 w-12 rounded-full bg-[#ef7f1a]'></div>
                                        </motion.div>
                                    </div>

                                    {item.buttonLink && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}>
                                            <Link
                                                href={item.buttonLink}
                                                className='group/link relative z-10 mt-6 inline-flex items-center gap-2 text-sm font-bold'>
                                                <span className='rounded-full border border-gray-200 bg-white/60 px-4 py-2 shadow-sm backdrop-blur-sm transition-all group-hover/link:border-[#00a0e3] group-hover/link:text-[#00a0e3] dark:border-slate-700 dark:bg-slate-800/60 dark:group-hover/link:border-blue-600 dark:group-hover/link:text-blue-400'>
                                                    Muallifning asarlari
                                                </span>
                                                <ChevronRight
                                                    size={18}
                                                    className='text-[#ef7f1a] transition-transform group-hover/link:translate-x-1 dark:text-orange-400'
                                                />
                                            </Link>
                                        </motion.div>
                                    )}

                                    {item.imageUrl && (
                                        <motion.div
                                            className='absolute right-0 bottom-0 h-full w-1/2'
                                            initial={{ opacity: 0, x: 50 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3, duration: 0.6 }}>
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.quote?.authorName || ''}
                                                fill
                                                className='object-contain object-right-bottom mix-blend-multiply transition-transform duration-700 group-hover:scale-110 dark:mix-blend-lighten'
                                            />
                                            <div className='absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/20 dark:to-slate-900/20'></div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                <motion.div
                    className='mt-8 flex items-center justify-between'
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}>
                    {autoPlay && (
                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className='group flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-2 shadow-md transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800'>
                            {isPaused ? (
                                <>
                                    <Play
                                        size={16}
                                        className='text-[#00a0e3] group-hover:text-[#ef7f1a] dark:text-blue-400 dark:group-hover:text-orange-400'
                                    />
                                    <span className='text-sm font-medium text-gray-600 group-hover:text-[#00a0e3] dark:text-gray-400 dark:group-hover:text-blue-400'>
                                        Davom et
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Pause
                                        size={16}
                                        className='text-[#ef7f1a] group-hover:text-[#00a0e3] dark:text-orange-400 dark:group-hover:text-blue-400'
                                    />
                                    <span className='text-sm font-medium text-gray-600 group-hover:text-[#ef7f1a] dark:text-gray-400 dark:group-hover:text-orange-400'>
                                        To'xtat
                                    </span>
                                </>
                            )}
                        </button>
                    )}

                    <div className='text-sm text-gray-400 dark:text-gray-500'>
                        <span className='font-bold text-[#00a0e3] dark:text-blue-400'>{activeIndex + 1}</span>
                        <span className='mx-1 text-gray-400 dark:text-gray-500'>/</span>
                        <span className='text-[#ef7f1a] dark:text-orange-400'>{quotes.length}</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
