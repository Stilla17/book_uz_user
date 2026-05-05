import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type WishlistBook = {
    _id: string;
    title: string | { uz?: string; ru?: string; en?: string };
    slug?: string;
    price: number;
    images: string[];
    stock: number;
};

export type WishlistItem = {
    items: WishlistBook[];
};

const initialState: WishlistItem = {
    items: []
};

export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        setWishlist: (state, action: PayloadAction<WishlistBook[]>) => {
            state.items = action.payload;
        },

        addWishlist: (state, action: PayloadAction<WishlistBook>) => {
            const exists = state.items.some((item) => item._id === action.payload._id);

            if (!exists) {
                state.items.push(action.payload);
            }
        },

        removeWishlist: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item._id !== action.payload);
        },

        toggleWishlist: (state, action: PayloadAction<WishlistBook>) => {
            const exists = state.items.find((item) => item._id === action.payload._id);

            if (!exists) {
                state.items.push(action.payload);
            } else {
                state.items = state.items.filter((item) => item._id !== action.payload._id);
            }
        },

        clearWishlist: (state) => {
            state.items = [];
        }
    }
});

export const { setWishlist, addWishlist, removeWishlist, toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
