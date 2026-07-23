'use client';

import { useMemo } from 'react';

import { BookCard } from '@/components/cards/BookCard';
import { BookCardSkeleton } from '@/components/cards/BookCardSkeleton';
import { usePublicCategoriesQuery } from '@/hooks/queries/usePublicCategoriesQuery';
import { bookService } from '@/services/book.service';
import type { Category } from '@/types';
import type { Book } from '@/types/book';
import { useQuery } from '@tanstack/react-query';

import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type RecommendationBook = Book & {
    subCategoryId?: string | { _id?: string };
    subCategory?: string | { _id?: string };
    subgenre?: string | { _id?: string };
};

type RekomendationProps = {
    book: RecommendationBook;
};

const getRelationValue = (value: unknown) => {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object') {
        const relation = value as { _id?: string; id?: string; slug?: string };
        return String(relation.slug || relation._id || relation.id || '');
    }

    return '';
};

const getGenreValue = (book: RecommendationBook, categories: Category[]) => {
    const directGenreValue =
        getRelationValue(book.subCategoryId) || getRelationValue(book.subCategory) || getRelationValue(book.subgenre);

    if (directGenreValue) return directGenreValue;

    for (const category of categories) {
        const subgenres = category.subgenres ?? category.subCategories ?? [];
        const matchedSubgenre = subgenres.find((subgenre) => subgenre.books?.includes(book._id));

        if (matchedSubgenre) return matchedSubgenre.slug || matchedSubgenre._id || '';
    }

    return '';
};

const getCategoryValue = (book: RecommendationBook) => {
    const categoryValues = Array.isArray(book.category) ? book.category : [book.category];

    for (const category of categoryValues) {
        const value = getRelationValue(category);
        if (value) return value;
    }

    return '';
};

export default function Rekomendation({ book }: RekomendationProps) {
    const { t } = useTranslation();
    const { data: categories = [], isLoading: categoriesLoading } = usePublicCategoriesQuery();
    const genreValue = useMemo(() => getGenreValue(book, categories), [book, categories]);
    const categoryValue = useMemo(() => getCategoryValue(book), [book]);
    const recommendationFilter = genreValue
        ? { key: 'subgenre', value: genreValue }
        : { key: 'category', value: categoryValue };
    const { data: genreBooksData, isLoading: genreBooksLoading } = useQuery({
        queryKey: ['genre-recommendations', recommendationFilter.key, recommendationFilter.value, book._id],
        queryFn: () =>
            bookService.getAllProducts({
                [recommendationFilter.key]: recommendationFilter.value,
                page: 1,
                limit: 12
            }),
        enabled: Boolean(recommendationFilter.value),
        staleTime: 5 * 60 * 1000
    });
    const genreBooks = useMemo(
        () => (genreBooksData?.products ?? []).filter((item) => item._id !== book._id),
        [book._id, genreBooksData?.products]
    );
    const isLoading = categoriesLoading || genreBooksLoading;

    if (!isLoading && genreBooks.length === 0) return null;

    return (
        <section className='mt-10'>
            <h2 className='text-2xl font-black text-slate-900 dark:text-white'>{t('bookDetail.sameGenreBooks')}</h2>

            {isLoading ? (
                <div className='mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <BookCardSkeleton key={index} />
                    ))}
                </div>
            ) : genreBooks.length > 4 ? (
                <Swiper
                    modules={[Autoplay]}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false
                    }}
                    spaceBetween={16}
                    slidesPerView={1.1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 }
                    }}
                    className='mt-5'>
                    {genreBooks.map((genreBook) => (
                        <SwiperSlide key={genreBook._id} className='h-auto'>
                            <BookCard book={genreBook} slug={genreBook.slug} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div className='mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    {genreBooks.map((genreBook) => (
                        <BookCard key={genreBook._id} book={genreBook} slug={genreBook.slug} />
                    ))}
                </div>
            )}
        </section>
    );
}
