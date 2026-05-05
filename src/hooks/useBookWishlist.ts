import { useEffect, useState } from 'react';

import { useAuth } from './useAuth';
import { Book } from '@/types/book';
import { isBookInGuestWishlist } from '@/utils/wishlistStorage';

export const useBookWishlist = (book?: Book) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    const { user } = useAuth();

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
    
    return {
        isBookmarked,
        setIsBookmarked,
        favoriteLoading,
        setFavoriteLoading,
        user
    };
};
