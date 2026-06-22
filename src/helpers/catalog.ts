import { CatalogFilters } from '@/types';

export const parsePage = (value: string | null) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const parseList = (value: string | null) => (value ? value.split(',').filter(Boolean) : []);

export const parseFilters = (params: { get: (key: string) => string | null }): CatalogFilters => ({
    keyword: params.get('search') ?? '',
    category: parseList(params.get('category')),
    subgenre: parseList(params.get('subgenre')),
    author: parseList(params.get('author')),
    publisher: parseList(params.get('publisher')),
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
    if (nextFilters.category.length) params.set('category', nextFilters.category.join(','));
    if (nextFilters.subgenre.length) params.set('subgenre', nextFilters.subgenre.join(','));
    if (nextFilters.author.length) params.set('author', nextFilters.author.join(','));
    if (nextFilters.publisher.length) params.set('publisher', nextFilters.publisher.join(','));
    if (nextFilters.language) params.set('language', nextFilters.language);
    if (nextFilters.minPrice) params.set('minPrice', nextFilters.minPrice);
    if (nextFilters.maxPrice) params.set('maxPrice', nextFilters.maxPrice);
    if (nextPage > 1) params.set('page', String(nextPage));
    return params.toString();
}
