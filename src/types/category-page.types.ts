export interface CategoryPageProduct {
    _id: string;
    title: {
        uz: string;
        ru?: string;
        en?: string;
    };
    slug: string;
    price: number;
    discountPrice?: number;
    images: string[];
    author: {
        _id: string;
        name: string;
    };
    ratingAvg: number;
    ratingCount: number;
    isTop: boolean;
    isDiscount: boolean;
    format?: 'ebook' | 'audio' | 'paper';
    language?: 'uz' | 'ru' | 'en';
    stock?: number;
}

export interface CategoryPageFilterState {
    minPrice: string;
    maxPrice: string;
    author: string;
    language: string;
    format: string;
    isTop: boolean;
    isDiscount: boolean;
    inStock: boolean;
}

export interface CategoryPagePagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}
