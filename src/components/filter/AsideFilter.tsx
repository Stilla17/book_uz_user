import React, { useEffect, useMemo, useState } from 'react';

import { LANGUAGE_OPTIONS } from '@/data';
import { useBookFilterQuery } from '@/hooks/queries/useFilter';
import { CatalogFilters } from '@/types';
import type { Category } from '@/types/category.types';

import { Slider } from '../ui/slider';
import FilterSelect from './FilterSelect';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

const PRICE_SLIDER_MIN = 0;
const PRICE_SLIDER_MAX = 1000000;
const PRICE_SLIDER_STEP = 5000;
const SEARCH_DEBOUNCE_MS = 450;

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

const AsideFilter = ({ filters, onChange, onClear }: AsideFilterProps) => {
    const { data, isLoading } = useBookFilterQuery();
    const categories = data?.categories || [];
    const authors = data?.authors || [];
    const publishers = data?.publishers || [];

    const [keywordDraft, setKeywordDraft] = useState(filters.keyword);
    const [priceRange, setPriceRange] = useState<[number, number]>(() => getNormalizedPriceRange(filters));

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

            authors: authors
                .map((author) => ({
                    value: author._id,
                    label: author.name
                }))
                .filter((option) => Boolean(option.value && option.label)),

            publishers: publishers
                .map((publisher) => ({
                    value: publisher._id,
                    label: publisher.name
                }))
                .filter((option) => Boolean(option.value && option.label))
        };
    }, [categories, authors, publishers]);

    const selectedGenre = filters.subgenre || filters.category;
    const hasActiveFilters = Object.values(filters).some(Boolean);

    useEffect(() => {
        setKeywordDraft(filters.keyword);
    }, [filters.keyword]);

    useEffect(() => {
        setPriceRange(getNormalizedPriceRange(filters));
    }, [filters.minPrice, filters.maxPrice]);

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

    const handleGenreChange = (value: string) => {
        if (!value) {
            updateFilters({ category: '', subgenre: '' });
            return;
        }

        const parentCategory = categories.find((category) => category._id === value || category.slug === value);
        if (parentCategory) {
            updateFilters({ category: parentCategory._id || parentCategory.slug, subgenre: '' });
            return;
        }

        const matchedCategory = categories.find((category) => {
            const subgenres = category.subgenres || category.subCategories || [];
            return subgenres.some((subgenre) => subgenre._id === value || subgenre.slug === value);
        });

        updateFilters({
            category: matchedCategory?._id || matchedCategory?.slug || '',
            subgenre: value
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
            className='space-y-4'>
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

                    <FilterSelect
                        label='Janr'
                        placeholder='Janrni tanlang'
                        groups={filterOptions.genres}
                        value={selectedGenre}
                        onChange={handleGenreChange}
                        disabled={isLoading}
                    />

                    <FilterSelect
                        label='Muallif'
                        placeholder='Muallifni tanlang'
                        options={filterOptions.authors}
                        value={filters.author}
                        onChange={(value) => updateFilters({ author: value })}
                        disabled={isLoading}
                    />

                    <FilterSelect
                        label='Nashriyot'
                        placeholder='Nashriyotni tanlang'
                        options={filterOptions.publishers}
                        value={filters.publisher}
                        onChange={(value) => updateFilters({ publisher: value })}
                        disabled={isLoading}
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
