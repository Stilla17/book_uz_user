import { OtherPagination } from '@/services/api';

export type LocalizedText = { uz?: string; ru?: string; en?: string };

export interface Book {
    _id: string;
    slug?: string;
    title: LocalizedText;
    description?: LocalizedText;
    author?: string | { _id?: string; name: string; bio?: string; image?: string; booksCount?: number };
    authorName?: string | { name: string };
    price: number;
    oldPrice?: number;
    discountPrice?: number;
    reviewsCount?: number;
    ratingAvg?: number;
    ratingCount?: number;
    rating?: number;
    stock?: number;
    branchStocks?: Array<{
        _id?: string;
        storeName?: string;
        storeId: string;
        quantity: number;
        reserve: number;
        available: number;
    }>;
    images?: string[];
    image?: string;
    barcode?: string | number;
    discount?: number;
    isDiscount?: boolean;
    isTop?: boolean;
    isHit?: boolean;
    isNew?: boolean;
    isFree?: boolean;
    isActive?: boolean;
    active?: boolean;
    format?: 'ebook' | 'audio' | 'paper';
    isWishlisted?: boolean;
    category?: Array<{ _id?: string; name?: string; title?: { uz?: string; ru?: string; en?: string } }>;
    contentLanguage?: string;
    numberOfPage?: number;
    year?: number;
    publisherName?: string;
    language?: string;
    cover?: string;
    details?: {
        publisher?: string;
        publisherId?: string;
        publisherName?: string;
        publishedYear?: number;
        pages?: number;
        language?: string;
        isbn?: string | number;
        weight?: string;
        dimensions?: string;
        cover?: string;
    };
    pages?: number;
    weight?: string;
    duration?: string;
    publisher?: string;
    publisherId?: string;
    publishedYear?: number;
    isbn?: string | number;
    views?: number;
    viewsCount?: number;
    sales?: number;
    soldQuantity?: number;
    tags?: string[];
    tegs?: string[];
}

export type Product = Book;

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

export type BookCardProps = {
    book: Book;
    slug?: string;
    onWishlistChange?: (bookId: string, isWishlisted: boolean) => void;
};

// ------------------------------Admin Book-------------------------------------
export type AdminBooksResponse = {
    products: Product[];
    pagination: OtherPagination;
};

export type BookFormValues = {
    title: {
        uz: string;
        ru: string;
        en: string;
    };
    description: {
        uz: string;
        ru: string;
        en: string;
    };
    isbn: string;
    slug: string;
    category: string;
    subCategoryId: string;
    author: string;
    publisher: string;
    language: string;
    contentLanguage: 'latin' | 'cyrillic';
    cover: 'hardcover' | 'paper';
    format: 'paper' | 'ebook' | 'audio';
    pages: number;
    publishedYear: number;
    weight: string;
    dimensions: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    image?: FileList;
    isActive: boolean;
    tags: string;
};
