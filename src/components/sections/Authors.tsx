'use client';

import Link from 'next/link';

import { api } from '@/services/api';
import { getImageUrl } from '@/utils/image';
import { useQuery } from '@tanstack/react-query';

import { BookOpenText } from 'lucide-react';
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

type AuthorsResponse = {
    authors?: AuthorItem[];
};

const AUTHORS_LIMIT = 3000;
const TOP_AUTHORS_LIMIT = 20;
const AUTHOR_FALLBACK_IMAGE = '/images/unUser.png';

const getAuthorBooksCount = (author: AuthorItem) => author.booksCount ?? author.bookCount ?? 0;

const Authors = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['authors-preview', AUTHORS_LIMIT],
        queryFn: async () => {
            const response = await api.get('/authors', {
                params: { page: 1, limit: AUTHORS_LIMIT }
            });

            return response.data?.data as AuthorsResponse;
        }
    });

    const authors = [...(data?.authors ?? [])]
        .sort((a, b) => (b.booksCount ?? b.bookCount ?? 0) - (a.booksCount ?? a.bookCount ?? 0))
        .slice(0, TOP_AUTHORS_LIMIT);

    if (!isLoading && authors.length === 0) return null;

    return (
        <section className='bg-background py-12 dark:bg-slate-950'>
            <div className='container mx-auto px-4'>
                <div className='relative mb-8 flex items-center justify-center'>
                    <h2 className='text-center text-3xl font-black tracking-tight text-slate-950 md:text-4xl dark:text-white'>
                        Mualliflar
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
                                    className='flex h-26.5 items-center overflow-hidden rounded-xl bg-white shadow-[0_18px_45px_-30px_rgba(15,23,42,0.55)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_-30px_rgba(15,23,42,0.75)] dark:bg-slate-900'>
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
                                            <span>{booksCount} kitob</span>
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
