'use client';

import { useEffect, useState } from 'react';

import { type Book } from '@/components/cards/BookCard';
import { type LocalizedText } from '@/types/book';
import { useAuth } from '@/hooks/useAuth';
import { UserService } from '@/services/api';
import { setWishlist, type WishlistBook } from '@/store/features/wishlistSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getWishlistFromLocalStorage } from '@/utils/wishlistStorage';

type ServerWishlistBook = {
    _id: string;
    slug?: string;
    title: string | { uz?: string; ru?: string; en?: string };
    author?: string | { name: string };
    price: number;
    discountPrice?: number;
    ratingAvg?: number;
    ratingCount?: number;
    stock?: number;
    images?: string[];
};

const getArrayData = (response: any) => {
    const data = response?.data?.data ?? response?.data ?? response;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.wishlist)) return data.wishlist;
    if (Array.isArray(data?.items)) return data.items;

    return [];
};

const normalizeWishlistBook = (item: any): WishlistBook | null => {
    const book = item?.book ?? item?.product ?? item;
    if (!book || typeof book !== 'object' || !book._id) return null;

    return {
        _id: book._id,
        slug: book.slug,
        title: book.title ?? "Noma'lum kitob",
        price: book.discountPrice && book.discountPrice > 0 ? book.discountPrice : book.price ?? 0,
        images: Array.isArray(book.images) ? book.images : book.image ? [book.image] : [],
        stock: book.stock ?? 0
    };
};

type WishlistCardSource = WishlistBook & {
    author?: string | { name: string };
    discountPrice?: number;
    ratingAvg?: number;
    ratingCount?: number;
};

const toLocalizedText = (title: WishlistBook['title']): LocalizedText => {
    if (typeof title === 'string') {
        return { uz: title, ru: title, en: title };
    }

    return {
        uz: title?.uz || '',
        ru: title?.ru || '',
        en: title?.en || ''
    };
};

const mapWishlistBookToCardBook = (book: WishlistCardSource): Book => ({
    _id: book._id,
    slug: book.slug,
    title: toLocalizedText(book.title),
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
    const dispatch = useAppDispatch();
    const wishlistItems = useAppSelector((state) => state.wishlist.items);
    const [books, setBooks] = useState<Book[]>([]);
    const [loadingBooks, setLoadingBooks] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        const loadBooks = async () => {
            setLoadingBooks(true);

            try {
                if (isAuthenticated) {
                    const response = await UserService.getWishlist();
                    const wishlist = getArrayData(response)
                        .map((item: any) => normalizeWishlistBook(item))
                        .filter((item: WishlistBook | null): item is WishlistBook => Boolean(item));

                    dispatch(setWishlist(wishlist));
                    setBooks(wishlist.map(mapWishlistBookToCardBook));
                } else {
                    const guestWishlist = getWishlistFromLocalStorage();

                    dispatch(setWishlist(guestWishlist));
                    setBooks(guestWishlist.map(mapWishlistBookToCardBook));
                }
            } catch (error) {
                console.error('Kitoblar yuklanmadi:', error);
                setBooks([]);
            } finally {
                setLoadingBooks(false);
            }
        };

        loadBooks();
    }, [authLoading, dispatch, isAuthenticated]);

    useEffect(() => {
        if (loadingBooks) return;
        setBooks(wishlistItems.map(mapWishlistBookToCardBook));
    }, [loadingBooks, wishlistItems]);

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
