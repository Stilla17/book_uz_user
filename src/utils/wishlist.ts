import type { Book } from '@/components/cards/BookCard';
import { UserService } from '@/services/api';
import { type WishlistBook } from '@/store/features/wishlistSlice';

import { toggleGuestWishlist } from './wishlistStorage';

export const handleToggleFavorite = async (book: Book, userId?: string | null) => {
    const bookId = book._id;

    if (userId) {
        return UserService.toggleWishlist(bookId);
    }

    const wishlistBook: WishlistBook = {
        _id: book._id,
        title: book.title,
        slug: book.slug,
        price: book.price,
        images: book.images?.length ? book.images : book.image ? [book.image] : [],
        stock: book.stock ?? 0
    };

    return toggleGuestWishlist(wishlistBook);
};
