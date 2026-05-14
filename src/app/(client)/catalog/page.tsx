'use client';

import { useEffect, useMemo, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { BookCard, type Book as CardBook } from '@/components/cards/BookCard';
import { BookCardSkeleton } from '@/components/cards/BookCardSkeleton';
import AsideFilter from '@/components/filter/AsideFilter';
import PanelResults, { type CatalogViewMode } from '@/components/filter/PanelResults';
import { Pagination } from '@/components/shared/Pagination';
import { usePublicCategoriesQuery } from '@/hooks/queries/usePublicCategoriesQuery';
import { bookService } from '@/services/book.service';
import type { CatalogFilters, Product } from '@/types';
import { useQuery } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import { RefreshCcw, Search } from 'lucide-react';

const DEFAULT_FILTERS: CatalogFilters = {
    keyword: '',
    category: '',
    subgenre: '',
    author: '',
    publisher: '',
    language: '',
    minPrice: '',
    maxPrice: ''
};

const PAGE_LIMIT = 12;
const CATALOG_GRID_CLASS_NAME = 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3';
const CATALOG_LIST_CLASS_NAME = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

type TextLike =
    | string
    | { uz?: unknown; ru?: unknown; en?: unknown; name?: unknown; title?: unknown }
    | null
    | undefined;
type ProductShape = Product & {
    title?: TextLike;
    author?: string | { name?: unknown };
};

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

const parsePage = (value: string | null) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const parseFilters = (params: { get: (key: string) => string | null }): CatalogFilters => ({
    keyword: params.get('search') ?? '',
    category: params.get('category') ?? '',
    subgenre: params.get('subgenre') ?? '',
    author: params.get('author') ?? '',
    publisher: params.get('publisher') ?? '',
    language: params.get('language') ?? '',
    minPrice: params.get('minPrice') ?? '',
    maxPrice: params.get('maxPrice') ?? ''
});

const mapProductToCardBook = (product: Product): CardBook => {
    const productShape = product as ProductShape;
    const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
    const oldPrice = product.discountPrice && product.discountPrice > 0 ? product.price : undefined;
    const discount = oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : undefined;

    return {
        _id: product._id,
        slug: product.slug,
        title: getText(productShape.title, 'Nomalum kitob'),
        author: getAuthorName(productShape.author),
        price,
        oldPrice,
        rating: product.ratingAvg || 0,
        stock: product.stock || 0,
        image: product.images?.[0],
        discount,
        isHit: product.isTop,
        isNew: false,
        format: product.format
    };
};

const getLanguageParams = (language: string) => {
    if (language === 'kr') {
        return { language: 'uz', contentLanguage: 'cyrillic' };
    }

    if (language === 'uz') {
        return { language: 'uz', contentLanguage: 'latin' };
    }

    return language ? { language } : {};
};

export default function CatalogPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchParamsKey = searchParams.toString();

    const [filters, setFilters] = useState<CatalogFilters>(() => parseFilters(searchParams));
    const [page, setPage] = useState(() => parsePage(searchParams.get('page')));
    const [viewMode, setViewMode] = useState<CatalogViewMode>('grid');

    useEffect(() => {
        const nextFilters = parseFilters(searchParams);
        setFilters(nextFilters);
        setPage(parsePage(searchParams.get('page')));
    }, [searchParams, searchParamsKey]);

    const { data: categories = [] } = usePublicCategoriesQuery();

    const selectedCategory = useMemo(
        () => categories.find((category) => category._id === filters.category || category.slug === filters.category),
        [categories, filters.category]
    );

    const requestParams = useMemo(
        () => ({
            page,
            limit: PAGE_LIMIT,
            ...(filters.keyword && { keyword: filters.keyword }),
            ...(selectedCategory?._id && { category: selectedCategory._id }),
            ...(!selectedCategory && filters.category && { category: filters.category }),
            ...(filters.subgenre && { subgenre: filters.subgenre }),
            ...(filters.author && { author: filters.author }),
            ...(filters.publisher && { publisher: filters.publisher }),
            ...getLanguageParams(filters.language),
            ...(filters.minPrice && { minPrice: Number(filters.minPrice) }),
            ...(filters.maxPrice && { maxPrice: Number(filters.maxPrice) })
        }),
        [filters, page, selectedCategory]
    );
    const shouldUseAuthorProducts =
        Boolean(filters.author) &&
        !filters.keyword &&
        !filters.category &&
        !filters.subgenre &&
        !filters.publisher &&
        !filters.language &&
        !filters.minPrice &&
        !filters.maxPrice;

    const {
        data: productsData,
        isLoading: productsLoading,
        isError,
        refetch
    } = useQuery({
        queryKey: ['catalog-products', shouldUseAuthorProducts ? 'author-products' : 'all-products', requestParams],
        queryFn: () =>
            shouldUseAuthorProducts && filters.author
                ? bookService.getProductsByAuthor(filters.author, { page, limit: PAGE_LIMIT })
                : bookService.getAllProducts(requestParams)
    });

    const products = productsData?.products ?? [];
    const pagination = productsData?.pagination ?? { page: 1, limit: PAGE_LIMIT, total: 0, pages: 1 };
    const cardBooks = useMemo(() => products.map(mapProductToCardBook), [products]);
    const resultsClassName = viewMode === 'grid' ? CATALOG_GRID_CLASS_NAME : CATALOG_LIST_CLASS_NAME;
    const totalPages = Math.max(1, pagination.pages || 1);
    const currentPage = Math.min(Math.max(page, 1), totalPages);

    useEffect(() => {
        if (!productsData || page <= totalPages) return;
        setPage(totalPages);
        syncUrl(filters, totalPages);
    }, [page, productsData, totalPages]);

    function buildQueryString(nextFilters: CatalogFilters, nextPage: number) {
        const params = new URLSearchParams();
        if (nextFilters.keyword) params.set('search', nextFilters.keyword);
        if (nextFilters.category) params.set('category', nextFilters.category);
        if (nextFilters.subgenre) params.set('subgenre', nextFilters.subgenre);
        if (nextFilters.author) params.set('author', nextFilters.author);
        if (nextFilters.publisher) params.set('publisher', nextFilters.publisher);
        if (nextFilters.language) params.set('language', nextFilters.language);
        if (nextFilters.minPrice) params.set('minPrice', nextFilters.minPrice);
        if (nextFilters.maxPrice) params.set('maxPrice', nextFilters.maxPrice);
        if (nextPage > 1) params.set('page', String(nextPage));
        return params.toString();
    }

    function syncUrl(nextFilters: CatalogFilters, nextPage: number) {
        const queryString = buildQueryString(nextFilters, nextPage);
        if (queryString === searchParamsKey) return;
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    }

    function applyFilters(nextFilters: CatalogFilters, nextPage = 1) {
        setFilters(nextFilters);
        setPage(nextPage);
        syncUrl(nextFilters, nextPage);
    }

    function clearFilters() {
        applyFilters(DEFAULT_FILTERS, 1);
    }

    function handlePageChange(nextPage: number) {
        if (nextPage < 1 || nextPage > totalPages) return;
        setPage(nextPage);
        syncUrl(filters, nextPage);
    }

    return (
        <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,160,227,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(239,127,26,0.14),_transparent_30%),linear-gradient(180deg,_#fffaf5_0%,_#ffffff_40%,_#f7fbfe_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(0,160,227,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(239,127,26,0.10),_transparent_30%),linear-gradient(180deg,_#0f172a_0%,_#111827_45%,_#0b1220_100%)]'>
            <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
                <div className='mt-6 grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]'>
                    <AsideFilter filters={filters} onChange={applyFilters} onClear={clearFilters} />

                    <motion.section
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.14 }}
                        className='space-y-4'>
                        <PanelResults total={pagination.total} viewMode={viewMode} onViewModeChange={setViewMode} />

                        {isError ? (
                            <div className='rounded-[1.75rem] border border-red-200 bg-white/90 p-8 text-center shadow-sm dark:border-red-900/60 dark:bg-slate-900/90'>
                                <p className='text-xl text-slate-900 dark:text-white'>Katalog yuklanmadi</p>
                                <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>
                                    API yoki tarmoq bilan bogliq vaqtinchalik muammo bolishi mumkin.
                                </p>
                                <button
                                    type='button'
                                    onClick={() => refetch()}
                                    className='mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white dark:bg-[#ef7f1a]'>
                                    <RefreshCcw size={16} />
                                    Qayta urinish
                                </button>
                            </div>
                        ) : productsLoading ? (
                            <div className={resultsClassName}>
                                {Array.from({ length: PAGE_LIMIT }).map((_, index) => (
                                    <BookCardSkeleton key={index} />
                                ))}
                            </div>
                        ) : cardBooks.length > 0 ? (
                            <>
                                <div className={resultsClassName}>
                                    {cardBooks.map((book, index) => (
                                        <motion.div
                                            key={book._id}
                                            initial={{ opacity: 0, y: 18 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}>
                                            <BookCard book={book} />
                                        </motion.div>
                                    ))}
                                </div>

                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        ) : (
                            <div className='rounded-[1.75rem] border border-dashed border-slate-300 bg-white/90 p-10 text-center dark:border-slate-700 dark:bg-slate-900/85'>
                                <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'>
                                    <Search size={22} />
                                </div>
                                <h3 className='mt-4 text-2xl text-slate-900 dark:text-white'>Natija topilmadi</h3>
                                <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400'>
                                    Tanlangan filterlar boyicha kitob topilmadi. Filterlarni soddalashtirib qayta urinib
                                    koring.
                                </p>
                                <button
                                    type='button'
                                    onClick={clearFilters}
                                    className='mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-[#ef7f1a]'>
                                    <RefreshCcw size={16} />
                                    Filterlarni tozalash
                                </button>
                            </div>
                        )}
                    </motion.section>
                </div>
            </div>
        </div>
    );
}
