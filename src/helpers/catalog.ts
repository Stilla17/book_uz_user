import { CatalogFilters } from '@/types';

export const parsePage = (value: string | null) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

export const parseFilters = (params: { get: (key: string) => string | null }): CatalogFilters => ({
    keyword: params.get('search') ?? '',
    category: params.get('category') ?? '',
    subgenre: params.get('subgenre') ?? '',
    author: params.get('author') ?? '',
    publisher: params.get('publisher') ?? '',
    language: params.get('language') ?? '',
    minPrice: params.get('minPrice') ?? '',
    maxPrice: params.get('maxPrice') ?? ''
});

export const getLanguageParams = (language: string) => {
    if (language === 'kr') {
        return { language: 'uz', contentLanguage: 'cyrillic' };
    }

    if (language === 'uz') {
        return { language: 'uz', contentLanguage: 'latin' };
    }

    return language ? { language } : {};
};

export function buildQueryString(nextFilters: CatalogFilters, nextPage: number) {
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
