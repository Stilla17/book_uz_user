'use client';

import { useMemo } from 'react';

import { BookCard } from '@/components/cards/BookCard';
import { BookCardSkeleton } from '@/components/cards/BookCardSkeleton';
import { useTopSalesQuery } from '@/hooks/queries/useTopSalesQuery';
import { TopSalesPeriod } from '@/services/topSales.service';
import { mapProductToCardBook } from '@/utils/book-formatters';

import { CalendarDays, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type TopSalesSectionProps = {
    period: TopSalesPeriod;
    title: string;
};

export const TopSalesSection = ({ period, title }: TopSalesSectionProps) => {
    const { t } = useTranslation();
    const { data, isLoading, isError } = useTopSalesQuery(period);
    const books = useMemo(() => (data?.products ?? []).map(mapProductToCardBook), [data?.products]);
    const Icon = period === 'week' ? Trophy : CalendarDays;

    return (
        <section className='bg-background py-6 dark:bg-slate-900'>
            <div className='container mx-auto px-4'>
                <div className='mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
                    <h2 className='text-2xl font-semibold tracking-tight text-[#ef7f1a] md:text-3xl dark:text-orange-400'>
                        {title}
                    </h2>

                    <span className='inline-flex h-11 w-fit items-center gap-2 rounded-2xl border border-orange-100 bg-white px-4 text-sm font-black text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'>
                        <Icon size={16} />
                        {t('booksSection.topSalesLabel')}
                    </span>
                </div>

                {isError ? (
                    <div className='rounded-2xl border border-red-100 bg-red-50 p-5 text-sm font-bold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300'>
                        {t('booksSection.topSalesLoadError')}
                    </div>
                ) : !isLoading && !books.length ? (
                    <div className='rounded-2xl border border-dashed border-orange-200 bg-[#fff9f3] p-8 text-center text-sm font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400'>
                        {t('booksSection.topSalesEmpty')}
                    </div>
                ) : (
                    <Swiper
                        key={period}
                        slidesPerView={1.4}
                        spaceBetween={15}
                        loop={books.length > 5}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        modules={[Navigation, Autoplay]}
                        breakpoints={{
                            480: { slidesPerView: 2.2, spaceBetween: 15 },
                            640: { slidesPerView: 2.5, spaceBetween: 15 },
                            768: { slidesPerView: 3.2, spaceBetween: 20 },
                            1024: { slidesPerView: 4.2, spaceBetween: 20 },
                            1280: { slidesPerView: 5.2, spaceBetween: 25 }
                        }}
                        className='book-swiper mt-12 pb-12'>
                        {isLoading
                            ? Array.from({ length: 10 }).map((_, index) => (
                                  <SwiperSlide key={index}>
                                      <BookCardSkeleton />
                                  </SwiperSlide>
                              ))
                            : books.map((book, index) => (
                                  <SwiperSlide key={book._id}>
                                      <div className='relative'>
                                          <span className='absolute top-1 left-3 z-20 rounded-full bg-[#ef7f1a] px-3 py-1 text-xs font-black text-white shadow-md'>
                                              #{index + 1}
                                          </span>
                                          <BookCard book={book} />
                                      </div>
                                  </SwiperSlide>
                              ))}
                    </Swiper>
                )}
            </div>
        </section>
    );
};
