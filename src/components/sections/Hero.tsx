"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { ChevronLeft, ChevronRight, Headphones, BookOpen, Sparkles, Award } from "lucide-react";
import { userBannerService, UserBanner } from "@/services/userBanner.service";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export const Hero = () => {
  const [banners, setBanners] = useState<UserBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);


  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await userBannerService.getHeroBanners();
      setBanners(data);
    } catch (error) {
      console.error("Bannerlarni yuklashda xatolik:", error);
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
    return <section className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full bg-gradient-to-r from-[#005CB9] to-[#FF8A00] dark:from-blue-600 dark:to-orange-600" />;
  }

  if (loading || banners.length === 0) {
    return (
      <section className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-slate-800 dark:to-slate-800 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
      </section>
    );
  }

  const getBadgeIcon = (badge: string) => {
    if (badge?.toLowerCase().includes("chegirma")) return <Sparkles size={16} className="text-[#FF8A00] dark:text-orange-400" />;
    if (badge?.toLowerCase().includes("audio")) return <Headphones size={16} className="text-[#005CB9] dark:text-blue-400" />;
    return <Award size={16} className="text-[#FF8A00] dark:text-orange-400" />;
  };

  return (
    <section className="relative w-full overflow-hidden group">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 4,
        }}
        navigation={{
          nextEl: '.hero-button-next',
          prevEl: '.hero-button-prev',
        }}
        loop={true}
        onSlideChange={handleSlideChange}
        className="hero-swiper h-[400px] sm:h-[500px] lg:h-[600px] w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <div className="relative h-full w-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] scale-105 swiper-slide-active:scale-110"
                style={{
                  backgroundImage: `url(${banner.imageUrl})`,
                }}
              />

              {/* Gradient Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: banner.backgroundColor || 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
                }}
              />

              {/* Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8"
                style={{ color: banner.textColor || '#ffffff' }}
              >
                <div className="max-w-4xl mx-auto text-center">
                  {/* Badge */}
                  {banner.badge?.uz && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-4 sm:mb-6"
                    >
                      {getBadgeIcon(banner.badge.uz)}
                      <span className="text-xs sm:text-sm font-bold text-white">{banner.badge.uz}</span>
                    </motion.div>
                  )}

                  {/* Subtitle */}
                  {banner.subtitle?.uz && (
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="block text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] mb-2 sm:mb-3 font-light text-white/90"
                    >
                      {banner.subtitle.uz}
                    </motion.span>
                  )}

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-3 sm:mb-4 px-2"
                  >
                    {banner.title.uz}
                  </motion.h1>

                  {/* Description */}
                  {banner.description?.uz && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-6 sm:mb-8 px-4 opacity-90 line-clamp-2 sm:line-clamp-3 text-white/90"
                    >
                      {banner.description.uz}
                    </motion.p>
                  )}

                  {/* CTA Buttons */}
                  {banner.buttonText?.uz && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
                    >
                      <button
                        onClick={() => handleBannerClick(banner._id, banner.buttonLink)}
                        className="group relative overflow-hidden bg-white text-gray-900 dark:bg-slate-800 dark:text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-bold hover:shadow-xl transition-all transform hover:scale-105 w-full sm:w-auto"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <BookOpen size={18} className="text-[#005CB9] dark:text-blue-400 group-hover:text-white transition-colors" />
                          {banner.buttonText.uz}
                        </span>
                        <div className="absolute inset-0  bg-[#FF8A00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}

        {/* Navigation Buttons */}
        <div className="hidden lg:block">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="hero-button-prev w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-[#005CB9]/80 dark:hover:bg-blue-600/80 transition-all border border-white/30 hover:border-[#FF8A00] dark:hover:border-orange-400">
              <ChevronLeft size={24} className="text-white" />
            </button>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="hero-button-next w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-[#FF8A00]/80 dark:hover:bg-orange-600/80 transition-all border border-white/30 hover:border-[#005CB9] dark:hover:border-blue-400">
              <ChevronRight size={24} className="text-white" />
            </button>
          </div>
        </div>
      </Swiper>
    </section>
  );
};