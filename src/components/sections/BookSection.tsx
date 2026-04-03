// components/sections/BookSection.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Book, BookCard } from '../cards/BookCard';
import { BookCardSkeleton } from '../cards/BookCardSkeleton';
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
    Flame,
    Flower2,
    Gem,
    Headphones,
    Heart,
    Moon,
    Sparkles,
    Star,
    Sun,
    TrendingUp,
    Zap
} from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { BookSectionProps } from '@/types/section.types';
import { useTranslation } from 'react-i18next';

export const BookSection = ({
    title,
    subtitle,
    books,
    type = 'default',
    viewAllLink = '/catalog'
}: BookSectionProps) => {
    const [loading, setLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    const { t } = useTranslation();

    // Track mouse position for parallax effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Mock books with more data
    const mockBooks: Book[] = [
        {
            _id: '1',
            title: 'Sariq devni minib',
            author: "Xudoyberdi To'xtaboyev",
            price: 45000,
            oldPrice: 60000,
            rating: 4.9,
            reviewsCount: 1245,
            discount: 25,
            isHit: true,
            format: 'paper',
            image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1887'
        },
        {
            _id: '2',
            title: 'Yulduzli tunlar',
            author: 'Pirimqul Qodirov',
            price: 55000,
            rating: 5.0,
            reviewsCount: 892,
            isNew: true,
            format: 'ebook',
            image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1948'
        },
        {
            _id: '3',
            title: 'Stiv Jobs',
            author: 'Uolter Ayzekson',
            price: 89000,
            oldPrice: 110000,
            rating: 4.8,
            reviewsCount: 2341,
            isHit: true,
            format: 'paper',
            image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887'
        },
        {
            _id: '4',
            title: "Boy ota, kambag'al ota",
            author: 'Robert Kiyosaki',
            price: 35000,
            rating: 4.7,
            reviewsCount: 5678,
            isNew: true,
            format: 'ebook',
            image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1824'
        },
        {
            _id: '5',
            title: 'Atomic Habits',
            author: 'James Clear',
            price: 42000,
            rating: 4.9,
            reviewsCount: 4321,
            format: 'audio',
            isFree: true,
            image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1888'
        },
        {
            _id: '6',
            title: 'Zukko bolajon',
            author: 'Ertaklar olami',
            price: 25000,
            rating: 4.5,
            reviewsCount: 567,
            isNew: true,
            format: 'ebook',
            image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1948'
        },
        {
            _id: '7',
            title: 'Kichik shahzoda',
            author: 'Antuan de Sent-Ekzyuperi',
            price: 32000,
            oldPrice: 45000,
            rating: 4.9,
            reviewsCount: 3456,
            discount: 29,
            format: 'paper',
            image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887'
        },
        {
            _id: '8',
            title: 'Shaytanat',
            author: 'Tohir Malik',
            price: 68000,
            rating: 4.9,
            reviewsCount: 2891,
            isHit: true,
            format: 'paper',
            image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?q=80&w=1935'
        }
    ];

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const displayBooks = books && books.length > 0 ? books : mockBooks;

    // Floating icons array
    const floatingIcons = [
        BookOpen,
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
        Headphones,
        TrendingUp,
        Flame
    ];

    // Section icon and color based on type
    const getSectionConfig = () => {
        switch (type) {
            case 'new':
                return {
                    icon: <Sparkles size={24} className='text-[#ef7f1a] dark:text-orange-400' />,
                    color: 'text-[#ef7f1a] dark:text-orange-400',
                    bgColor: 'bg-[#ef7f1a]/10 dark:bg-orange-500/20',
                    borderColor: 'border-[#ef7f1a]/20 dark:border-orange-500/30'
                };
            case 'popular':
                return {
                    icon: <TrendingUp size={24} className='text-[#ef7f1a] dark:text-orange-400' />,
                    color: 'text-[#ef7f1a] dark:text-orange-400',
                    bgColor: 'bg-[#ef7f1a]/10 dark:bg-orange-500/20',
                    borderColor: 'border-[#ef7f1a]/20 dark:border-orange-500/30'
                };
            case 'discount':
                return {
                    icon: <Flame size={24} className='text-[#ef7f1a] dark:text-orange-400' />,
                    color: 'text-[#ef7f1a] dark:text-orange-400',
                    bgColor: 'bg-[#ef7f1a]/10 dark:bg-orange-500/20',
                    borderColor: 'border-[#ef7f1a]/20 dark:border-orange-500/30'
                };
            case 'audio':
                return {
                    icon: <Headphones size={24} className='text-[#ef7f1a] dark:text-orange-400' />,
                    color: 'text-[#ef7f1a] dark:text-orange-400',
                    bgColor: 'bg-[#ef7f1a]/10 dark:bg-orange-500/20',
                    borderColor: 'border-[#ef7f1a]/20 dark:border-orange-500/30'
                };
            case 'author':
                return {
                    icon: <Award size={24} className='text-[#ef7f1a] dark:text-orange-400' />,
                    color: 'text-[#ef7f1a] dark:text-orange-400',
                    bgColor: 'bg-[#ef7f1a]/10 dark:bg-orange-500/20',
                    borderColor: 'border-[#ef7f1a]/20 dark:border-orange-500/30'
                };
            default:
                return {
                    icon: <BookOpen size={24} className='text-[#ef7f1a] dark:text-orange-400' />,
                    color: 'text-[#ef7f1a] dark:text-orange-400',
                    bgColor: 'bg-[#ef7f1a]/10 dark:bg-orange-500/20',
                    borderColor: 'border-[#ef7f1a]/20 dark:border-orange-500/30'
                };
        }
    };

    const config = getSectionConfig();

    return (
        <motion.section
            className='relative overflow-hidden bg-white py-12 dark:bg-slate-900'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            {/* Animated Background Elements */}
            <div className='pointer-events-none absolute inset-0 overflow-hidden'>
                {/* Floating Icons */}
                {[...Array(15)].map((_, i) => {
                    const IconComponent = floatingIcons[i % floatingIcons.length];
                    const randomTop = Math.random() * 100;
                    const randomLeft = Math.random() * 100;
                    const randomFontSize = Math.random() * 30 + 15;

                    return (
                        <motion.div
                            key={i}
                            className='absolute text-[#00a0e3]/10 dark:text-[#ef7f1a]/10'
                            style={{
                                top: `${randomTop}%`,
                                left: `${randomLeft}%`,
                                fontSize: `${randomFontSize}px`
                            }}
                            animate={{
                                y: [0, -20, 20, 0],
                                x: [0, 20, -20, 0],
                                rotate: [0, 180, 360, 0],
                                opacity: [0.1, 0.2, 0.15, 0.1]
                            }}
                            transition={{
                                duration: Math.random() * 15 + 10,
                                repeat: Infinity,
                                delay: Math.random() * 5
                            }}>
                            <IconComponent />
                        </motion.div>
                    );
                })}

                {/* Gradient Orbs with Parallax */}
                <motion.div
                    animate={{
                        x: mousePosition.x * 2,
                        y: mousePosition.y * 2
                    }}
                    transition={{ type: 'spring', damping: 50 }}
                    className='absolute top-20 left-20 h-96 w-96 rounded-full bg-[#00a0e3]/5 blur-3xl'
                />
                <motion.div
                    animate={{
                        x: mousePosition.x * -2,
                        y: mousePosition.y * -2
                    }}
                    transition={{ type: 'spring', damping: 50 }}
                    className='absolute right-20 bottom-20 h-96 w-96 rounded-full bg-[#ef7f1a]/5 blur-3xl'
                />

                {/* Grid Pattern */}
                {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" /> */}
                <div className='brand-overlay' />
            </div>

            <div className='relative z-10 container mx-auto px-4'>
                {/* Header with animation */}
                <motion.div
                    className='mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}>
                    <div className='flex items-start gap-3'>
                        <div className={`rounded-2xl p-3 ${config.bgColor} ${config.borderColor} border`}>
                            {config.icon}
                        </div>
                        <div>
                            <div className='mb-1 flex items-center gap-2'>
                                <h2
                                    className={`text-2xl font-black md:text-3xl ${config.color} tracking-tight uppercase`}>
                                    {title}
                                </h2>
                                {type === 'discount' && (
                                    <span className='animate-pulse rounded-full bg-[#ef7f1a] px-2 py-1 text-xs font-bold text-white dark:bg-orange-600'>
                                        Chegirma
                                    </span>
                                )}
                            </div>
                            {subtitle && (
                                <p className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    <motion.a
                        href={viewAllLink}
                        className={`group flex items-center rounded-full px-5 py-2.5 text-sm font-bold transition-all md:text-base ${config.bgColor} ${config.color} hover:shadow-md`}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}>
                        {t('booksSection.viewAll')}
                        <ChevronRight size={18} className='ml-1 transition-transform group-hover:translate-x-1' />
                    </motion.a>
                </motion.div>

                {/* Custom Navigation */}
                <div className='relative'>
                    {/* Navigation Buttons
          <div className="absolute -top-14 right-0 flex gap-2 z-10">
            <motion.button
              ref={prevRef}
              className={`p-2.5 rounded-full bg-white dark:bg-slate-700 shadow-lg hover:shadow-xl transition-all ${
                !isHovered ? 'opacity-50' : 'opacity-100'
              } hover:bg-[#00a0e3] dark:hover:bg-blue-600 hover:text-white`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
            </motion.button>
            <motion.button
              ref={nextRef}
              className={`p-2.5 rounded-full bg-white dark:bg-slate-700 shadow-lg hover:shadow-xl transition-all ${
                !isHovered ? 'opacity-50' : 'opacity-100'
              } hover:bg-[#ef7f1a] dark:hover:bg-orange-600 hover:text-white`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={20} className="text-gray-700 dark:text-gray-300" />
            </motion.button>
          </div> */}

                    {/* Swiper Slider */}
                    <Swiper
                        slidesPerView={1.4}
                        spaceBetween={15}
                        loop={true}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current
                        }}
                        autoplay={
                            type !== 'author'
                                ? {
                                      delay: 5000,
                                      disableOnInteraction: false,
                                      pauseOnMouseEnter: true
                                  }
                                : false
                        }
                        modules={[Navigation, Autoplay]}
                        breakpoints={{
                            480: { slidesPerView: 2.2, spaceBetween: 15 },
                            640: { slidesPerView: 2.5, spaceBetween: 15 },
                            768: { slidesPerView: 3.2, spaceBetween: 20 },
                            1024: { slidesPerView: 4.2, spaceBetween: 20 },
                            1280: { slidesPerView: 5.2, spaceBetween: 25 }
                        }}
                        className='book-swiper mt-12 pb-12'>
                        {loading
                            ? Array.from({ length: 8 }).map((_, i) => (
                                  <SwiperSlide key={i}>
                                      <BookCardSkeleton />
                                  </SwiperSlide>
                              ))
                            : displayBooks.map((book, index) => (
                                  <SwiperSlide key={book._id}>
                                      <motion.div
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: index * 0.05 }}>
                                          <BookCard book={book} />
                                      </motion.div>
                                  </SwiperSlide>
                              ))}
                    </Swiper>
                </div>

                {/* View count for popular section */}
            </div>

            {/* Global Styles */}
            <style>{`
        .book-swiper {
          padding: 15px 5px !important;
          margin: -15px -5px !important;
        }
        
        .book-swiper .swiper-slide {
          height: auto;
          transition: all 0.3s ease;
        }
        
        .book-swiper .swiper-slide:hover {
          transform: translateY(-5px);
        }
        
        /* Hide default navigation */
        .book-swiper .swiper-button-next,
        .book-swiper .swiper-button-prev {
          display: none;
        }
        
        /* Custom scrollbar */
        .book-swiper::-webkit-scrollbar {
          height: 4px;
        }
        
        .book-swiper::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .dark .book-swiper::-webkit-scrollbar-track {
          background: #1e293b;
        }
        
        .book-swiper::-webkit-scrollbar-thumb {
          background: #00a0e3;
          border-radius: 10px;
        }
        
        .dark .book-swiper::-webkit-scrollbar-thumb {
          background: #3b82f6;
        }
        
        .book-swiper::-webkit-scrollbar-thumb:hover {
          background: #ef7f1a;
        }
        
        .dark .book-swiper::-webkit-scrollbar-thumb:hover {
          background: #f97316;
        }
        
        /* Shimmer animation */
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
        </motion.section>
    );
};
