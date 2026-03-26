export interface MultiLangField {
  uz: string;
  ru: string;
  en: string;
}

export interface AuthorBannerData {
  name?: string;
  nameUz?: string;
  nameRu?: string;
  nameEn?: string;
  shortBio?: MultiLangField;
  birthYear?: string;
  deathYear?: string;
  country?: string;
  booksCount?: number;
  authorId?: string;
}

export interface QuoteBannerData {
  text?: MultiLangField;
  authorId?: string;
  authorName?: string;
  authorImage?: string;
}

export interface Banner {
  _id: string;
  title: MultiLangField;
  subtitle?: MultiLangField;
  description?: MultiLangField;
  type: 'hero' | 'author' | 'quote' | 'news';
  imageUrl: string;
  buttonText?: MultiLangField;
  buttonLink?: string;
  backgroundColor?: string;
  textColor?: string;
  badge?: MultiLangField;
  order: number;
  isActive: boolean;
  author?: AuthorBannerData;
  selectedBooks?: string[];
  quote?: QuoteBannerData;
  views: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface BannerFormData {
  title: MultiLangField;
  subtitle?: MultiLangField;
  description?: MultiLangField;
  type: 'hero' | 'author' | 'quote' | 'news';
  image?: File | string;
  buttonText?: MultiLangField;
  buttonLink?: string;
  backgroundColor?: string;
  textColor?: string;
  badge?: MultiLangField;
  order: number;
  isActive: boolean;
  author?: AuthorBannerData;
  selectedBooks?: string[];
  quote?: QuoteBannerData;
}