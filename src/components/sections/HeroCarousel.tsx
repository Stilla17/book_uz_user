'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { type UserBanner, userBannerService } from '@/services/userBanner.service';
import { getImageUrl } from '@/utils/image';

import { Eye } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type HeroCarouselProps = {
    banners: UserBanner[];
};

type BannerSlideProps = {
    banner: UserBanner;
    isFirst: boolean;
    onBannerClick: (bannerId: string, link?: string) => void;
};

const HERO_IMAGE_SIZES = '(max-width: 1440px) 100vw, 1440px';

const BannerSlide = ({ banner, isFirst, onBannerClick }: BannerSlideProps) => {
    const imageUrl = getImageUrl(banner.imageUrl) || banner.imageUrl;
    const buttonLink = banner.buttonLink || banner.link;

    return (
        <div className='relative h-full w-full'>
            <Image
                src={imageUrl}
                alt={banner.name || 'Book.uz banner'}
                fill
                sizes={HERO_IMAGE_SIZES}
                priority={isFirst}
                fetchPriority={isFirst ? 'high' : 'low'}
                loading={isFirst ? 'eager' : 'lazy'}
                className='object-contain object-center'
            />

            <div
                className='relative z-10 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8'
                style={{ color: banner.textColor || '#ffffff' }}>
                <div className='mx-auto max-w-7xl text-center'>
                    {buttonLink && (
                        <button
                            type='button'
                            onClick={() => onBannerClick(banner._id, buttonLink)}
                            className='group relative w-full cursor-pointer overflow-hidden rounded-full bg-[#FF8A00] px-6 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-xl sm:w-auto sm:px-8 sm:py-3 sm:text-base'>
                            <span className='relative z-10 flex items-center justify-center gap-2'>
                                <Eye size={18} className='transition-colors group-hover:text-white' />

                                {banner.name}
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export const HeroCarousel = ({ banners }: HeroCarouselProps) => {
    const [swiperReady, setSwiperReady] = useState(false);

    useEffect(() => {
        setSwiperReady(true);
    }, []);

    const handleBannerClick = (bannerId: string, link?: string) => {
        void userBannerService.trackClick(bannerId);

        if (link) {
            window.location.assign(link);
        }
    };

    const handleSlideChange = (swiper: { realIndex: number }) => {
        const activeBanner = banners[swiper.realIndex];

        if (activeBanner) {
            void userBannerService.trackView(activeBanner._id);
        }
    };

    if (banners.length === 0) {
        return (
            <section className='relative h-56 w-full overflow-hidden sm:h-90 lg:h-150'>
                <div className='absolute inset-0 animate-pulse bg-gradient-to-r from-gray-300 to-gray-200 dark:from-slate-800 dark:to-slate-800' />
            </section>
        );
    }

    /*
     * Bu qism server render paytida ham chiqariladi.
     * Natijada brauzer birinchi banner rasmini Swiper JS kelishidan
     * oldin HTML ichidan topadi.
     */
    if (!swiperReady || banners.length === 1) {
        return (
            <section className='group relative w-full overflow-hidden'>
                <div className='relative mx-auto h-56 w-full max-w-[1440px] sm:h-90 lg:h-150'>
                    <BannerSlide banner={banners[0]} isFirst onBannerClick={handleBannerClick} />
                </div>
            </section>
        );
    }

    return (
        <section className='group relative w-full overflow-hidden'>
            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                slidesPerView={1}
                spaceBetween={100}
                loop={banners.length > 1}
                lazyPreloadPrevNext={0}
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
                onSlideChange={handleSlideChange}
                className='hero-swiper mx-auto h-56 w-full max-w-[1440px] sm:h-90 lg:h-150'>
                {banners.map((banner, index) => (
                    <SwiperSlide key={banner._id}>
                        <BannerSlide banner={banner} isFirst={index === 0} onBannerClick={handleBannerClick} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};
