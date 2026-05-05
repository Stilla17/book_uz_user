import { CartItem } from '@/store/features/cartSlice';

const CART_KEY = 'guest_cart';

export const getCartFromLocalStotage = (): CartItem[] => {
    if (typeof window === 'undefined') return [];

    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveCartToLocalStorage = (cart: CartItem[]) => {
    if (typeof window === 'undefined') return;

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addGuestCart = (newItem: CartItem[]) => {
    const cart = getCartFromLocalStotage();

    const existingCart = cart.find((item) => item.book._id === newItem[0].book._id);
    if (!existingCart) {
        cart.push(...newItem);
    }

    saveCartToLocalStorage(cart);
    return cart;
};

export const updateGuestCart = (productId: string, quantity: number) => {
    const cart = getCartFromLocalStotage();
    const updatedCart = cart.map((item) => (item.book._id === productId ? { ...item, quantity } : item));

    saveCartToLocalStorage(updatedCart);
    return updatedCart;
};

export const removeGuestCart = (itemId: string) => {
    const cart = getCartFromLocalStotage();
    const updatedCart = cart.filter((item) => item.book._id !== itemId);

    saveCartToLocalStorage(updatedCart);
    return updatedCart;
};

export const clearGuestCart = () => {
    if (typeof window === 'undefined') return [];

    localStorage.removeItem(CART_KEY);
    return [];
};
