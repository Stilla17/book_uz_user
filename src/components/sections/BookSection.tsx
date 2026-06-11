'use client';

import React, { useEffect, useRef, useState } from 'react';

import {
    ProductShape,
    TextLike,
    getRequestParams,
    getSectionConfig,
    getText,
    mapProductToBook
} from '@/helpers/bookSection';
import { bookService } from '@/services/book.service';
import type { Product } from '@/types';
import type { Book } from '@/types/book';
import type { BookSectionProps } from '@/types/section.types';

import { BookCard } from '../cards/BookCard';
import { BookCardSkeleton } from '../cards/BookCardSkeleton';
import { motion } from 'framer-motion';
import { Award, BookOpen, ChevronRight, Flame, Headphones, Sparkles, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export const BookSection = ({
    title,
    subtitle,
    books,
    type = 'default',
    viewAllLink = '/catalog'
}: BookSectionProps) => {
    const [loading, setLoading] = useState(true);
    const [fetchedBooks, setFetchedBooks] = useState<Book[]>([]);
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    const { t } = useTranslation();

    useEffect(() => {
        let ignore = false;

        const loadBooks = async () => {
            if (books && books.length > 0) {
                setFetchedBooks([]);
                setLoading(false);

                return;
            }

            setLoading(true);

            try {
                const response = await bookService.getAllProducts(getRequestParams(type));
                if (!ignore) {
                    setFetchedBooks(response.products.map((product) => mapProductToBook(product, type)));
                }
            } catch (error) {
                console.error('BookSection kitoblari yuklanmadi:', error);
                if (!ignore) {
                    setFetchedBooks([]);
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadBooks();

        return () => {
            ignore = true;
        };
    }, [books, type]);

    const displayBooks: Book[] = books && books.length > 0 ? books : fetchedBooks;

    const config = getSectionConfig(type);

    return (
        <section className='bg-background relative overflow-hidden py-6 dark:bg-slate-900'>
            {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" /> */}
            <div className='brand-overlay' />

            <div className='relative z-10 container mx-auto px-4'>
                {/* Header with animation */}
                <motion.div
                    className='mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}>
                    <div className='flex items-center gap-3'>
                        <span className={`h-9 w-1 shrink-0 rounded-full ${config.bgColor}`} />

                        <div className='min-w-0'>
                            <div className='flex flex-wrap items-center gap-2'>
                                <h2 className={`text-2xl font-semibold tracking-tight md:text-3xl ${config.color}`}>
                                    {title}
                                </h2>

                                {type === 'discount' && (
                                    <span className='rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-600 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-400'>
                                        Chegirma
                                    </span>
                                )}
                            </div>
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
