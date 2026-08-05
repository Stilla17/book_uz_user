'use client';

import Link from 'next/link';

import { useTopAuthorsQuery } from '@/hooks/queries/useAuthorQueries';
import { getImageUrl } from '@/utils/image';

import { BookOpenText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type AuthorItem = {
    _id: string;
    name: string;
    slug?: string;
    image?: string;
    booksCount?: number;
    bookCount?: number;
};

const TOP_AUTHORS_LIMIT = 20;
const AUTHOR_FALLBACK_IMAGE = '/images/unUser.png';

const getAuthorBooksCount = (author: AuthorItem) => author.booksCount ?? author.bookCount ?? 0;

const Authors = () => {
    const { t } = useTranslation();
    const { data, isLoading } = useTopAuthorsQuery(TOP_AUTHORS_LIMIT);

    const authors = (data?.authors ?? []).slice(0, TOP_AUTHORS_LIMIT);

    if (!isLoading && authors.length === 0) return null;

    return (
        <section className='bg-background py-12 dark:bg-slate-950'>
            <div className='container mx-auto px-4'>
                <div className='flex max-w-2xl gap-4'>
                    <span className='h-9 w-1 shrink-0 rounded-full bg-[#ef7f1a]/30'></span>
                    <h2 className='mb-12 text-2xl font-black tracking-tight text-slate-950 md:text-3xl dark:text-white'>
                        {t('authorsSection.title')}
                    </h2>
                </div>

                <Swiper
                    modules={[Navigation, Autoplay]}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false
                    }}
                    loop={true}
                    spaceBetween={20}
                    slidesPerView={1.05}
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        1024: { slidesPerView: 3, spaceBetween: 22 },
                        1280: { slidesPerView: 4, spaceBetween: 24 }
                    }}
                    className='overflow-visible'>
                    {(isLoading ? Array.from({ length: 4 }) : authors).map((author, index) => {
                        if (isLoading) {
                            return (
                                <SwiperSlide key={index}>
                                    <div className='h-29 animate-pulse rounded-xl bg-white shadow-sm dark:bg-slate-800' />
                                </SwiperSlide>
                            );
                        }

                        const authorItem = author as AuthorItem;
                        const booksCount = getAuthorBooksCount(authorItem);

                        return (
                            <SwiperSlide key={authorItem._id}>
                                <Link
                                    href={`/catalog?author=${encodeURIComponent(authorItem._id)}`}
                                    className='flex h-26.5 items-center overflow-hidden rounded-xl bg-white transition hover:-translate-y-1 hover:shadow-sm dark:bg-slate-900'>
                                    <div className='h-26.6 w-25 flex-none overflow-hidden rounded-xl'>
                                        <img
                                            src={getImageUrl(authorItem.image) || AUTHOR_FALLBACK_IMAGE}
                                            alt={authorItem.name}
                                            className='h-full w-full rounded-full object-contain transition duration-500'
                                        />
                                    </div>

                                    <div className='min-w-0 px-4'>
                                        <h3 className='truncate text-base font-black text-slate-950 transition group-hover:text-[#ef7f1a] dark:text-white'>
                                            {authorItem.name}
                                        </h3>
                                        <div className='mt-2 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400'>
                                            <BookOpenText size={15} />
                                            <span>{t('authorsSection.booksCount', { count: booksCount })}</span>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </section>
    );
};

export default Authors;
