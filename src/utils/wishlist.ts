import { UserService } from '@/services/api';
import type { Book } from '@/components/cards/BookCard';

export const GUEST_WISHLIST_KEY = 'guest_wishlist';

export type GuestWishlistBook = Book;

const isGuestWishlistBook = (value: unknown): value is GuestWishlistBook => {
    return Boolean(value && typeof value === 'object' && '_id' in value);
};

export const getGuestWishlist = (): GuestWishlistBook[] => {
    if (typeof window === 'undefined') return [];

    try {
        const localData = localStorage.getItem(GUEST_WISHLIST_KEY);
        const wishlist = localData ? JSON.parse(localData) : [];

        return Array.isArray(wishlist) ? wishlist.filter(isGuestWishlistBook) : [];
    } catch {
        return [];
    }
};

export const getGuestWishlistProductIds = () => getGuestWishlist().map((book) => book._id);

export const isBookInGuestWishlist = (bookId: string) => getGuestWishlist().some((book) => book._id === bookId);

export const clearGuestWishlist = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(GUEST_WISHLIST_KEY);
};

export const handleToggleFavorite = async (book: GuestWishlistBook, userId?: string | null) => {
    const bookId = book._id;

    if (userId) {
        return UserService.toggleWishlist(bookId);
    }

    let wishlist = getGuestWishlist();
    const isAlreadySaved = wishlist.some((item) => item._id === bookId);

    if (isAlreadySaved) {
        wishlist = wishlist.filter((item) => item._id !== bookId);
    } else {
        wishlist.push(book);
    }

    if (typeof window !== 'undefined') {
        localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(wishlist));
    }

    return { success: true, data: { action: isAlreadySaved ? 'removed' : 'added', wishlist } };
};
