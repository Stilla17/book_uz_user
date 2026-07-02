'use client';

import { useEffect, useMemo, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { BookCard } from '@/components/cards/BookCard';
import { BookCardSkeleton } from '@/components/cards/BookCardSkeleton';
import AsideFilter from '@/components/filter/AsideFilter';
import PanelResults, { type CatalogViewMode } from '@/components/filter/PanelResults';
import { Pagination } from '@/components/shared/Pagination';
import { buildQueryString, getLanguageParams, parseFilters, parsePage } from '@/helpers/catalog';
import { bookService } from '@/services/book.service';
import type { CatalogFilters } from '@/types';
import { mapProductToCardBook } from '@/utils/book-formatters';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import { RefreshCcw, Search } from 'lucide-react';

const DEFAULT_FILTERS: CatalogFilters = {
    keyword: '',
    category: [],
    subgenre: [],
    author: [],
    publisher: [],
    language: '',
    minPrice: '',
    maxPrice: ''
};

const PAGE_LIMIT = 12;
const CATALOG_GRID_CLASS_NAME = 'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3';
const CATALOG_LIST_CLASS_NAME = 'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4';

export default function CatalogPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const searchParamsKey = searchParams.toString();

    const [filters, setFilters] = useState<CatalogFilters>(() => parseFilters(searchParams));
    const [page, setPage] = useState(() => parsePage(searchParams.get('page')));
    const [viewMode, setViewMode] = useState<CatalogViewMode>('grid');

    useEffect(() => {
        const nextFilters = parseFilters(searchParams);
        setFilters(nextFilters);
        setPage(parsePage(searchParams.get('page')));
    }, [searchParams, searchParamsKey]);

    const requestParams = useMemo(
        () => ({
            page,
            limit: PAGE_LIMIT,
            sort: '-createdAt',
            ...(filters.keyword && { keyword: filters.keyword }),
            ...(filters.category.length > 0 ? { category: filters.category.join(',') } : {}),
            ...(filters.subgenre.length > 0 ? { subgenre: filters.subgenre.join(',') } : {}),
            ...(filters.author.length > 0 ? { author: filters.author.join(',') } : {}),
            ...(filters.publisher.length > 0 ? { publisher: filters.publisher.join(',') } : {}),
            ...getLanguageParams(filters.language),
            ...(filters.minPrice && { minPrice: Number(filters.minPrice) }),
            ...(filters.maxPrice && { maxPrice: Number(filters.maxPrice) })
        }),
        [filters, page]
    );
    
    const shouldUseAuthorProducts = false;

    const {
        data: productsData,
        isLoading: productsLoading,
        isError,
        refetch
    } = useQuery({
        queryKey: ['catalog-products', shouldUseAuthorProducts ? 'author-products' : 'all-products', requestParams],
        queryFn: () =>
            shouldUseAuthorProducts && filters.author.length === 1
                ? bookService.getProductsByAuthor(filters.author[0], { page, limit: PAGE_LIMIT })
                : bookService.getAllProducts(requestParams),
        placeholderData: (previousData) => previousData,
        staleTime: 5 * 60 * 1000
    });

    const products = productsData?.products ?? [];
    const pagination = productsData?.pagination ?? { page: 1, limit: PAGE_LIMIT, total: 0, pages: 1 };
    const cardBooks = useMemo(() => products.map(mapProductToCardBook), [products]);
    const resultsClassName = viewMode === 'grid' ? CATALOG_GRID_CLASS_NAME : CATALOG_LIST_CLASS_NAME;
    const totalPages = Math.max(1, pagination.pages || 1);
    const currentPage = Math.min(Math.max(page, 1), totalPages);

    useEffect(() => {
        if (!productsData || page >= totalPages) return;

        const nextRequestParams = { ...requestParams, page: page + 1 };
        queryClient.prefetchQuery({
            queryKey: [
                'catalog-products',
                shouldUseAuthorProducts ? 'author-products' : 'all-products',
                nextRequestParams
            ],
            queryFn: () =>
                shouldUseAuthorProducts && filters.author.length === 1
                    ? bookService.getProductsByAuthor(filters.author[0], { page: page + 1, limit: PAGE_LIMIT })
                    : bookService.getAllProducts(nextRequestParams),
            staleTime: 5 * 60 * 1000
        });
    }, [filters.author, page, productsData, queryClient, requestParams, shouldUseAuthorProducts, totalPages]);

    useEffect(() => {
        if (!productsData || page <= totalPages) return;
        setPage(totalPages);
        syncUrl(filters, totalPages);
    }, [page, productsData, totalPages]);

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
        <div className='min-h-screen'>
            <div className='mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8'>
                <div className='mt-3 grid gap-4 sm:mt-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-6'>
                    <AsideFilter filters={filters} onChange={applyFilters} onClear={clearFilters} />

                    <motion.section
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.14 }}
                        className='min-w-0 space-y-4'>
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
