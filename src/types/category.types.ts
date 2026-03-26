export interface MultiLangField {
  uz: string;
  ru: string;
  en: string;
}

export interface SubCategory {
  _id?: string;
  name: MultiLangField;
  slug: string;
  bookCount?: number;
}

export interface Category {
  _id: string;
  name: MultiLangField;
  slug: string;
  subCategories: SubCategory[];
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
  name: MultiLangField;
  description?: MultiLangField;
  icon?: File | string;
  image?: File | string;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
}

export interface SubCategoryFormData {
  categoryId: string;
  name: MultiLangField;
}