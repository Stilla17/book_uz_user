export interface SearchProduct {
    _id: string;
    title: {
        uz: string;
        ru?: string;
        en?: string;
    };
    slug: string;
    price: number;
    discountPrice?: number;
    image?: string;
    images?: string[];
    author?: {
        _id: string;
        name: string;
    };
    ratingAvg?: number;
    ratingCount?: number;
    format?: 'ebook' | 'audio' | 'paper';
    language?: string;
    publishYear?: number;
    pages?: number;
    duration?: string;
    views?: number;
    sales?: number;
}

export interface SearchCategory {
    _id: string;
    title: {
        uz: string;
        ru?: string;
        en?: string;
    };
    slug: string;
    count?: number;
    image?: string;
    description?: string;
}

export interface SearchAuthor {
    _id: string;
    name: string;
    image?: string;
    slug: string;
    bookCount?: number;
    bio?: string;
    books?: SearchProduct[];
}

export interface SearchResults {
    products: SearchProduct[];
    categories: SearchCategory[];
    authors: SearchAuthor[];
    totalCount: number;
    totalProducts?: number;
    totalCategories?: number;
    totalAuthors?: number;
    trending?: SearchProduct[];
    recommended?: SearchProduct[];
}

export interface SearchPagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface SearchDropdownProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onClose?: () => void;
}

export type SearchTab = 'all' | 'products' | 'categories' | 'authors';
