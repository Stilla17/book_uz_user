import { CartItem } from '@/store/features/cartSlice';

const CART_KEY = 'guest_cart';
const CART_PRICE_OVERRIDES_KEY = 'cart_price_overrides';
const FREE_DELIVERY_BOOK_IDS_KEY = 'free_delivery_book_ids';

export const getFreeDeliveryBookIds = (): string[] => {
    if (typeof window === 'undefined') return [];

    try {
        const value = JSON.parse(localStorage.getItem(FREE_DELIVERY_BOOK_IDS_KEY) || '[]');
        return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string' && Boolean(id)) : [];
    } catch {
        return [];
    }
};

export const markFreeDeliveryBook = (productId: string) => {
    if (typeof window === 'undefined' || !productId) return;

    localStorage.setItem(
        FREE_DELIVERY_BOOK_IDS_KEY,
        JSON.stringify(Array.from(new Set([...getFreeDeliveryBookIds(), productId])))
    );
};

export const removeFreeDeliveryBook = (productId: string) => {
    if (typeof window === 'undefined') return;

    const ids = getFreeDeliveryBookIds().filter((id) => id !== productId);
    ids.length
        ? localStorage.setItem(FREE_DELIVERY_BOOK_IDS_KEY, JSON.stringify(ids))
        : localStorage.removeItem(FREE_DELIVERY_BOOK_IDS_KEY);
};

export const clearFreeDeliveryBooks = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(FREE_DELIVERY_BOOK_IDS_KEY);
};

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

export const getCartPriceOverrides = (): Record<string, number> => {
    if (typeof window === 'undefined') return {};

    try {
        const data = localStorage.getItem(CART_PRICE_OVERRIDES_KEY);
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
};

export const getCartPriceOverride = (productId: string) => {
    const price = Number(getCartPriceOverrides()[productId]);
    return Number.isFinite(price) && price >= 0 ? price : undefined;
};

export const saveCartPriceOverride = (productId: string, price: number) => {
    if (typeof window === 'undefined') return;

    const normalizedPrice = Number(price);
    if (!productId || !Number.isFinite(normalizedPrice) || normalizedPrice < 0) return;

    localStorage.setItem(
        CART_PRICE_OVERRIDES_KEY,
        JSON.stringify({
            ...getCartPriceOverrides(),
            [productId]: normalizedPrice
        })
    );
};

export const removeCartPriceOverride = (productId: string) => {
    if (typeof window === 'undefined') return;

    const overrides = getCartPriceOverrides();
    delete overrides[productId];
    localStorage.setItem(CART_PRICE_OVERRIDES_KEY, JSON.stringify(overrides));
};

export const clearCartPriceOverrides = () => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(CART_PRICE_OVERRIDES_KEY);
};
