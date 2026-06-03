import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type CartBook = {
    _id: string;
    title: string | { uz?: string; ru?: string; en?: string };
    slug?: string;
    price: number;
    images: string | string[];
    stock: number;
    publisher?: string | { _id?: string; id?: string };
    details?: {
        publisher?: string | { _id?: string; id?: string };
    };
};

export type CartItem = {
    book: CartBook;
    quantity: number;
};

type CartState = {
    items: CartItem[];
};

const initialState: CartState = {
    items: []
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // cartlarni massivga saqalash
        setCart: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload;
        },
        // agar cart bolsa yana ustiga qoshilishi uchun, yoq bolsa unda yengi qoshiladi.
        addCart: (state, action: PayloadAction<CartItem>) => {
            const existingItems = state.items.find((item) => item.book._id === action.payload.book._id);

            if (!existingItems) {
                state.items.push(action.payload);
            }
        },
        // ochirib tashlash
        removeCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.book._id !== action.payload);
        },

        clearCart: (state) => {
            state.items = [];
        }
    }
});

export const { setCart, addCart, removeCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
