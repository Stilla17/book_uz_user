export type LocalizedText = string | { uz?: string; ru?: string; en?: string };

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
    barcode?: string;
    discount?: number;
    isNew?: boolean;
    isHit?: boolean;
    isFree?: boolean;
    isTop?: boolean;
    isDiscount?: boolean;
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
        publishedYear?: number;
        pages?: number;
        language?: string;
        isbn?: string;
        weight?: string;
        dimensions?: string;
        cover?: string;
    };
    pages?: number;
    duration?: string;
    publisher?: string;
    publishedYear?: number;
    isbn?: string;
    views?: number;
    sales?: number;
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
