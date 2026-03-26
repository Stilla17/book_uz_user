// services/userBanner.service.ts
import { api } from './api';
import { Book } from '@/types'; // Book tipini import qilish (agar kerak bo'lsa)

export interface UserBanner {
  _id: string;
  title: {
    uz: string;
    ru: string;
    en: string;
  };
  subtitle?: {
    uz: string;
    ru: string;
    en: string;
  };
  description?: {
    uz: string;
    ru: string;
    en: string;
  };
  type: 'hero' | 'author' | 'quote' | 'news';
  imageUrl: string;
  buttonText?: {
    uz: string;
    ru: string;
    en: string;
  };
  buttonLink?: string;
  backgroundColor?: string;
  textColor?: string;
  badge?: {
    uz: string;
    ru: string;
    en: string;
  };
  order: number;
  isActive: boolean;
  author?: {
    name?: string;
    nameUz?: string;
    nameRu?: string;
    nameEn?: string;
    shortBio?: {
      uz: string;
      ru: string;
      en: string;
    };
    birthYear?: string;
    deathYear?: string;
    country?: string;
    booksCount?: number;
    authorId?: string;
  };
  selectedBooks?: Array<{
    _id: string;
    title: { uz: string; ru: string; en: string };
    price: number;
    images: string[];
    slug: string;
  }>;
  quote?: {
    text?: {
      uz: string;
      ru: string;
      en: string;
    };
    authorId?: string;
    authorName?: string;
    authorImage?: string;
  };
  views: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface BannerResponse {
  success: boolean;
  message: string;
  data: UserBanner[];
}

export const userBannerService = {
  // Faol bannerlarni olish
  async getActiveBanners(type?: string): Promise<UserBanner[]> {
    try {
      let url = '/banners';
      if (type) {
        url += `?type=${type}`;
      }
      const response = await api.get(url);
      console.log(response);

      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching banners:', error);
      return [];
    }
  },

  // Hero bannerlarni olish
  async getHeroBanners(): Promise<UserBanner[]> {
    return this.getActiveBanners('hero');
  },

  // Author bannerlarni olish
  async getAuthorBanners(): Promise<UserBanner[]> {
    return this.getActiveBanners('author');
  },

  // Quote bannerlarni olish
  async getQuoteBanners(): Promise<UserBanner[]> {
    return this.getActiveBanners('quote');
  },

  // News bannerlarni olish
  async getNewsBanners(): Promise<UserBanner[]> {
    return this.getActiveBanners('news');
  },

  // Bannerni ko'rilgan deb belgilash
  async trackView(bannerId: string): Promise<void> {
    try {
      await api.post(`/banners/${bannerId}/view`);
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  },

  // Bannerni bosilgan deb belgilash
  async trackClick(bannerId: string): Promise<void> {
    try {
      await api.post(`/banners/${bannerId}/click`);
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }
};