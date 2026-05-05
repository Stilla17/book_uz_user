import { WishlistBook } from '@/store/features/wishlistSlice';

const WISHLIST_KEY = 'guest_wishlist';

export const getWishlistFromLocalStorage = (): WishlistBook[] => {
    if (typeof window === 'undefined') return [];

    try {
        const data = localStorage.getItem(WISHLIST_KEY);
        const wishlist = data ? JSON.parse(data) : [];

        if (!Array.isArray(wishlist)) return [];

        return wishlist
            .map((item) => ('items' in item ? item.items?.[0] : item))
            .filter((item): item is WishlistBook => Boolean(item?._id));
    } catch {
        return [];
    }
};

export const saveWishlistToLocalStorage = (wishlist: WishlistBook[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
};

export const addGuestWishlist = (newItem: WishlistBook) => {
    const wishlist = getWishlistFromLocalStorage();
    const exists = wishlist.some((item) => item._id === newItem._id);
    const newWishlist = exists ? wishlist : [...wishlist, newItem];

    saveWishlistToLocalStorage(newWishlist);
    return newWishlist;
};

export const removeGuestWishlist = (itemId: string) => {
    const wishlist = getWishlistFromLocalStorage();
    const updatedWishlist = wishlist.filter((item) => item._id !== itemId);
    saveWishlistToLocalStorage(updatedWishlist);
    return updatedWishlist;
};

export const toggleGuestWishlist = (newItem: WishlistBook) => {
    const wishlist = getWishlistFromLocalStorage();
    const exists = wishlist.some((item) => item._id === newItem._id);

    const newWishlist = exists ? wishlist.filter((item) => item._id !== newItem._id) : [...wishlist, newItem];

    saveWishlistToLocalStorage(newWishlist);

    return newWishlist;
};

export const isBookInGuestWishlist = (bookId: string) => {
    return getWishlistFromLocalStorage().some((item) => item._id === bookId);
};

export const clearGuestWishlist = () => {
    localStorage.removeItem(WISHLIST_KEY);
    return [];
};
