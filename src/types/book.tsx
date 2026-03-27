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
    };
    details?: {
        publisher?: string;
        publishedYear?: number;
        pages?: number;
        language?: string;
        isbn?: string;
        weight?: string;
        dimensions?: string;
        cover?: string;
    };
    price: number;
    discountPrice?: number;
    images: string[];
    stock: number;
    category: {
        _id: string;
        name: {
            uz: string;
        };
    };
    author: {
        _id: string;
        name: string;
        bio?: string;
        image?: string;
        booksCount?: number;
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
}

export interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
        avatar?: string;
    };
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
