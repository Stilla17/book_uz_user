"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectCoverflow } from "swiper/modules";
import { 
  ChevronRight, 
  ChevronLeft, 
  Quote, 
  Pause, 
  Play, 
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
  Flame
} from "lucide-react";
import { userBannerService, UserBanner } from "@/services/userBanner.service";

// Swiper CSS
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

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
  title = "Mashhur mualliflardan iqtiboslar"
}: AuthorQuoteSectionProps) => {
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<UserBanner[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const swiperRef = useRef<any>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true);
        const data = await userBannerService.getQuoteBanners();
        setQuotes(data);
      } catch (error) {
        console.error("Iqtiboslarni yuklashda xatolik:", error);
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    };

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
  const floatingIcons = [Sparkles, Star, Heart, Crown, Zap, Award, Gem, Diamond, Flower2, Sun, Moon, Cloud, Coffee, Compass, Feather, Leaf, BookOpen, Headphones, TrendingUp, Flame, Quote];

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => {
            const IconComponent = floatingIcons[i % floatingIcons.length];
            const randomTop = Math.random() * 100;
            const randomLeft = Math.random() * 100;
            const randomFontSize = Math.random() * 30 + 15;
            
            return (
              <motion.div
                key={i}
                className="absolute text-[#00a0e3]/10 dark:text-[#ef7f1a]/10"
                style={{
                  top: `${randomTop}%`,
                  left: `${randomLeft}%`,
                  fontSize: `${randomFontSize}px`,
                }}
                animate={{
                  y: [0, -20, 20, 0],
                  x: [0, 20, -20, 0],
                  rotate: [0, 180, 360, 0],
                }}
                transition={{
                  duration: Math.random() * 15 + 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              >
                <IconComponent />
              </motion.div>
            );
          })}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="h-8 w-64 bg-gradient-to-r from-[#00a0e3]/20 to-[#ef7f1a]/20 dark:from-blue-600/20 dark:to-orange-600/20 rounded-full animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-[350px] bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 dark:from-blue-600/10 dark:to-orange-600/10 rounded-3xl animate-pulse"></div>
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
    "bg-gradient-to-br from-[#00a0e3]/5 to-[#ef7f1a]/5 dark:from-blue-900/20 dark:to-orange-900/20",
    "bg-gradient-to-tr from-[#ef7f1a]/5 to-[#00a0e3]/5 dark:from-orange-900/20 dark:to-blue-900/20",
    "bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 dark:from-blue-900/30 dark:to-orange-900/30",
    "bg-gradient-to-bl from-[#ef7f1a]/10 to-[#00a0e3]/10 dark:from-orange-900/30 dark:to-blue-900/30",
    "bg-gradient-to-t from-[#00a0e3]/5 to-[#ef7f1a]/5 dark:from-blue-900/20 dark:to-orange-900/20",
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-900 overflow-hidden relative">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => {
          const IconComponent = floatingIcons[i % floatingIcons.length];
          const randomTop = Math.random() * 100;
          const randomLeft = Math.random() * 100;
          const randomFontSize = Math.random() * 30 + 15;
          
          return (
            <motion.div
              key={i}
              className="absolute text-[#00a0e3]/10 dark:text-[#ef7f1a]/10"
              style={{
                top: `${randomTop}%`,
                left: `${randomLeft}%`,
                fontSize: `${randomFontSize}px`,
              }}
              animate={{
                y: [0, -20, 20, 0],
                x: [0, 20, -20, 0],
                rotate: [0, 180, 360, 0],
                opacity: [0.1, 0.2, 0.15, 0.1],
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              <IconComponent />
            </motion.div>
          );
        })}

        <motion.div
          animate={{
            x: mousePosition.x * 2,
            y: mousePosition.y * 2,
          }}
          transition={{ type: "spring", damping: 50 }}
          className="absolute top-20 left-20 w-96 h-96 bg-[#00a0e3]/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: mousePosition.x * -2,
            y: mousePosition.y * -2,
          }}
          transition={{ type: "spring", damping: 50 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-[#ef7f1a]/5 rounded-full blur-3xl"
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="flex justify-between items-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-[#00a0e3]/10 to-[#ef7f1a]/10 dark:from-blue-600/20 dark:to-orange-600/20 rounded-2xl">
              <Quote size={24} className="text-[#00a0e3] dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black">
                <span className="text-[#00a0e3] dark:text-blue-400">{title.split(' ')[0]}</span>
                <span className="text-[#ef7f1a] dark:text-orange-400"> {title.split(' ').slice(1).join(' ')}</span>
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                <Sparkles size={14} className="text-[#ef7f1a] dark:text-orange-400" />
                {quotes.length} ta iqtibos
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              ref={prevRef}
              className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-[#00a0e3] dark:hover:bg-blue-600 hover:text-white transition-all border border-gray-100 dark:border-slate-700"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
            <button
              ref={nextRef}
              className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-[#ef7f1a] dark:hover:bg-orange-600 hover:text-white transition-all border border-gray-100 dark:border-slate-700"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <ChevronRight size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </motion.div>

        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
          effect="coverflow"
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: false,
          }}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          pagination={{ 
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={autoPlay && !isPaused ? {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          } : false}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 1.2, spaceBetween: 20 },
            768: { slidesPerView: 1.5, spaceBetween: 25 },
            1024: { slidesPerView: 2, spaceBetween: 30 },
          }}
          className="quote-swiper"
          onSlideChange={handleSlideChange}
        >
          {quotes.map((item, index) => {
            const gradient = item.backgroundColor || gradients[index % gradients.length];
            
            return (
              <SwiperSlide key={item._id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`${gradient} rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col justify-between h-[350px] md:h-[400px] shadow-lg hover:shadow-2xl transition-all duration-500 group border border-gray-100 dark:border-slate-700`}
                  onClick={() => handleQuoteClick(item._id, item.buttonLink)}
                >
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      background: `radial-gradient(circle at ${mousePosition.x + 50}% ${mousePosition.y + 50}%, rgba(0, 160, 227, 0.05), transparent 70%)`,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="absolute inset-0 opacity-5 dark:opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00a0e3] dark:bg-blue-600 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#ef7f1a] dark:bg-orange-600 rounded-full -ml-20 -mb-20"></div>
                  </div>

                  <Quote size={40} className="absolute top-6 right-6 text-[#00a0e3]/10 dark:text-blue-600/20" />

                  <div className="relative z-10 max-w-[60%] md:max-w-[65%]">
                    {item.quote?.text?.uz && (
                      <motion.p 
                        className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4 leading-relaxed italic line-clamp-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        "{item.quote.text.uz}"
                      </motion.p>
                    )}
                    
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="text-sm md:text-base font-medium block text-gray-700 dark:text-gray-300">
                        <span className="text-[#00a0e3] dark:text-blue-400">—</span> {item.quote?.authorName || item.title.uz}
                      </span>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 rounded-full"></div>
                    </motion.div>
                  </div>

                  {item.buttonLink && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link 
                        href={item.buttonLink}
                        className="relative z-10 inline-flex items-center gap-2 text-sm font-bold group/link mt-6"
                      >
                        <span className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm transition-all border border-gray-200 dark:border-slate-700 group-hover/link:border-[#00a0e3] dark:group-hover/link:border-blue-600 group-hover/link:text-[#00a0e3] dark:group-hover/link:text-blue-400">
                          Muallifning asarlari
                        </span>
                        <ChevronRight size={18} className="text-[#ef7f1a] dark:text-orange-400 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  )}

                  {item.imageUrl && (
                    <motion.div 
                      className="absolute right-0 bottom-0 w-1/2 h-full"
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.quote?.authorName || ''}
                        fill
                        className="object-contain object-right-bottom mix-blend-multiply dark:mix-blend-lighten group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/20 dark:to-slate-900/20"></div>
                    </motion.div>
                  )}
                </motion.div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <motion.div 
          className="flex justify-between items-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {autoPlay && (
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-slate-700 group"
            >
              {isPaused ? (
                <>
                  <Play size={16} className="text-[#00a0e3] dark:text-blue-400 group-hover:text-[#ef7f1a] dark:group-hover:text-orange-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-[#00a0e3] dark:group-hover:text-blue-400">Davom et</span>
                </>
              ) : (
                <>
                  <Pause size={16} className="text-[#ef7f1a] dark:text-orange-400 group-hover:text-[#00a0e3] dark:group-hover:text-blue-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-[#ef7f1a] dark:group-hover:text-orange-400">To'xtat</span>
                </>
              )}
            </button>
          )}

          <div className="text-sm text-gray-400 dark:text-gray-500">
            <span className="font-bold text-[#00a0e3] dark:text-blue-400">{activeIndex + 1}</span> 
            <span className="mx-1 text-gray-400 dark:text-gray-500">/</span>
            <span className="text-[#ef7f1a] dark:text-orange-400">{quotes.length}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};