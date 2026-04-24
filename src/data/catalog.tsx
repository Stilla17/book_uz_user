export const LANGUAGE_OPTIONS = [
    { value: '', label: 'Barcha tillar' },
    { value: 'uz', label: 'Ozbekcha' },
    { value: 'kr', label: 'Kirilcha' },
    { value: 'ru', label: 'Ruscha' },
    { value: 'en', label: 'Inglizcha' }
] as const;

export type CatalogFilters = {
    keyword: string;
    category: string;
    subgenre: string;
    author: string;
    publisher: string;
    language: string;
    minPrice: string;
    maxPrice: string;
};
