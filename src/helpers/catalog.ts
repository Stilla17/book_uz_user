import { type Book as CardBook } from '@/components/cards/BookCard';
import { CatalogFilters, Product } from '@/types';

export type TextLike =
    | string
    | { uz?: unknown; ru?: unknown; en?: unknown; name?: unknown; title?: unknown }
    | null
    | undefined;
export type ProductShape = Product & {
    title?: TextLike;
    author?: string | { name?: unknown };
};

export const getText = (value: TextLike, fallback: string): string => {
    if (!value) return fallback;
    if (typeof value === 'string') return value || fallback;
    if (typeof value.uz === 'string') return value.uz;
    if (typeof value.ru === 'string') return value.ru;
    if (typeof value.en === 'string') return value.en;
    if (typeof value.name === 'string') return value.name;
    if (typeof value.title === 'string') return value.title;

    return fallback;
};

export const getAuthorName = (author: ProductShape['author']) => {
    if (!author) return "Noma'lum muallif";
    if (typeof author === 'string') return author;

    return getText({ name: author.name }, "Noma'lum muallif");
};

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

export const mapProductToCardBook = (product: Product): CardBook => {
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
        ratingAvg: product.ratingAvg || 0,
        ratingCount: product.ratingCount || 0,
        reviewsCount: product.ratingCount || 0,
        views: product.views,
        viewsCount: product.viewsCount,
        stock: product.stock || 0,
        image: product.images?.[0],
        discount,
        isHit: product.isTop,
        isNew: false,
        format: product.format
    };
};

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
