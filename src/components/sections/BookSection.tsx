'use client';

import React, { useMemo, useRef } from 'react';

import { getSectionConfig } from '@/helpers/bookSection';
import { useBookSectionQuery } from '@/hooks/queries/useBookQueries';
import type { Book } from '@/types/book';
import type { BookSectionProps } from '@/types/section.types';

import { BookCard } from '../cards/BookCard';
import { BookCardSkeleton } from '../cards/BookCardSkeleton';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export const BookSection = ({ title, books, type = 'default', viewAllLink = '/catalog' }: BookSectionProps) => {
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    const { t } = useTranslation();

    const hasStaticBooks = Boolean(books?.length);
    const { data: fetchedBooks = [], isLoading } = useBookSectionQuery(type, !hasStaticBooks);

    const loading = !hasStaticBooks && isLoading;
    const displayBooks: Book[] = useMemo(
        () => (hasStaticBooks ? (books ?? []) : fetchedBooks),
        [books, fetchedBooks, hasStaticBooks]
    );

    const config = getSectionConfig(type);

    return (
        <section className='bg-background relative overflow-hidden py-5 sm:py-6 dark:bg-slate-900'>
            <div className='relative z-10 container mx-auto px-3 sm:px-4'>
                {/* Header with animation */}
                <motion.div
                    className='mb-5 flex flex-col items-start justify-between gap-3 sm:mb-8 md:flex-row md:items-center'
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}>
                    <div className='flex items-center gap-3'>
                        <span className={`h-9 w-1 shrink-0 rounded-full ${config.bgColor}`} />

                        <div className='min-w-0'>
                            <div className='flex flex-wrap items-center gap-2'>
                                <h2
                                    className={`text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl ${config.color}`}>
                                    {title}
                                </h2>

                                {type === 'discount' && (
                                    <span className='rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-600 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-400'>
                                        {t('booksSection.discountBadge')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <motion.a
                        href={viewAllLink}
                        className={`group flex items-center rounded-full px-4 py-2 text-sm font-bold transition-all sm:px-5 sm:py-2.5 md:text-base ${config.bgColor} ${config.color} hover:shadow-md`}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}>
                        {t('booksSection.viewAll')}
                        <ChevronRight size={18} className='ml-1 transition-transform group-hover:translate-x-1' />
                    </motion.a>
                </motion.div>

                {/* Custom Navigation */}
                <div className='relative'>
                    {/* Swiper Slider */}
                    <Swiper
                        slidesPerView={1.15}
                        spaceBetween={12}
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
                            420: { slidesPerView: 1.7, spaceBetween: 12 },
                            480: { slidesPerView: 2.05, spaceBetween: 14 },
                            640: { slidesPerView: 2.5, spaceBetween: 15 },
                            768: { slidesPerView: 3.2, spaceBetween: 20 },
                            1024: { slidesPerView: 4.2, spaceBetween: 20 },
                            1280: { slidesPerView: 5.2, spaceBetween: 25 }
                        }}
                        className='book-swiper mt-8 pb-10 sm:mt-12 sm:pb-12'>
                        {loading
                            ? Array.from({ length: 8 }).map((_, i) => (
                                  <SwiperSlide key={i}>
                                      <BookCardSkeleton />
                                  </SwiperSlide>
                              ))
                            : displayBooks.map((book, index) => (
                                  <SwiperSlide key={book._id}>
                                      <motion.div transition={{ delay: index * 0.05 }}>
                                          <BookCard book={book} />
                                      </motion.div>
                                  </SwiperSlide>
                              ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};
