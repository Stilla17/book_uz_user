'use client';

import React, { useEffect, useRef, useState } from 'react';

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

type TextLike =
    | string
    | { uz?: unknown; ru?: unknown; en?: unknown; name?: unknown; title?: unknown }
    | null
    | undefined;
type ProductShape = Product & {
    title?: TextLike;
    author?: string | { name?: unknown };
};

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

    const getText = (value: TextLike, fallback: string): string => {
        if (!value) return fallback;
        if (typeof value === 'string') return value || fallback;
        if (typeof value.uz === 'string') return value.uz;
        if (typeof value.ru === 'string') return value.ru;
        if (typeof value.en === 'string') return value.en;
        if (typeof value.name === 'string') return value.name;
        if (typeof value.title === 'string') return value.title;

        return fallback;
    };

    const getAuthorName = (author: ProductShape['author']) => {
        if (!author) return "Noma'lum muallif";
        if (typeof author === 'string') return author;

        return getText({ name: author.name }, "Noma'lum muallif");
    };

    const mapProductToBook = (product: Product): Book => {
        const productShape = product as ProductShape;
        const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
        const oldPrice = product.discountPrice && product.discountPrice > 0 ? product.price : undefined;
        const discount = oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : undefined;

        return {
            _id: product._id,
            slug: product.slug,
            title: getText(productShape.title, "Noma'lum kitob"),
            author: getAuthorName(productShape.author),
            price,
            oldPrice,
            rating: product.ratingAvg || 0,
            ratingAvg: product.ratingAvg || 0,
            ratingCount: product.ratingCount || 0,
            reviewsCount: product.ratingCount || 0,
            views: product.views,
            viewsCount: product.viewsCount,
            stock: product.stock,
            image: product.images?.[0],
            discount,
            isHit: product.isTop,
            isNew: type === 'new',
            format: product.format
        };
    };

    const getRequestParams = () => ({
        limit: 8,
        ...(type === 'popular' && { isTop: true }),
        ...(type === 'discount' && { isDiscount: true }),
        ...(type === 'audio' && { format: 'audio' })
    });

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
                const response = await bookService.getAllProducts(getRequestParams());
                if (!ignore) {
                    setFetchedBooks(response.products.map(mapProductToBook));
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
        <section
            className='bg-background relative overflow-hidden py-12 dark:bg-slate-900'>

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
