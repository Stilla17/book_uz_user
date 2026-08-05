'use client';

import { userBannerService } from '@/services/userBanner.service';
import { getImageUrl } from '@/utils/image';
import { useQuery } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export const Hero = () => {
    const { data: banners = [], isLoading } = useQuery({
        queryKey: ['user-banners', 'hero'],
        queryFn: () => userBannerService.getHeroBanners()
    });

    // Banner ko'rilganligini qayd etish
    const handleSlideChange = (swiper: any) => {
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

    if (isLoading || banners.length === 0) {
        return (
            <section className='relative h-56 w-full overflow-hidden sm:h-90 lg:h-150'>
                <div className='absolute inset-0 animate-pulse bg-gradient-to-r from-gray-300 to-gray-200 dark:from-slate-800 dark:to-slate-800'>
                    <div className='absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10' />
                </div>
            </section>
        );
    }

    return (
        <section className='group relative w-full overflow-hidden'>
            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                spaceBetween={100}
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
                loop={true}
                onSlideChange={handleSlideChange}
                className='hero-swiper mx-auto h-56 w-full max-w-[1440px] sm:h-90 lg:h-150'>
                {banners.map((banner) => {
                    const buttonLink = banner.buttonLink || banner.link;

                    return (
                        <SwiperSlide key={banner._id}>
                            <div className='relative h-full w-full'>
                                {/* Background Image */}
                                <div
                                    className='swiper-slide-active:scale-105 absolute inset-0 scale-100 bg-contain bg-center bg-no-repeat transition-transform duration-10000 sm:scale-105'
                                    style={{
                                        backgroundImage: `url(${getImageUrl(banner.imageUrl) || banner.imageUrl})`
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
                                    <div className='mx-auto max-w-7xl text-center'>
                                        {/* CTA Buttons */}
                                        {buttonLink && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.6, delay: 0.6 }}
                                                className='flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4'>
                                                <button
                                                    onClick={() => handleBannerClick(banner._id, buttonLink)}
                                                    className='group relative w-full transform cursor-pointer overflow-hidden rounded-full bg-[#FF8A00] px-6 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-xl sm:w-auto sm:px-8 sm:py-3 sm:text-base'>
                                                    <span className='relative z-10 flex items-center justify-center gap-2'>
                                                        <Eye
                                                            size={18}
                                                            className='transition-colors group-hover:text-white'
                                                        />
                                                        {banner.name}
                                                    </span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </section>
    );
};
