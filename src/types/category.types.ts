export interface MultiLangField {
    uz: string;
    ru: string;
    en: string;
}

export interface SubCategory {
    _id?: string;
    title: MultiLangField;
    slug: string;
    bookCount?: number;
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
