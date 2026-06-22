import React, { useEffect, useMemo, useState } from 'react';

import { LANGUAGE_OPTIONS } from '@/data';
import { useBookFilterQuery } from '@/hooks/queries/useFilter';
import { filterService } from '@/services/filter.service';
import { CatalogFilters } from '@/types';
import type { Category } from '@/types/category.types';

import { Slider } from '../ui/slider';
import MultiFilterSelect from './MultiFilterSelect';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const PRICE_SLIDER_MIN = 0;
const PRICE_SLIDER_MAX = 1000000;
const PRICE_SLIDER_STEP = 5000;
const SEARCH_DEBOUNCE_MS = 450;
const ENTITY_SEARCH_MIN_LENGTH = 2;

type AsideFilterProps = {
    filters: CatalogFilters;
    onChange: (filters: CatalogFilters, page?: number) => void;
    onClear: () => void;
};

const parsePriceValue = (value: string, fallback: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const getCategoryLabel = (category: Category) => {
    return category.title?.uz || category.title?.ru || category.title?.en || category.slug || category._id;
};

const getNormalizedPriceRange = (filters: CatalogFilters): [number, number] => {
    const minPrice = parsePriceValue(filters.minPrice, PRICE_SLIDER_MIN);
    const maxPrice = parsePriceValue(filters.maxPrice, PRICE_SLIDER_MAX);
    const clampedMin = Math.max(PRICE_SLIDER_MIN, Math.min(minPrice, PRICE_SLIDER_MAX));
    const clampedMax = Math.min(PRICE_SLIDER_MAX, Math.max(maxPrice, PRICE_SLIDER_MIN));

    return clampedMin <= clampedMax ? [clampedMin, clampedMax] : [clampedMax, clampedMin];
};

const mergeEntitiesById = <T extends { _id: string }>(baseItems: T[], extraItems: T[]) => {
    const entitiesById = new Map<string, T>();

    [...baseItems, ...extraItems].forEach((item) => {
        if (item._id) {
            entitiesById.set(item._id, item);
        }
    });

    return Array.from(entitiesById.values());
};

const AsideFilter = ({ filters, onChange, onClear }: AsideFilterProps) => {
    const { data, isLoading } = useBookFilterQuery();
    const categories = data?.categories || [];
    const authors = data?.authors || [];
    const publishers = data?.publishers || [];

    const [keywordDraft, setKeywordDraft] = useState(filters.keyword);
    const [authorSearch, setAuthorSearch] = useState('');
    const [publisherSearch, setPublisherSearch] = useState('');
    const [debouncedAuthorSearch, setDebouncedAuthorSearch] = useState('');
    const [debouncedPublisherSearch, setDebouncedPublisherSearch] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>(() => getNormalizedPriceRange(filters));

    const authorSearchQuery = useQuery({
        queryKey: ['book-filter', 'authors-search', debouncedAuthorSearch],
        queryFn: () => filterService.searchAuthors(debouncedAuthorSearch),
        enabled: debouncedAuthorSearch.length >= ENTITY_SEARCH_MIN_LENGTH,
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false
    });

    const publisherSearchQuery = useQuery({
        queryKey: ['book-filter', 'publishers-search', debouncedPublisherSearch],
        queryFn: () => filterService.searchPublishers(debouncedPublisherSearch),
        enabled: debouncedPublisherSearch.length >= ENTITY_SEARCH_MIN_LENGTH,
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false
    });

    const visibleAuthors = useMemo(
        () =>
            debouncedAuthorSearch.length >= ENTITY_SEARCH_MIN_LENGTH
                ? mergeEntitiesById(
                      authors.filter((author) => filters.author.includes(author._id)),
                      authorSearchQuery.data ?? []
                  )
                : authors,
        [authors, authorSearchQuery.data, debouncedAuthorSearch.length, filters.author]
    );

    const visiblePublishers = useMemo(
        () =>
            debouncedPublisherSearch.length >= ENTITY_SEARCH_MIN_LENGTH
                ? mergeEntitiesById(
                      publishers.filter((publisher) => filters.publisher.includes(publisher._id)),
                      publisherSearchQuery.data ?? []
                  )
                : publishers,
        [debouncedPublisherSearch.length, filters.publisher, publisherSearchQuery.data, publishers]
    );

    const filterOptions = useMemo(() => {
        return {
            genres: categories
                .map((category: Category) => {
                    const categoryLabel = getCategoryLabel(category);
                    const subgenres = category.subgenres || category.subCategories || [];

                    return {
                        label: categoryLabel,
                        options: [
                            {
                                value: category._id || category.slug,
                                label: categoryLabel
                            },
                            ...subgenres.map((subgenre) => ({
                                value: subgenre._id || subgenre.slug,
                                label: subgenre.title?.uz || subgenre.title?.ru || subgenre.title?.en || subgenre.slug
                            }))
                        ].filter((option) => Boolean(option.value && option.label))
                    };
                })
                .filter((group) => group.options.length > 0),

            authors: visibleAuthors
                .map((author) => ({
                    value: author._id,
                    label: author.name
                }))
                .filter((option) => Boolean(option.value && option.label)),

            publishers: visiblePublishers
                .map((publisher) => ({
                    value: publisher._id,
                    label: publisher.name
                }))
                .filter((option) => Boolean(option.value && option.label))
        };
    }, [categories, visibleAuthors, visiblePublishers]);

    const selectedGenre = [...filters.category, ...filters.subgenre];
    const hasActiveFilters = Object.values(filters).some((value) => (Array.isArray(value) ? value.length > 0 : Boolean(value)));

    useEffect(() => {
        setKeywordDraft(filters.keyword);
    }, [filters.keyword]);

    useEffect(() => {
        setPriceRange(getNormalizedPriceRange(filters));
    }, [filters.minPrice, filters.maxPrice]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedAuthorSearch(authorSearch.trim());
        }, SEARCH_DEBOUNCE_MS);

        return () => window.clearTimeout(timeoutId);
    }, [authorSearch]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedPublisherSearch(publisherSearch.trim());
        }, SEARCH_DEBOUNCE_MS);

        return () => window.clearTimeout(timeoutId);
    }, [publisherSearch]);

    useEffect(() => {
        const nextKeyword = keywordDraft.trim();
        if (nextKeyword === filters.keyword) return;

        const timeoutId = window.setTimeout(() => {
            onChange({ ...filters, keyword: nextKeyword }, 1);
        }, SEARCH_DEBOUNCE_MS);

        return () => window.clearTimeout(timeoutId);
    }, [filters, keywordDraft, onChange]);

    const updateFilters = (partialFilters: Partial<CatalogFilters>) => {
        onChange({ ...filters, ...partialFilters }, 1);
    };

    const handleGenreChange = (values: string[]) => {
        const categoryValues: string[] = [];
        const subgenreValues: string[] = [];

        values.forEach((value) => {
            const parentCategory = categories.find((category) => category._id === value || category.slug === value);

            if (parentCategory) {
                categoryValues.push(parentCategory._id || parentCategory.slug);
            } else {
                subgenreValues.push(value);
            }
        });

        updateFilters({
            category: categoryValues,
            subgenre: subgenreValues
        });
    };

    const formatPricePill = (value: number) => {
        if (value >= 1000000) {
            const millions = value / 1000000;
            return `${Number.isInteger(millions) ? millions : millions.toFixed(1)} mln`;
        }

        return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)} ming`;
    };

    const handlePriceRangeChange = (values: number[]) => {
        if (values.length !== 2) return;
        setPriceRange([values[0], values[1]]);
    };

    const handlePriceRangeCommit = (values: number[]) => {
        if (values.length !== 2) return;
        const [minValue, maxValue] = values;

        updateFilters({
            minPrice: minValue <= PRICE_SLIDER_MIN ? '' : String(minValue),
            maxPrice: maxValue >= PRICE_SLIDER_MAX ? '' : String(maxValue)
        });
    };

    return (
        <motion.aside
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className='space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto'>
            <div className='rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_80px_-46px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/80'>
                <div className='mb-4 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <Filter size={18} className='text-[#00a0e3] dark:text-orange-300' />
                        <h3 className='text-xl text-slate-900 dark:text-white'>Filterlar</h3>
                    </div>

                    <button
                        type='button'
                        onClick={onClear}
                        disabled={!hasActiveFilters}
                        className='text-sm font-medium text-slate-500 transition-colors hover:text-[#ef7f1a] disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:text-orange-300'>
                        Tozalash
                    </button>
                </div>

                <div className='space-y-5'>
                    <div>
                        <p className='mb-2 text-sm font-medium text-slate-600 dark:text-slate-300'>Qidiruv</p>
                        <input
                            type='text'
                            value={keywordDraft}
                            onChange={(event) => setKeywordDraft(event.target.value)}
                            placeholder="Kitob nomi bo'yicha qidirish"
                            className='mb-4 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition-colors focus:outline-[#ef7f1a]/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-orange-300 dark:focus:ring-orange-300'
                        />
                    </div>

                    <div>
                        <p className='mb-2 text-sm font-medium text-slate-600 dark:text-slate-300'>Til</p>
                        <div className='flex flex-wrap gap-2'>
                            {LANGUAGE_OPTIONS.map((option) => {
                                const isActive = filters.language === option.value;

                                return (
                                    <button
                                        key={option.value || 'all'}
                                        type='button'
                                        onClick={() => updateFilters({ language: option.value })}
                                        className={`rounded-full px-3 py-2 text-sm transition-all ${
                                            isActive
                                                ? 'bg-[#ef7f1a] text-white hover:bg-black'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                                        }`}>
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <MultiFilterSelect
                        label='Janr'
                        placeholder='Janrni tanlang'
                        groups={filterOptions.genres}
                        value={selectedGenre}
                        onChange={handleGenreChange}
                        disabled={isLoading}
                    />

                    <MultiFilterSelect
                        label='Muallif'
                        placeholder='Muallifni tanlang'
                        options={filterOptions.authors}
                        value={filters.author}
                        onChange={(value) => updateFilters({ author: value })}
                        disabled={isLoading}
                        searchValue={authorSearch}
                        onSearchChange={setAuthorSearch}
                        isSearching={authorSearchQuery.isFetching}
                    />

                    <MultiFilterSelect
                        label='Nashriyot'
                        placeholder='Nashriyotni tanlang'
                        options={filterOptions.publishers}
                        value={filters.publisher}
                        onChange={(value) => updateFilters({ publisher: value })}
                        disabled={isLoading}
                        searchValue={publisherSearch}
                        onSearchChange={setPublisherSearch}
                        isSearching={publisherSearchQuery.isFetching}
                    />

                    <div>
                        <p className='mb-2 text-sm font-medium text-slate-600 dark:text-slate-300'>Narx diapazoni</p>
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
    );
};

export default AsideFilter;
