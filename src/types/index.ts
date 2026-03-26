// types/index.ts

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  avatar?: string;
  telegramChatId?: string;
  role?: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
  bio?: string;
}

// Auth Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

// Book Types
export interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount?: number;
  image: string;
  discount?: number;
  isNew?: boolean;
  isHit?: boolean;
  isFree?: boolean;
  isAudio?: boolean;
  format?: "ebook" | "audio" | "paper";
}

export interface AuthorBannerData {
  image: string;
  name: string;
  shortBio?: string;
  description: string;
  birthYear?: string;
  deathYear?: string;
  country?: string;
  booksCount?: number;
  selectedBooks: Book[];
}

// Cart Types
export interface CartItem extends Book {
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken?: string;
    refreshToken?: string;
  };
}

// ========== YANGI QO'SHILGAN SUBSCRIPTION TYPES ==========
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
  period: "month" | "year";
  features: string[];
  featuresRu: string[];
  featuresEn: string[];
  limits: {
    books: number;
    audiobooks: number;
    discount: number;
  };
  isPopular?: boolean;
  icon: React.ReactNode | string;
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

// Category Types
export interface Category {
  _id: string;
  name: {
    uz: string;
    ru: string;
  };
  slug: string;
  icon?: string;
  image?: string;
  description?: {
    uz: string;
    ru: string;
  };
  isActive: boolean;
  order: number;
  count?: number;
}

// Product Types
export interface Product {
  _id: string;
  title: {
    uz: string;
    ru?: string;
    en?: string;
  };
  slug: string;
  description?: {
    uz?: string;
    ru?: string;
    en?: string;
  };
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  category: Category | string;
  author: {
    _id: string;
    name: string;
    bio?: string;
    image?: string;
  };
  language: 'uz' | 'ru' | 'en';
  isTop: boolean;
  isDiscount: boolean;
  ratingAvg: number;
  ratingCount: number;
  format?: 'ebook' | 'audio' | 'paper';
  pages?: number;
  duration?: string;
  publisher?: string;
  publishedYear?: number;
  isbn?: string;
  views?: number;
  sales?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Review Types
export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  product: string;
  rating: number;
  comment: string;
  images?: string[];
  isPurchased: boolean;
  isApproved: boolean;
  createdAt: string;
  likes?: number;
  isLiked?: boolean;
  replies?: Reply[];
  replyCount?: number;
}

export interface Reply {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  comment: string;
  createdAt: string;
  likes?: number;
}

export interface ReviewStats {
  average: number;
  total: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// Order Types
export interface OrderItem {
  product: string | Product;
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

// Address Types
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

// Wishlist Types
export interface Wishlist {
  _id: string;
  user: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

// Coupon Types
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

// Search Types
export interface SearchFilters {
  keyword?: string;
  category?: string;
  author?: string;
  minPrice?: number;
  maxPrice?: number;
  language?: string;
  format?: string;
  isTop?: boolean;
  isDiscount?: boolean;
  inStock?: boolean;
}

export interface SearchResults {
  products: Product[];
  categories: Category[];
  authors: {
    _id: string;
    name: string;
    image?: string;
    slug: string;
    bookCount?: number;
  }[];
  totalCount: number;
  totalProducts: number;
  totalCategories: number;
  totalAuthors: number;
}

// Pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Theme Types
export type Theme = 'light' | 'dark';
export type Language = 'uz' | 'ru' | 'en';
export type Currency = 'UZS' | 'USD' | 'RUB';