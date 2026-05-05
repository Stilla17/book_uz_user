import type { ReactNode } from 'react';

export type { User, AuthAction, AuthContextType, AuthState } from './auth.types';
export type { AuthorBannerData, Banner, BannerFormData, MultiLangField, QuoteBannerData } from './banner.types';
export type { Book, BookCardProps, Product, Reply, Review, ReviewStats } from './book';
export type {
    Category,
    CategoryFormData,
    FilterSelectGroup,
    FilterSelectOption,
    FilterSelectProps,
    SubCategory,
    SubCategoryFormData
} from './category.types';

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: import('./auth.types').User;
        accessToken?: string;
        refreshToken?: string;
    };
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    nameRu: string;
    nameEn: string;
    description?: {
        uz: string;
        ru: string;
        en: string;
    };
    price: number;
    yearlyPrice: number;
    period: 'month' | 'year';
    features: string[];
    featuresRu: string[];
    featuresEn: string[];
    limits: {
        books: number;
        audiobooks: number;
        discount: number;
    };
    isPopular?: boolean;
    icon: ReactNode | string;
    color: string;
    discount?: number;
    savings?: number;
    trialDays?: number;
}

export interface UserSubscription {
    _id: string;
    user: string;
    subscription: SubscriptionPlan | string;
    status: 'active' | 'expired' | 'cancelled' | 'trial';
    period: 'monthly' | 'yearly';
    startDate: string;
    endDate: string;
    autoRenew: boolean;
    paymentMethod?: string;
    price: number;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    product: string | import('./book').Book;
    quantity: number;
    price: number;
}

export interface Order {
    _id: string;
    user: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: {
        fullName: string;
        phone: string;
        city: string;
        region: string;
        street: string;
        apartment?: string;
    };
    paymentMethod: 'card' | 'cash' | 'online';
    paymentStatus: 'paid' | 'unpaid' | 'refunded';
    createdAt: string;
    updatedAt: string;
    trackingNumber?: string;
}

export interface Address {
    _id: string;
    fullName: string;
    phone: string;
    city: string;
    region: string;
    street: string;
    apartment?: string;
    isDefault: boolean;
}

export interface Wishlist {
    _id: string;
    user: string;
    products: import('./book').Book[];
    createdAt: string;
    updatedAt: string;
}

export interface Coupon {
    _id: string;
    code: string;
    discountPercentage: number;
    discountAmount?: number;
    minOrderAmount?: number;
    maxDiscount?: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    description: string;
    descriptionRu: string;
    descriptionEn: string;
}

export type Theme = 'light' | 'dark';
export type Language = 'uz' | 'ru' | 'en';
export type Currency = 'UZS' | 'USD' | 'RUB';

export type CreateCommentPayload = {
    bookId: string;
    name: string;
    text: string;
};

export interface OrderPayload {
    user?: string;
    items: Array<{ product: string; quantity: number; priceAtTime: number }>;
    guestName?: string;
    description?: string;
    totalAmount: number;
    shippingAddress: {
        city: string;
        region: string;
        street: string;
        phone: string;
    };
    deliveryType: 'PICKUP' | 'DELIVERY' | 'POST';
    paymentType: 'CASH' | 'CLICK' | 'UZUM' | 'PAYME' | 'XAZNA';
}
