import type { ReactNode } from 'react';

export type { User, AuthAction, AuthContextType, AuthState } from './auth.types';
export type { AuthorBannerData, Banner, BannerFormData, QuoteBannerData } from './banner.types';
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
    discountAmount?: number;
    couponCode?: string;
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
    type: CouponType;
    value: number;
    discountPercentage?: number;
    applicableProducts?: string[];
    applicablePublishers?: string[];
    applicablePublisherIds?: string[];
    publisherIds?: string[];
    publishers?: string[];
    minOrderAmount?: number;
    maxDiscount?: number;
    startDate: string;
    endDate: string;
    usageLimit: number;
    usedCount: number;
    isActive: boolean;
    isExpired?: boolean;
    isStarted?: boolean;
    isValidByDate?: boolean;
    expiryDate?: string;
    createdAt?: string;
    updatedAt?: string;
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
    couponCode?: string;
    totalAmount: number;
    deliveryFee: number;
    shippingAddress: {
        city: string;
        region: string;
        street: string;
        phone: string;
    };
    deliveryType: 'PICKUP' | 'DELIVERY' | 'POST';
    postDeliveryType?: 'POST_OFFICE' | 'POST_TO_HOME';
    paymentType: 'CASH' | 'CLICK' | 'UZUM' | 'PAYME' | 'XAZNA';
}

export interface PublisherItems {
    _id: string;
    booksCount: number;
    image: string;
    slug?: string;
    name: string;
}

export type CatalogFilters = {
    keyword: string;
    category: string[];
    subgenre: string[];
    author: string[];
    publisher: string[];
    language: string;
    minPrice: string;
    maxPrice: string;
};

export interface MultiLangField {
    uz: string;
    ru: string;
    en: string;
}

export interface StoreLocation {
    id: string;
    city: string;
    region: string;
    address: string;
    phone: string;
    workingHours: string;
    coordinates: string;
    image: string;
    isMain?: boolean;
    books: number;
}

export type NavItem = {
    label: string;
    href: string;
    icon: React.ReactNode;
    description?: string;
    color?: string;
    highlight?: boolean;
};

export type Branch = {
    _id: string;
    branchName?: string;
    name?: string;
    address?: string;
    latitude: number;
    longitude?: number;
};

export type BranchFormData = {
    branchName: string;
    latitude: number;
    longitude: number;
};

export type PromoTargetType = 'book' | 'publisher';
export type CouponType = 'PERCENT' | 'FIXED';
export type PromoDiscountType = 'percentage' | 'amount';

export type PromoFormValues = {
    code: string;
    discountType: PromoDiscountType;
    discountValue: number;
    targetType: PromoTargetType;
    bookIds: string[];
    publisherIds: string[];
    startDate: string;
    endDate: string;
    usageLimit?: number;
    isActive: boolean;
};

export interface CreatePromoPayload {
    code: string;
    type: CouponType;
    value: number;
    discountPercentage?: number;
    applicableProducts?: string[];
    applicablePublishers?: string[];
    applicablePublisherIds?: string[];
    publisherIds?: string[];
    publishers?: string[];
    startDate: string;
    endDate: string;
    usageLimit?: number;
    isActive?: boolean;
}

export interface getPromosResponse {
    _id: string;
    code: string;
    type: CouponType;
    value: number;
    discountPercentage?: number;
    applicableProducts?: string[];
    applicablePublishers?: string[];
    startDate: string;
    endDate: string;
    usageLimit?: number;
    usedCount: number;
    isActive: boolean;
}
