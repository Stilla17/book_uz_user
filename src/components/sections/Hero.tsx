'use client';

import { useEffect, useState } from 'react';

import { UserBanner, userBannerService } from '@/services/userBanner.service';

import { motion } from 'framer-motion';
import { Infinity as InfinityIcon, Award, BookOpen, ChevronLeft, ChevronRight, Headphones, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export const Hero = () => {
    const [banners, setBanners] = useState<UserBanner[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const { i18n } = useTranslation();

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const data = await userBannerService.getHeroBanners();
            setBanners(data);
        } catch (error) {
            console.error('Bannerlarni yuklashda xatolik:', error);
            setBanners([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
        fetchBanners();
    }, []);

    // Banner ko'rilganligini qayd etish
    const handleSlideChange = (swiper: any) => {
        setActiveIndex(swiper.realIndex);
        if (banners[swiper.realIndex]) {
            userBannerService.trackView(banners[swiper.realIndex]._id);
        }
    };

    // Banner bosilganligini qayd etish
    const handleBannerClick = (bannerId: string, link?: string) => {
        userBannerService.trackClick(bannerId);
        if (link) {
            window.location.href = link;
        }
    };

    if (!mounted) {
        return (
            <section className='relative h-100 w-full bg-gradient-to-r from-[#005CB9] to-[#FF8A00] sm:h-[500px] lg:h-[600px] dark:from-blue-600 dark:to-orange-600' />
        );
    }

    if (loading || banners.length === 0) {
        return (
            <section className='relative h-100 w-full overflow-hidden sm:h-125 lg:h-150'>
                <div className='absolute inset-0 animate-pulse bg-gradient-to-r from-gray-300 to-gray-200 dark:from-slate-800 dark:to-slate-800'>
                    <div className='absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10' />
                </div>
            </section>
        );
    }

    const currentLanguage = i18n.language?.split('-')[0] as 'uz' | 'ru' | 'en';

    const getLocalizedText = (field?: { uz?: string; ru?: string; en?: string }) => {
        if (!field) return '';

        return field[currentLanguage] || field.uz || field.ru || field.en || '';
    };

    const getBadgeIcon = (badge: string) => {
        if (badge?.toLowerCase().includes('chegirma'))
            return <Sparkles size={16} className='text-[#FF8A00] dark:text-orange-400' />;
        if (badge?.toLowerCase().includes('audio'))
            return <Headphones size={16} className='text-[#005CB9] dark:text-blue-400' />;
        return <Award size={16} className='text-[#FF8A00] dark:text-orange-400' />;
    };

    return (
        <section className='group relative w-full overflow-hidden'>
            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                effect='fade'
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                    dynamicMainBullets: 4
                }}
                navigation={{
                    nextEl: '.hero-button-next',
                    prevEl: '.hero-button-prev'
                }}
                loop={true}
                onSlideChange={handleSlideChange}
                className='hero-swiper h-100 w-full sm:h-125 lg:h-150'>
                {banners.map((banner) => (
                    <SwiperSlide key={banner._id}>
                        <div className='relative h-full w-full'>
                            {/* Background Image */}
                            <div
                                className='swiper-slide-active:scale-110 absolute inset-0 scale-105 bg-cover bg-center transition-transform duration-10000'
                                style={{
                                    backgroundImage: `url(${banner.imageUrl})`
                                }}
                            />

                            {/* Gradient Overlay */}
                            <div
                                className='absolute inset-0'
                                style={{
                                    background:
                                        banner.backgroundColor ||
                                        'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)'
                                }}
                            />

                            {/* Content */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className='relative flex h-full items-center justify-center px-4 sm:px-6 lg:px-8'
                                style={{ color: banner.textColor || '#ffffff' }}>
                                <div className='mx-auto max-w-4xl text-center'>
                                    {/* Badge */}
                                    {getLocalizedText(banner.badge) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.2 }}
                                            className='mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1.5 backdrop-blur-md sm:mb-6 sm:px-4 sm:py-2'>
                                            {getBadgeIcon(getLocalizedText(banner.badge))}
                                            <span className='text-xs font-bold text-white sm:text-sm'>
                                                {getLocalizedText(banner.badge)}
                                            </span>
                                        </motion.div>
                                    )}

                                    {/* Subtitle */}
                                    {getLocalizedText(banner.subtitle) && (
                                        <motion.span
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.3 }}
                                            className='mb-2 block text-xs font-light tracking-[0.2em] text-white/90 uppercase sm:mb-3 sm:text-sm md:text-base'>
                                            {getLocalizedText(banner.subtitle)}
                                        </motion.span>
                                    )}

                                    {/* Title */}
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                        className='mb-3 px-2 text-2xl font-black sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl'>
                                        {getLocalizedText(banner.title)}
                                    </motion.h1>

                                    {/* Description */}
                                    {getLocalizedText(banner.description) && (
                                        <motion.p
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.5 }}
                                            className='mx-auto mb-6 line-clamp-2 max-w-2xl px-4 text-sm text-white/90 opacity-90 sm:mb-8 sm:line-clamp-3 sm:text-base md:text-lg lg:text-xl'>
                                            {getLocalizedText(banner.description)}
                                        </motion.p>
                                    )}

                                    {/* CTA Buttons */}
                                    {getLocalizedText(banner.buttonText) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.6 }}
                                            className='flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4'>
                                            <button
                                                onClick={() => handleBannerClick(banner._id, banner.buttonLink)}
                                                className='group relative w-full transform cursor-pointer overflow-hidden rounded-full bg-[#FF8A00] px-6 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-xl sm:w-auto sm:px-8 sm:py-3 sm:text-base'>
                                                <span className='relative z-10 flex items-center justify-center gap-2'>
                                                    <BookOpen
                                                        size={18}
                                                        className='transition-colors group-hover:text-white'
                                                    />
                                                    {getLocalizedText(banner.buttonText)}
                                                </span>

                                                {/* Hover effekti uchun biroz to'qroq rang beramiz */}
                                                <div className='absolute inset-0 bg-[#e67600] opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};
