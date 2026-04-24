'use client';

import { useEffect, useState } from 'react';

import { type Book } from '@/components/cards/BookCard';
import { useAuth } from '@/hooks/useAuth';
import { UserService } from '@/services/api';
import { getGuestWishlist } from '@/utils/wishlist';

type ServerWishlistBook = {
    _id: string;
    slug?: string;
    title: string | { uz: string; ru?: string; en?: string };
    author?: string | { name: string };
    price: number;
    discountPrice?: number;
    ratingAvg?: number;
    ratingCount?: number;
    stock?: number;
    images?: string[];
};

const mapServerBookToCardBook = (book: ServerWishlistBook): Book => ({
    _id: book._id,
    slug: book.slug,
    title:
        typeof book.title === 'string'
            ? book.title
            : {
                  uz: book.title?.uz || '',
                  ru: book.title?.ru || '',
                  en: book.title?.en || ''
              },
    author: book.author || "Noma'lum muallif",
    price: book.discountPrice && book.discountPrice > 0 ? book.discountPrice : book.price,
    oldPrice: book.discountPrice && book.discountPrice > 0 ? book.price : undefined,
    rating: book.ratingAvg || 0,
    reviewsCount: book.ratingCount || 0,
    stock: book.stock,
    image: book.images?.[0],
    isWishlisted: true
});

export const useWishlistBooks = () => {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [books, setBooks] = useState<Book[]>([]);
    const [loadingBooks, setLoadingBooks] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        const loadBooks = async () => {
            setLoadingBooks(true);

            try {
                if (isAuthenticated) {
                    const response = await UserService.getWishlist();
                    const wishlist = Array.isArray(response?.data) ? response.data : [];
                    setBooks(wishlist.map(mapServerBookToCardBook));
                } else {
                    setBooks(getGuestWishlist().map((book) => ({ ...book, isWishlisted: true })));
                }
            } catch (error) {
                console.error('Kitoblar yuklanmadi:', error);
                setBooks([]);
            } finally {
                setLoadingBooks(false);
            }
        };

        loadBooks();
    }, [authLoading, isAuthenticated]);

    const removeBook = (bookId: string) => {
        setBooks((currentBooks) => currentBooks.filter((book) => book._id !== bookId));
    };

    return {
        books,
        loadingBooks,
        isAuthenticated,
        authLoading,
        removeBook
    };
};
