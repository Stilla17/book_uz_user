export interface CatalogProduct {
    _id: string;
    title: {
        uz: string;
        ru?: string;
        en?: string;
    };
    slug: string;
    description?: {
        uz?: string;
    };
    price: number;
    discountPrice?: number;
    images: string[];
    stock: number;
    category: {
        _id: string;
        title: {
            uz: string;
        };
    };
    author: {
        _id: string;
        name: string;
    };
    language: 'uz' | 'ru' | 'en';
    isTop: boolean;
    isDiscount: boolean;
    ratingAvg: number;
    ratingCount: number;
    format?: 'ebook' | 'audio' | 'paper';
}

export interface CatalogFilterState {
    keyword: string;
    category: string;
    author: string;
    minPrice: string;
    maxPrice: string;
    language: string;
    format: string;
    isTop: boolean;
    isDiscount: boolean;
    inStock: boolean;
}

export interface CatalogPagination {
    total: number;
    page: number;
    pages: number;
    limit: number;
}
