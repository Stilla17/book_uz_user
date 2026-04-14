'use client';

import { type FormEvent, useEffect, useMemo, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { BookCard, type Book as CardBook } from '@/components/cards/BookCard';
import { BookCardSkeleton } from '@/components/cards/BookCardSkeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { usePublicCategoriesQuery } from '@/hooks/queries/usePublicCategoriesQuery';
import { bookService } from '@/services/book.service';
import type { Product } from '@/types';
import type { Category as PublicCategory } from '@/types/category.types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import { Filter, Grid3x3, Headphones, Layers3, RefreshCcw, Search, Sparkles, Star, Tag } from 'lucide-react';

type CatalogFilters = {
    keyword: string;
    category: string;
    author: string;
    publisher: string;
    format: string;
    language: string;
    sort: string;
    isDiscount: boolean;
    isTop: boolean;
    inStock: boolean;
    minPrice: string;
    maxPrice: string;
};

type CatalogGridMode = 'comfortable' | 'compact';

const DEFAULT_FILTERS: CatalogFilters = {
    keyword: '',
    category: '',
    author: '',
    publisher: '',
    format: '',
    language: '',
    sort: '-createdAt',
    isDiscount: false,
    isTop: false,
    inStock: false,
    minPrice: '',
    maxPrice: ''
};

const PAGE_LIMIT = 12;

const FORMAT_OPTIONS = [
    { value: '', label: 'Barcha formatlar' },
    { value: 'ebook', label: 'Elektron kitob' },
    { value: 'audio', label: 'Audio kitob' },
    { value: 'paper', label: 'Qogoz kitob' }
] as const;

const LANGUAGE_OPTIONS = [
    { value: '', label: 'Barcha tillar' },
    { value: 'uz', label: 'Ozbekcha' },
    { value: 'kr', label: 'Kirilcha' },
    { value: 'ru', label: 'Ruscha' },
    { value: 'en', label: 'Inglizcha' }
] as const;

const PRICE_SLIDER_MIN = 0;
const PRICE_SLIDER_MAX = 1000000;
const PRICE_SLIDER_STEP = 5000;

const GRID_MODE_OPTIONS: Array<{
    value: CatalogGridMode;
    label: string;
    icon: typeof Grid3x3;
    gridClassName: string;
}> = [
    {
        value: 'comfortable',
        label: 'Standart grid',
        icon: Grid3x3,
        gridClassName: 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3'
    },
    {
        value: 'compact',
        label: 'Zich grid',
        icon: Layers3,
        gridClassName: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }
] as const;

const parseBoolean = (value: string | null) => value === 'true';

const parsePage = (value: string | null) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const parseFilters = (params: { get: (key: string) => string | null }): CatalogFilters => ({
    keyword: params.get('search') ?? '',
    category: params.get('category') ?? '',
    author: params.get('author') ?? '',
    publisher: params.get('publisher') ?? '',
    format: params.get('format') ?? '',
    language: params.get('language') ?? '',
    sort: params.get('sort') ?? DEFAULT_FILTERS.sort,
    isDiscount: parseBoolean(params.get('isDiscount')),
    isTop: parseBoolean(params.get('isTop')),
    inStock: parseBoolean(params.get('inStock')),
    minPrice: params.get('minPrice') ?? '',
    maxPrice: params.get('maxPrice') ?? ''
});

const getCategoryTitle = (category: PublicCategory) => category.title.uz || category.title.ru || category.title.en;

const getFormatLabel = (format?: string) => {
    if (format === 'audio') return 'Audio';
    if (format === 'ebook') return 'E-book';
    if (format === 'paper') return 'Bosma';
    return 'Kitob';
};

const getPriceRangeLabel = (minPrice: string, maxPrice: string) => {
    if (minPrice && maxPrice) {
        return `${Number(minPrice).toLocaleString('uz-UZ')} - ${Number(maxPrice).toLocaleString('uz-UZ')} som`;
    }
    if (minPrice) {
        return `${Number(minPrice).toLocaleString('uz-UZ')} somdan yuqori`;
    }
    if (maxPrice) {
        return `${Number(maxPrice).toLocaleString('uz-UZ')} somgacha`;
    }
    return '';
};

const parsePriceValue = (value: string, fallback: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const formatPricePill = (value: number) => {
    if (value >= 1000000) {
        const millions = value / 1000000;
        return `${Number.isInteger(millions) ? millions : millions.toFixed(1)} mln`;
    }

    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)} ming`;
};

const getVisiblePages = (currentPage: number, totalPages: number) => {
    if (totalPages <= 1) return [1];

    const pages = new Set<number>([1, totalPages, currentPage]);
    if (currentPage - 1 > 1) pages.add(currentPage - 1);
    if (currentPage + 1 < totalPages) pages.add(currentPage + 1);
    if (currentPage - 2 > 1) pages.add(currentPage - 2);
    if (currentPage + 2 < totalPages) pages.add(currentPage + 2);

    return Array.from(pages).sort((a, b) => a - b);
};

const mapProductToCardBook = (product: Product): CardBook => {
    const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
    const oldPrice = product.discountPrice && product.discountPrice > 0 ? product.price : undefined;
    const discount = oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : undefined;

    return {
        _id: product._id,
        title: product.title.uz || product.title.ru || product.title.en || 'Nomalum kitob',
        author: product.author,
        price,
        oldPrice,
        rating: product.ratingAvg || 0,
        reviewsCount: product.ratingCount || 0,
        image: product.images?.[0],
        discount,
        isHit: product.isTop,
        isNew: false,
        format: product.format
    };
};

export default function CatalogPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchParamsKey = searchParams.toString();

    const [filters, setFilters] = useState<CatalogFilters>(() => parseFilters(searchParams));
    const [searchInput, setSearchInput] = useState(() => parseFilters(searchParams).keyword);
    const [page, setPage] = useState(() => parsePage(searchParams.get('page')));
    const [gridMode, setGridMode] = useState<CatalogGridMode>('comfortable');
    const [priceRange, setPriceRange] = useState<[number, number]>(() => {
        const parsedFilters = parseFilters(searchParams);

        return [
            parsePriceValue(parsedFilters.minPrice, PRICE_SLIDER_MIN),
            parsePriceValue(parsedFilters.maxPrice, PRICE_SLIDER_MAX)
        ];
    });

    useEffect(() => {
        const nextFilters = parseFilters(searchParams);
        setFilters(nextFilters);
        setSearchInput(nextFilters.keyword);
        setPage(parsePage(searchParams.get('page')));
        setPriceRange([
            parsePriceValue(nextFilters.minPrice, PRICE_SLIDER_MIN),
            parsePriceValue(nextFilters.maxPrice, PRICE_SLIDER_MAX)
        ]);
    }, [searchParams, searchParamsKey]);

    const { data: categories = [], isLoading: categoriesLoading } = usePublicCategoriesQuery();

    const selectedCategory = useMemo(
        () => categories.find((category) => category._id === filters.category || category.slug === filters.category),
        [categories, filters.category]
    );

    const requestParams = useMemo(
        () => ({
            page,
            limit: PAGE_LIMIT,
            sort: filters.sort,
            ...(filters.keyword && { search: filters.keyword }),
            ...(selectedCategory?._id && { category: selectedCategory._id }),
            ...(!selectedCategory && filters.category && { category: filters.category }),
            ...(filters.author && { author: filters.author }),
            ...(filters.publisher && { publisher: filters.publisher }),
            ...(filters.format && { format: filters.format }),
            ...(filters.language && { language: filters.language }),
            ...(filters.minPrice && { minPrice: Number(filters.minPrice) }),
            ...(filters.maxPrice && { maxPrice: Number(filters.maxPrice) }),
            ...(filters.isDiscount && { isDiscount: true }),
            ...(filters.isTop && { isTop: true }),
            ...(filters.inStock && { inStock: true })
        }),
        [filters, page, selectedCategory]
    );

    const {
        data: productsData,
        isLoading: productsLoading,
        isFetching: productsFetching,
        isError,
        refetch
    } = useQuery({
        queryKey: ['catalog-products', requestParams],
        queryFn: () => bookService.getProducts(requestParams),
        placeholderData: keepPreviousData
    });

    const products = productsData?.products ?? [];
    const pagination = productsData?.pagination ?? { page: 1, limit: PAGE_LIMIT, total: 0, pages: 1 };
    const cardBooks = useMemo(() => products.map(mapProductToCardBook), [products]);
    const gridClassName =
        GRID_MODE_OPTIONS.find((option) => option.value === gridMode)?.gridClassName ??
        GRID_MODE_OPTIONS[0].gridClassName;

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.keyword) count += 1;
        if (filters.category) count += 1;
        if (filters.author) count += 1;
        if (filters.publisher) count += 1;
        if (filters.format) count += 1;
        if (filters.language) count += 1;
        if (filters.isDiscount) count += 1;
        if (filters.isTop) count += 1;
        if (filters.inStock) count += 1;
        if (filters.minPrice) count += 1;
        if (filters.maxPrice) count += 1;
        if (filters.sort !== DEFAULT_FILTERS.sort) count += 1;
        return count;
    }, [filters]);

    const authorOptions = useMemo(() => {
        const map = new Map<string, string>();

        products.forEach((product) => {
            if (!product.author?._id || !product.author.name) return;
            map.set(product.author._id, product.author.name);
        });

        return Array.from(map.entries())
            .map(([value, label]) => ({ value, label }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [products]);

    const publisherOptions = useMemo(() => {
        const set = new Set<string>();

        products.forEach((product) => {
            if (product.publisher?.trim()) {
                set.add(product.publisher.trim());
            }
        });

        return Array.from(set)
            .map((value) => ({ value, label: value }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [products]);

    const quickFilters = [
        { label: 'Yangi', icon: Sparkles, action: () => applyPreset({ sort: '-createdAt' }) },
        { label: 'Chegirma', icon: Tag, action: () => applyPreset({ isDiscount: true }) },
        { label: 'Top 100', icon: Star, action: () => applyPreset({ isTop: true }) },
        { label: 'Audio', icon: Headphones, action: () => applyPreset({ format: 'audio' }) }
    ];

    function buildQueryString(nextFilters: CatalogFilters, nextPage: number) {
        const params = new URLSearchParams();
        if (nextFilters.keyword) params.set('search', nextFilters.keyword);
        if (nextFilters.category) params.set('category', nextFilters.category);
        if (nextFilters.author) params.set('author', nextFilters.author);
        if (nextFilters.publisher) params.set('publisher', nextFilters.publisher);
        if (nextFilters.format) params.set('format', nextFilters.format);
        if (nextFilters.language) params.set('language', nextFilters.language);
        if (nextFilters.sort !== DEFAULT_FILTERS.sort) params.set('sort', nextFilters.sort);
        if (nextFilters.isDiscount) params.set('isDiscount', 'true');
        if (nextFilters.isTop) params.set('isTop', 'true');
        if (nextFilters.inStock) params.set('inStock', 'true');
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

    function patchFilters(patch: Partial<CatalogFilters>) {
        applyFilters({ ...filters, ...patch }, 1);
    }

    function applyPreset(preset: Partial<CatalogFilters>) {
        applyFilters({ ...DEFAULT_FILTERS, ...filters, ...preset }, 1);
    }

    function clearFilters() {
        setSearchInput('');
        applyFilters(DEFAULT_FILTERS, 1);
    }

    function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        patchFilters({ keyword: searchInput.trim() });
    }

    function handlePageChange(nextPage: number) {
        if (nextPage < 1 || nextPage > pagination.pages) return;
        setPage(nextPage);
        syncUrl(filters, nextPage);
    }

    function handlePriceRangeChange(values: number[]) {
        if (values.length !== 2) return;
        setPriceRange([values[0], values[1]]);
    }

    function handlePriceRangeCommit(values: number[]) {
        if (values.length !== 2) return;

        const [minValue, maxValue] = values;

        patchFilters({
            minPrice: minValue <= PRICE_SLIDER_MIN ? '' : String(minValue),
            maxPrice: maxValue >= PRICE_SLIDER_MAX ? '' : String(maxValue)
        });
    }

    const pageNumbers = getVisiblePages(page, pagination.pages);

    return (
        <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,160,227,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(239,127,26,0.14),_transparent_30%),linear-gradient(180deg,_#fffaf5_0%,_#ffffff_40%,_#f7fbfe_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(0,160,227,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(239,127,26,0.10),_transparent_30%),linear-gradient(180deg,_#0f172a_0%,_#111827_45%,_#0b1220_100%)]'>
            <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
                <div className='mt-6 grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]'>
                    <motion.aside
                        initial={{ opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className='space-y-4'>
                        <div className='rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_80px_-46px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/80'>
                            <div className='mb-4 flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                    <Filter size={18} className='text-[#00a0e3] dark:text-orange-300' />
                                    <h3 className='text-xl text-slate-900 dark:text-white'>Filterlar</h3>
                                </div>
                                {activeFilterCount > 0 && (
                                    <button
                                        type='button'
                                        onClick={clearFilters}
                                        className='text-sm font-medium text-slate-500 transition-colors hover:text-[#ef7f1a] dark:text-slate-400 dark:hover:text-orange-300'>
                                        Tozalash
                                    </button>
                                )}
                            </div>

                            <div className='space-y-5'>
                                <div>
                                    <p className='mb-2 text-sm font-medium text-slate-600 dark:text-slate-300'>
                                        Qidiruv
                                    </p>

                                    <input
                                        type='text'
                                        placeholder="Kitob nomi bo'yicha qidirish"
                                        className='mb-4 w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 shadow-sm transition-colors focus:border-[#00a0e3] focus:ring-1 focus:ring-[#00a0e3] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-orange-300 dark:focus:ring-orange-300'
                                    />

                                    <div className='flex flex-wrap gap-2'>
                                        {FORMAT_OPTIONS.map((option) => (
                                            <button
                                                key={option.value || 'all'}
                                                type='button'
                                                onClick={() => patchFilters({ format: option.value })}
                                                className={`rounded-full px-3 py-2 text-sm transition-all ${
                                                    filters.format === option.value
                                                        ? 'bg-slate-950 text-white dark:bg-[#ef7f1a]'
                                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                                }`}>
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className='mb-2 text-sm font-medium text-slate-600 dark:text-slate-300'>Til</p>
                                    <div className='flex flex-wrap gap-2'>
                                        {LANGUAGE_OPTIONS.map((option) => (
                                            <button
                                                key={option.value || 'all'}
                                                type='button'
                                                onClick={() => patchFilters({ language: option.value })}
                                                className={`rounded-full px-3 py-2 text-sm transition-all ${
                                                    filters.language === option.value
                                                        ? 'bg-[#00a0e3] text-white'
                                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                                }`}>
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className='mb-2 text-sm font-medium text-slate-600 dark:text-slate-300'>Janr</p>
                                    <Select
                                        value={filters.category || 'all'}
                                        onValueChange={(value) =>
                                            patchFilters({ category: value === 'all' ? '' : value })
                                        }>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={
                                                    categoriesLoading ? 'Janrlar yuklanmoqda...' : 'Janrni tanlang'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='all'>Barchasi</SelectItem>
                                            {categories.map((category) => (
                                                <SelectItem key={category._id} value={category.slug || category._id}>
                                                    {getCategoryTitle(category)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <p className='mb-2 text-sm font-medium text-slate-600 dark:text-slate-300'>
                                        Muallif
                                    </p>
                                    <Select
                                        value={filters.author || 'all'}
                                        onValueChange={(value) =>
                                            patchFilters({ author: value === 'all' ? '' : value })
                                        }>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Muallifni tanlang' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='all'>Barchasi</SelectItem>
                                            {authorOptions.map((author) => (
                                                <SelectItem key={author.value} value={author.value}>
                                                    {author.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <p className='mb-2 text-sm font-medium text-slate-600 dark:text-slate-300'>
                                        Nashriyot
                                    </p>
                                    <Select
                                        value={filters.publisher || 'all'}
                                        onValueChange={(value) =>
                                            patchFilters({ publisher: value === 'all' ? '' : value })
                                        }>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Nashriyotni tanlang' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='all'>Barchasi</SelectItem>
                                            {publisherOptions.map((publisher) => (
                                                <SelectItem key={publisher.value} value={publisher.value}>
                                                    {publisher.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <p className='mb-2 text-sm font-medium text-slate-600 dark:text-slate-300'>
                                        Narx diapazoni
                                    </p>
                                    <div className='rounded-[1.5rem] border border-slate-200/80 bg-white px-4 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-950'>
                                        <div className='mb-5 flex items-center justify-between gap-3'>
                                            <div className='min-w-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-center text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'>
                                                {formatPricePill(priceRange[0])}
                                            </div>
                                            <div className='min-w-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-center text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'>
                                                {formatPricePill(priceRange[1])}
                                            </div>
                                        </div>

                                        <Slider
                                            min={PRICE_SLIDER_MIN}
                                            max={PRICE_SLIDER_MAX}
                                            step={PRICE_SLIDER_STEP}
                                            value={priceRange}
                                            onValueChange={handlePriceRangeChange}
                                            onValueCommit={handlePriceRangeCommit}
                                            className='px-1'
                                        />

                                        <div className='mt-3 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500'>
                                            <span>0 som</span>
                                            <span>1 000 000 som</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.aside>

                    <motion.section
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.14 }}
                        className='space-y-4'>
                        <div className='rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_80px_-46px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/80'>
                            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
                                        Natijalar paneli
                                    </p>
                                    <h2 className='text-2xl text-slate-900 dark:text-white'>
                                        {pagination.total} ta kitob topildi
                                    </h2>
                                </div>
                                <div className='flex items-center gap-2 rounded-full bg-slate-100 p-1.5 dark:bg-slate-800'>
                                    {GRID_MODE_OPTIONS.map((option) => {
                                        const Icon = option.icon;
                                        const isActive = gridMode === option.value;

                                        return (
                                            <button
                                                key={option.value}
                                                type='button'
                                                onClick={() => setGridMode(option.value)}
                                                aria-label={option.label}
                                                title={option.label}
                                                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                                                    isActive
                                                        ? 'bg-white text-[#00a0e3] shadow-sm dark:bg-slate-900 dark:text-orange-300'
                                                        : 'text-slate-500 hover:bg-white/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                                                }`}>
                                                <Icon size={18} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {activeFilterCount > 0 && (
                                <div className='mt-4 flex flex-wrap gap-2'>
                                    {filters.keyword && (
                                        <button
                                            type='button'
                                            onClick={() => {
                                                setSearchInput('');
                                                patchFilters({ keyword: '' });
                                            }}
                                            className='rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200'>
                                            Qidiruv: {filters.keyword}
                                        </button>
                                    )}
                                    {selectedCategory && (
                                        <button
                                            type='button'
                                            onClick={() => patchFilters({ category: '' })}
                                            className='rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200'>
                                            {getCategoryTitle(selectedCategory)}
                                        </button>
                                    )}
                                    {filters.author && (
                                        <button
                                            type='button'
                                            onClick={() => patchFilters({ author: '' })}
                                            className='rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200'>
                                            {authorOptions.find((option) => option.value === filters.author)?.label ??
                                                'Muallif'}
                                        </button>
                                    )}
                                    {filters.publisher && (
                                        <button
                                            type='button'
                                            onClick={() => patchFilters({ publisher: '' })}
                                            className='rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200'>
                                            {filters.publisher}
                                        </button>
                                    )}
                                    {filters.format && (
                                        <button
                                            type='button'
                                            onClick={() => patchFilters({ format: '' })}
                                            className='rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200'>
                                            {getFormatLabel(filters.format)}
                                        </button>
                                    )}
                                    {filters.language && (
                                        <button
                                            type='button'
                                            onClick={() => patchFilters({ language: '' })}
                                            className='rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200'>
                                            {
                                                LANGUAGE_OPTIONS.find((option) => option.value === filters.language)
                                                    ?.label
                                            }
                                        </button>
                                    )}
                                    {(filters.minPrice || filters.maxPrice) && (
                                        <button
                                            type='button'
                                            onClick={() => patchFilters({ minPrice: '', maxPrice: '' })}
                                            className='rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200'>
                                            {getPriceRangeLabel(filters.minPrice, filters.maxPrice)}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

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
                            <div className={gridClassName}>
                                {Array.from({ length: PAGE_LIMIT }).map((_, index) => (
                                    <BookCardSkeleton key={index} />
                                ))}
                            </div>
                        ) : cardBooks.length > 0 ? (
                            <>
                                <div className={gridClassName}>
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

                                {pagination.pages > 1 && (
                                    <div className='flex flex-wrap items-center justify-center gap-2 pt-3'>
                                        <button
                                            type='button'
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 1}
                                            className='rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300'>
                                            Oldingi
                                        </button>
                                        {pageNumbers.map((pageNumber, index) => {
                                            const previous = pageNumbers[index - 1];
                                            const showDots = previous && pageNumber - previous > 1;

                                            return (
                                                <div key={pageNumber} className='flex items-center gap-2'>
                                                    {showDots && (
                                                        <span className='px-1 text-sm text-slate-400 dark:text-slate-500'>
                                                            ...
                                                        </span>
                                                    )}
                                                    <button
                                                        type='button'
                                                        onClick={() => handlePageChange(pageNumber)}
                                                        className={`h-11 min-w-11 rounded-full px-4 text-sm font-medium transition-all ${
                                                            pageNumber === page
                                                                ? 'bg-slate-950 text-white dark:bg-[#ef7f1a]'
                                                                : 'border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'
                                                        }`}>
                                                        {pageNumber}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                        <button
                                            type='button'
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={page === pagination.pages}
                                            className='rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300'>
                                            Keyingi
                                        </button>
                                    </div>
                                )}
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
