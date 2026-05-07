import { useEffect, useState } from 'react';

import { useAuth } from './useAuth';
import { toggleWishlist, type WishlistBook } from '@/store/features/wishlistSlice';
import { useAppDispatch } from '@/store/hooks';
import { Book } from '@/types/book';
import { handleToggleFavorite } from '@/utils/wishlist';
import { isBookInGuestWishlist } from '@/utils/wishlistStorage';
import { useQueryClient } from '@tanstack/react-query';

type UseBookWishlistOptions = {
    queryKeys?: unknown[][];
    onWishlistChange?: (bookId: string, isWishlisted: boolean) => void;
};

const mapBookToWishlistBook = (book: Book): WishlistBook => ({
    _id: book._id,
    title: book.title,
    slug: book.slug,
    price: book.price,
    images: book.images?.length ? book.images : book.image ? [book.image] : [],
    stock: book.stock ?? 0
});

export const useBookWishlist = (book?: Book, options?: UseBookWishlistOptions) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!book?._id) return;

        const isInUserWishlist = user?.wishlist?.some((item) => {
            if (typeof item === 'string') return item === book._id;
            if (item && typeof item === 'object' && '_id' in item) {
                return item._id === book._id;
            }

            return false;
        });

        setIsBookmarked(Boolean(book.isWishlisted || isInUserWishlist || isBookInGuestWishlist(book._id)));
    }, [book?._id, book?.isWishlisted, user?.wishlist]);

    const toggleFavorite = async () => {
        if (!book || favoriteLoading) return;

        const wishlistBook = mapBookToWishlistBook(book);
        const previousBookmarked = isBookmarked;
        const nextBookmarked = !previousBookmarked;

        setIsBookmarked(nextBookmarked);
        setFavoriteLoading(true);
        options?.onWishlistChange?.(book._id, nextBookmarked);
        dispatch(toggleWishlist(wishlistBook));

        try {
            await handleToggleFavorite(book, user?.id ?? user?._id);
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
                ...(options?.queryKeys ?? []).map((queryKey) => queryClient.invalidateQueries({ queryKey }))
            ]);
        } catch (error) {
            setIsBookmarked(previousBookmarked);
            options?.onWishlistChange?.(book._id, previousBookmarked);
            dispatch(toggleWishlist(wishlistBook));
            console.error('Wishlist yangilanmadi:', error);
        } finally {
            setFavoriteLoading(false);
        }
    };

    return {
        isBookmarked,
        setIsBookmarked,
        favoriteLoading,
        setFavoriteLoading,
        toggleFavorite,
        user
    };
};
