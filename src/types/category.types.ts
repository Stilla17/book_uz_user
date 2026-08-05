import { MultiLangField } from '.';

export interface SubCategory {
    _id?: string;
    title: MultiLangField;
    slug: string;
    bookCount?: number;
    books?: string[];
    name?: string;
}

export interface Category {
    _id: string;
    title: MultiLangField;
    slug: string;
    subCategories: SubCategory[];
    subgenres: SubCategory[];
    icon?: string;
    image?: string;
    description?: MultiLangField;
    order: number;
    isActive: boolean;
    isFeatured: boolean;
    bookCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CategoryFormData {
    title: MultiLangField;
    description?: MultiLangField;
    icon?: File | string;
    image?: File | string;
    order: number;
    isActive: boolean;
    isFeatured: boolean;
}

export interface SubCategoryFormData {
    categoryId: string;
    title: MultiLangField;
}

export type FilterSelectOption = {
    value: string;
    label: string;
};

export type FilterSelectGroup = {
    label: string;
    options: FilterSelectOption[];
};

export type FilterSelectProps = {
    label: string;
    value?: string;
    placeholder: string;
    options?: FilterSelectOption[];
    groups?: FilterSelectGroup[];
    onChange: (value: string) => void;
    allLabel?: string;
    disabled?: boolean;
};

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
    image?: string;
    images?: string[];
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

// ----------------------------Genre for admin type--------------------------------------
export interface Subgenre {
    _id: string;
    slug: string;
    title: MultiLangField;
    books: string[];
    order: number;
    isActive: boolean;
}

export interface Genre {
    _id: string;
    slug: string;
    title: MultiLangField;
    subgenres: Subgenre[];
    order: number;
    isActive: boolean;
    isFeatured: boolean;
    bookCount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSubgenreData {
    _id?: string;
    slug: string;
    title: MultiLangField;
    order?: number;
    isActive?: boolean;
}

export interface CreateGenreData {
    slug: string;
    title: MultiLangField;
    subgenres?: CreateSubgenreData[];
    order?: number;
    isActive?: boolean;
    isFeatured?: boolean;
}
